import type { NextConfig } from 'next';

const staticExport = process.env.RENODIA_STATIC_EXPORT === "1";

const config: NextConfig = {
  ...(staticExport && { output: "export", trailingSlash: true, images: { unoptimized: true } }),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  devIndicators: false,
  distDir: process.env.RENODIA_BUILD_DIR || ".next",
};
export default config;
