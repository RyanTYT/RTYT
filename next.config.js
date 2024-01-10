/** @type {import('next').NextConfig} */

const env = process.env.NODE_ENV;
var repo;
// if (env === "development") {
// 	repo = "";
// } else {
// 	repo = "RTYT";
// }
repo = "RTYT";
const assetPrefix = `/${repo}/`;
const basePath = `/${repo}`;

const nextConfig = {
	// basePath: basePath,
	// assetPrefix: assetPrefix,
	output: "export",
	images: {
		unoptimized: true,
	},
};
const withImages = require("next-images");

module.exports = withImages();
module.exports = nextConfig;
