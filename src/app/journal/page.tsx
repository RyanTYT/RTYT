import JournalPage from "@/app/journal/JournalPage";

export type MdMetadata = {
	id: string;
	title: string;
	date: string;
	summary: string;
	category: string;
	tags: string[];
	readTime: string;
};

export default async function getPosts() {
	// Filter posts based on search and selected filters
	const files = await import("fs/promises").then((fs) =>
		fs.readdir("src/content/journal")
	);
	const posts: MdMetadata[] = await Promise.all(
		files.filter((file) => file !== ".DS_Store").map(async (file) => {
			const { default: _Post, metadata } = await import(
				`@/content/journal/${file}`
			);
			return {
				id: file.replace(".mdx", "").replace(".md", ""),
				...metadata,
			};
		})
	);

	return <JournalPage posts={posts} />;
}
