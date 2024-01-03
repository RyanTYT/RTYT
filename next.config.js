/** @type {import('next').NextConfig} */

const repo = "RTYT";
const assetPrefix = `/${repo}/`;
const basePath = `/${repo}`;

const nextConfig = {
	basePath: basePath,
	assetPrefix: assetPrefix,
	output: "export",
	images: {
		unoptimized: true,
	},
};
const withImages = require("next-images");

module.exports = withImages();
module.exports = nextConfig;
