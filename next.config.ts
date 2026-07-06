import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project (a stray lockfile in the user's
  // home directory otherwise makes Next infer the wrong root).
  outputFileTracingRoot: path.join(__dirname),
  // Produce a fully static site in ./out for Firebase Hosting
  output: "export",
  images: {
    unoptimized: true,
  },
  // Emit each route as a folder with index.html (nicer static hosting URLs)
  trailingSlash: true,
};

export default nextConfig;
