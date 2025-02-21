import remarkGfm from "remark-gfm";
import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import rehypeSlug from "rehype-slugs";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ["md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings, rehypeHighlight],
  },
});

export default withMDX(nextConfig);
