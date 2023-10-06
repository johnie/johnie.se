// contentlayer.config.js
import { readFileSync } from "fs";
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import readingTime from "reading-time";
var computedFields = {
  slug: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath
  },
  readingTime: {
    type: "string",
    resolve: (doc) => readingTime(doc.body.raw, { wordsPerMinute: 275 }).text
  },
  structuredData: {
    type: "object",
    resolve: (doc) => ({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: doc.title,
      datePublished: doc.publishedAt,
      dateModified: doc.publishedAt,
      description: doc.summary,
      image: doc.image ? `https://johnie.se${doc.image}` : `https://johnie.se/og?title=${doc.title}`,
      url: `https://johnie.se/writings/${doc._raw.flattenedPath}`,
      author: {
        "@type": "Person",
        name: "Johnie Hjelm"
      }
    })
  }
};
var Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true
    },
    publishedAt: {
      type: "string",
      required: true
    },
    summary: {
      type: "string",
      required: true
    },
    image: {
      type: "string"
    }
  },
  computedFields
}));
var Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `page/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true
    },
    summary: {
      type: "string"
    },
    image: {
      type: "string"
    }
  }
}));
var Work = defineDocumentType(() => ({
  name: "Work",
  filePathPattern: `work/**/*.yml`,
  contentType: "yml",
  fields: {
    company: {
      type: "string",
      required: true
    },
    role: {
      type: "string",
      required: true
    },
    url: {
      type: "string"
    },
    startYear: {
      type: "number",
      required: true
    },
    endYear: {
      type: "number"
    },
    present: {
      type: "boolean"
    },
    image: {
      type: "string"
    }
  }
}));
var Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `projects/**/*.yml`,
  contentType: "yml",
  fields: {
    name: {
      type: "string",
      required: true
    },
    description: {
      type: "string",
      required: true
    },
    url: {
      type: "string"
    },
    projectType: {
      type: "string"
    },
    image: {
      type: "string"
    },
    order: {
      type: "number"
    }
  }
}));
var contentlayer_config_default = makeSource({
  contentDirPath: "content",
  documentTypes: [Post, Page, Work, Project],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: JSON.parse(readFileSync(new URL("../../../themes/will.json", import.meta.url))),
          onVisitLine(node) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className.push("line--highlighted");
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ["word--highlighted"];
          }
        }
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["anchor"]
          }
        }
      ]
    ]
  }
});
export {
  Page,
  Post,
  Project,
  Work,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-6SLM6C22.mjs.map
