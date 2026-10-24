import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const createServerEnv = () =>
  createEnv({
    emptyStringAsUndefined: true,
    runtimeEnv: process.env,
    server: {
      SPOTIFY_API_CLIENT_ID: z.string().min(1),
      SPOTIFY_API_CLIENT_SECRET: z.string().min(1),
      SPOTIFY_API_REFRESH_TOKEN: z.string().min(1),
    },
  });

let serverEnv: ReturnType<typeof createServerEnv> | undefined;

export const getServerEnv = () => {
  serverEnv ??= createServerEnv();

  return serverEnv;
};
