// Copies the Turso (libSQL) database into Cloudflare D1, then verifies the copy
// against the same snapshot.
//
// Usage:
//   node --env-file=.env.vercel.production.local scripts/turso-to-d1.mjs \
//     --database johnie [--local] [--replace]
//
// The Turso snapshot is written to .wrangler/turso-to-d1/ (gitignored) before
// anything touches D1, so every run also leaves a restorable SQL backup.
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { isDeepStrictEqual, parseArgs } from "node:util";

import { createClient } from "@libsql/client";

// Internal SQLite, libSQL, and D1 objects that must not be copied.
const SCHEMA_QUERY = `SELECT type, name, sql FROM sqlite_master
  WHERE sql IS NOT NULL
    AND name NOT LIKE 'sqlite\\_%' ESCAPE '\\'
    AND name NOT LIKE '\\_cf\\_%' ESCAPE '\\'
    AND name NOT LIKE 'libsql\\_%' ESCAPE '\\'
    AND name NOT LIKE '\\_litestream\\_%' ESCAPE '\\'
  ORDER BY CASE type WHEN 'table' THEN 0 WHEN 'index' THEN 1 WHEN 'view' THEN 2 ELSE 3 END, name`;

const HAS_SEQUENCE_QUERY =
  "SELECT count(*) AS present FROM sqlite_master WHERE name = 'sqlite_sequence'";

const SEQUENCE_QUERY =
  "SELECT quote(name) AS name, quote(seq) AS seq FROM sqlite_sequence ORDER BY name";

const COLUMNS_QUERY = "SELECT name FROM pragma_table_info(?) ORDER BY cid";
const OUTPUT_DIR = ".wrangler/turso-to-d1";
const MAX_OUTPUT_BYTES = 256 * 1024 * 1024;

const { values: args } = parseArgs({
  options: {
    database: { type: "string" },
    local: { default: false, type: "boolean" },
    replace: { default: false, type: "boolean" },
  },
});

if (!args.database) {
  throw new Error("Missing --database <d1-database-name>");
}

const { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } = process.env;

if (!(TURSO_AUTH_TOKEN && TURSO_DATABASE_URL)) {
  throw new Error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set");
}

const quoteIdentifier = (name) => `"${name.replaceAll('"', '""')}"`;

// SQLite's quote() renders each value as a literal that round-trips with its
// storage class (INTEGER, REAL, TEXT, BLOB, NULL), so no JS conversion is needed.
const selectLiterals = ({ columns, name }) => {
  const literals = columns.map(
    (column) =>
      `quote(${quoteIdentifier(column)}) AS ${quoteIdentifier(column)}`
  );

  return `SELECT ${literals.join(", ")} FROM ${quoteIdentifier(name)}`;
};

const toLiteralRows = (columns, rows) =>
  rows
    .map((row) => JSON.stringify(columns.map((column) => row[column])))
    .toSorted();

const toSequences = (rows) => rows.map(({ name, seq }) => ({ name, seq }));

const readTursoSnapshot = async () => {
  const client = createClient({
    authToken: TURSO_AUTH_TOKEN,
    url: TURSO_DATABASE_URL,
  });

  // A read transaction gives one consistent snapshot while production writes.
  const transaction = await client.transaction("read");

  try {
    const [schemaResult, sequenceResult] = await transaction.batch([
      SCHEMA_QUERY,
      HAS_SEQUENCE_QUERY,
    ]);

    const schema = schemaResult.rows.map(({ name, sql, type }) => ({
      name,
      sql,
      type,
    }));

    const tableNames = schema
      .filter(({ type }) => type === "table")
      .map(({ name }) => name);

    const columnResults = await transaction.batch(
      tableNames.map((name) => ({ args: [name], sql: COLUMNS_QUERY }))
    );

    const tables = tableNames.map((name, index) => ({
      columns: columnResults[index].rows.map((row) => row.name),
      name,
    }));

    const hasSequence = sequenceResult.rows[0].present > 0;

    const dataResults = await transaction.batch([
      ...tables.map(selectLiterals),
      ...(hasSequence ? [SEQUENCE_QUERY] : []),
    ]);

    return {
      schema,
      sequences: hasSequence ? toSequences(dataResults.at(-1).rows) : [],
      tables: tables.map((table, index) => ({
        ...table,
        rows: toLiteralRows(table.columns, dataResults[index].rows),
      })),
    };
  } finally {
    transaction.close();
    client.close();
  }
};

const buildImportSql = ({ schema, sequences, tables }) => {
  const statements = ["PRAGMA defer_foreign_keys = true;"];

  const droppable = schema.filter(
    ({ type }) => type === "table" || type === "view"
  );

  for (const { name, type } of droppable.toReversed()) {
    statements.push(
      `DROP ${type.toUpperCase()} IF EXISTS ${quoteIdentifier(name)};`
    );
  }

  for (const { sql, type } of schema) {
    if (type === "table") {
      statements.push(`${sql};`);
    }
  }

  for (const { columns, name, rows } of tables) {
    const columnList = columns.map(quoteIdentifier).join(", ");

    for (const row of rows) {
      const values = JSON.parse(row).join(", ");

      statements.push(
        `INSERT INTO ${quoteIdentifier(name)} (${columnList}) VALUES (${values});`
      );
    }
  }

  // Preserve AUTOINCREMENT high-water marks so deleted ids are never reused.
  for (const { name, seq } of sequences) {
    statements.push(
      `DELETE FROM sqlite_sequence WHERE name = ${name};`,
      `INSERT INTO sqlite_sequence (name, seq) VALUES (${name}, ${seq});`
    );
  }

  for (const { sql, type } of schema) {
    if (type !== "table") {
      statements.push(`${sql};`);
    }
  }

  return `${statements.join("\n")}\n`;
};

const wrangler = (...wranglerArgs) => {
  const target = args.local ? "--local" : "--remote";

  const result = spawnSync(
    "pnpm",
    [
      "exec",
      "wrangler",
      "d1",
      "execute",
      args.database,
      target,
      ...wranglerArgs,
    ],
    {
      encoding: "utf-8",
      maxBuffer: MAX_OUTPUT_BYTES,
      stdio: ["ignore", "pipe", "inherit"],
    }
  );

  if (result.status !== 0) {
    throw new Error(`wrangler exited with ${result.status}:\n${result.stdout}`);
  }

  return result.stdout;
};

const queryD1 = (sql) => {
  const [result] = JSON.parse(wrangler("--json", "--command", sql));

  return result.results;
};

const assertTargetIsEmpty = () => {
  const existing = queryD1(SCHEMA_QUERY);

  if (existing.length > 0 && !args.replace) {
    const names = existing.map(({ name }) => name).join(", ");

    throw new Error(
      `D1 database "${args.database}" already contains: ${names}. Re-run with --replace to drop and overwrite them with the Turso snapshot.`
    );
  }
};

const verify = ({ schema, sequences, tables }) => {
  const failures = [];

  if (!isDeepStrictEqual(queryD1(SCHEMA_QUERY), schema)) {
    failures.push("schema differs");
  }

  for (const table of tables) {
    const d1Rows = toLiteralRows(table.columns, queryD1(selectLiterals(table)));
    const matches = isDeepStrictEqual(d1Rows, table.rows);

    console.log(
      `${matches ? "ok  " : "FAIL"} ${table.name}: turso=${table.rows.length} d1=${d1Rows.length}`
    );

    if (!matches) {
      failures.push(`rows differ in ${table.name}`);
    }
  }

  const d1Sequences =
    sequences.length > 0 ? toSequences(queryD1(SEQUENCE_QUERY)) : [];

  if (!isDeepStrictEqual(d1Sequences, sequences)) {
    failures.push("sqlite_sequence differs");
  }

  if (failures.length > 0) {
    throw new Error(`Verification failed: ${failures.join("; ")}`);
  }
};

const snapshot = await readTursoSnapshot();
const timestamp = new Date().toISOString().replaceAll(":", "-");
const outputPath = path.join(OUTPUT_DIR, `turso-${timestamp}.sql`);

mkdirSync(OUTPUT_DIR, { recursive: true });

writeFileSync(outputPath, buildImportSql(snapshot));

console.log(`Wrote Turso snapshot to ${outputPath}`);

assertTargetIsEmpty();

wrangler("--yes", "--file", outputPath);

console.log(`Imported ${outputPath} into D1 database "${args.database}"`);

verify(snapshot);

console.log(`D1 database "${args.database}" matches the Turso snapshot.`);
