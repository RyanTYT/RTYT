import { createStyles } from "@/app/theme";
import { readFile } from "fs/promises";
import { join } from "path";
import matter from "gray-matter";
import { Metadata } from "next";
import BackButton from "@/components/home/client_base";

export async function generateStaticParams() {
	const files = await import("fs/promises").then((fs) =>
		fs.readdir("src/content/journal")
	);
	return files.filter((file) => file !== ".DS_Store").map((file) => ({
		id: `${file.replace(/\.mdx$/, "")}`,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const param = await params;
	const filePath = join(
		process.cwd(),
		"src/content/journal",
		`${param.id}.mdx`
	);
	try {
		const fileContent = await readFile(filePath, "utf8");
		const { data } = matter(fileContent);
		return {
			title: data.title,
			description: data.summary,
		};
	} catch {
		return {};
	}
}

export default async function JournalPost({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const param = await params;
	const page = param.id;
	const { default: Post, metadata } = await import(
		`@/content/journal/${page}.mdx`
	);

	const styles = createStyles();

	return (
		<div className={`${styles.layout.container} py-8`}>
			<div className="absolute top-20 left-3">
			<BackButton label="← Back" />
            </div>
			<article className={styles.layout.article}>
				<header className="mb-8">
					<h1 className={`${styles.typography.h1} tracking-tight mb-2`}>
						{metadata.title}
					</h1>
					<p
						className={`${styles.typography.small} text-sm text-muted-foreground`}
					>
						{metadata.date}
					</p>
					{metadata.summary && (
						<p
							className={`${styles.typography.muted} mt-2 text-muted-foreground`}
						>
							{metadata.summary}
						</p>
					)}
				</header>
				<div
					className={`${styles.typography.body} prose prose-neutral dark:prose-invert prose-lgb`}
				>
					<Post />
				</div>
			</article>
		</div>
	);

	// return (
	// 	<div className="min-h-screen bg-slate-50">
	// 		<div className={`${styles.layout.container} py-8`}>
	// 			<button
	// 				onClick={() => setSelectedPost(null)}
	// 				className={`${styles.buttons.ghost} mb-6`}
	// 			>
	// 				<ArrowLeft className="w-4 h-4 mr-2" />
	// 				Back to Journal
	// 			</button>
	//
	// 			<article className="max-w-4xl mx-auto">
	// 				<div className={`${styles.cards.base} mb-6`}>
	// 					<div className="flex items-center gap-2 mb-4">
	// 						{post.tags.map((tag) => (
	// 							<span key={tag} className={styles.tags.default}>
	// 								{tag}
	// 							</span>
	// 						))}
	// 					</div>
	//
	// 					<h1 className={styles.typography.h1}>{post.title}</h1>
	//
	// 					<div className="flex items-center gap-6 text-sm text-slate-600 mb-8">
	// 						<div className="flex items-center gap-2">
	// 							<Calendar className="w-4 h-4" />
	// 							{new Date(post.date).toLocaleDateString("en-US", {
	// 								year: "numeric",
	// 								month: "long",
	// 								day: "numeric",
	// 							})}
	// 						</div>
	// 						<div className="flex items-center gap-2">
	// 							<Clock className="w-4 h-4" />
	// 							{post.readTime} min read
	// 						</div>
	// 					</div>
	// 				</div>
	//
	// 				<div className={`${styles.cards.base} prose prose-slate max-w-none`}>
	// 					<div
	// 						className="leading-relaxed"
	// 						dangerouslySetInnerHTML={{
	// 							__html: post.content
	// 								.replace(/\n/g, "<br>")
	// 								.replace(
	// 									/```(\w+)?\n([\s\S]*?)```/g,
	// 									"<pre><code>$2</code></pre>"
	// 								)
	// 								.replace(/`([^`]+)`/g, "<code>$1</code>")
	// 								.replace(/## (.*)/g, "<h2>$1</h2>")
	// 								.replace(/### (.*)/g, "<h3>$1</h3>")
	// 								.replace(/# (.*)/g, "<h1>$1</h1>")
	// 								.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
	// 								.replace(/\*(.*?)\*/g, "<em>$1</em>"),
	// 						}}
	// 					/>
	// 				</div>
	// 			</article>
	// 		</div>
	// 	</div>
	// );
}
