/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
	images: {
		unoptimized: true,
	},
};
const withImages = require("next-images");

module.exports = withImages();
module.exports = nextConfig;
