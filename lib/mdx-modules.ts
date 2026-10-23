import type { MDXContent } from "mdx/types";
import { lazy } from "react";
import type { LazyExoticComponent } from "react";

interface MdxModule {
  default: MDXContent;
}

const loaders = {
  ...import.meta.glob<MdxModule>("/content/*.mdx"),
  ...import.meta.glob<MdxModule>("/content/page/*.mdx"),
  ...import.meta.glob<MdxModule>("/content/til/*.mdx"),
} satisfies Record<string, () => Promise<MdxModule>>;

type MdxComponent = MDXContent | LazyExoticComponent<MDXContent>;

const components = new Map<string, MdxComponent>();

const getLoader = (mdxPath: string) => {
  const load = loaders[mdxPath];

  if (!load) {
    throw new Error(`Missing MDX module: ${mdxPath}`);
  }

  return load;
};

export const preloadMdx = async (mdxPath: string): Promise<void> => {
  const module = await getLoader(mdxPath)();

  // Seed the resolved component so navigation never commits the lazy fallback.
  components.set(mdxPath, module.default);
};

export const getMdxComponent = (mdxPath: string): MdxComponent => {
  let component = components.get(mdxPath);

  if (!component) {
    component = lazy(getLoader(mdxPath));
    components.set(mdxPath, component);
  }

  return component;
};
