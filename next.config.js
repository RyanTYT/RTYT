/** @type {import('next').NextConfig} */

const createMDX = require("@next/mdx");
const { webpack } = require("next/dist/compiled/webpack/webpack");

const env = process.env.NODE_ENV;
var repo = "";

if (env === "development") {
    repo = "";
} else {
    repo = "/RTYT";
}

const assetPrefix = repo === "" ? "" : `${repo}/`;
const basePath = `${repo}`;

const nextConfig = {
    basePath: basePath,
    assetPrefix: assetPrefix,
    output: "export",
    images: {
        unoptimized: true,
    },
    webpack: (config) => {
        config.resolve.fallback = { fs: false, path: false };

        return config;
    },
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
    extension: /\.(md|mdx)$/,
    experimental: {
        mdxRs: true,
    },
    options: {
        remarkPlugins: [["remark-gfm", { strict: true, throwOnError: true }]],
        rehypePlugins: [],
      },
});
// const withImages = require("next-images");

// module.exports = withImages();
module.exports = withMDX(nextConfig);
// export default withMDX(nextConig);
