"use client";
import React, { useMemo, useState } from "react";
import {
    TrendingUp,
    BookOpen,
    Calendar,
    Clock,
    ChevronRight,
    Code,
    MessageSquare,
    Search,
    ArrowLeft,
} from "lucide-react";
import { createStyles } from "@/app/theme";
import { useRouter } from "next/navigation";
import { MdMetadata } from "@/app/journal/page";
import { Button } from "@/components/home/base";

// Sample journal data
const raw_categories = [
    {
        id: "personal-projects",
        name: "Building Projects",
        description:
            // "Thoughts on systematic approaches to trading, development, and problem-solving",
            "Journey while building some of my projects",
        icon: TrendingUp,
        color: "bg-sky-100 text-sky-800",
    },
    {
        id: "tools-workflow",
        name: "Tools & Workflow",
        description:
            // "Deep dives into development tools, productivity systems, and technical setups",
            "Some setups I have, my opinions and how they help me",
        icon: Code,
        color: "bg-emerald-100 text-emerald-800",
    },
    {
        id: "learning-discovery",
        name: "Learning & Discovery",
        description:
            "Insights from internships, coursework, and technical discoveries",
        icon: BookOpen,
        color: "bg-amber-100 text-amber-800",
    },
    {
        id: "reflections",
        name: "Reflections",
        description:
            "Personal thoughts on some of my choices, misses and what I enjoyed",
        icon: MessageSquare,
        color: "bg-purple-100 text-purple-800",
    },
];

export default function JournalPage({ posts }: { posts: MdMetadata[] }) {
    const styles = createStyles();
    const categories = raw_categories.map((category) => {
        const num_posts = posts.filter(
            (post) => post.category === category.id
        ).length;
        return {
            posts: num_posts,
            ...category,
        };
    });

    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const filteredPosts = useMemo(() => {
        let filtered = posts;

        if (selectedCategory !== "") {
            filtered = filtered.filter((post) => post.category === selectedCategory);
        }

        if (searchTerm !== "") {
            filtered = filtered.filter(
                (post) =>
                    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    // post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.tags.some((tag) =>
                        tag.toLowerCase().includes(searchTerm.toLowerCase())
                    )
            );
        }

        if (selectedTags.length !== 0) {
            filtered = filtered.filter((post) => selectedTags.map((tag) => post.tags.includes(tag)).every((bool) => bool));
        }

        return filtered.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }, [selectedCategory, searchTerm, selectedTags]);

    // Get all unique tags
    const allTags: string[] = useMemo(() => {
        const tags = new Set();
        posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
        return Array.from(tags).sort();
    }, []) as string[];

    const router = useRouter();

    const onClickTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="absolute top-20 left-3">
                {/*selectedCategory && (
                    <div>
                        <Button
                            variant="ghost"
                            Icon={ArrowLeft}
                            iconPosition="left"
                            onClick={() => setSelectedCategory("")}
                        >
                            Back to Categories
                        </Button>
                    </div>
                )*/}
            </div>

            {/* Header */}
            <div className={`${styles.layout.container} pt-20 pb-6`}>
                <div className="text-center mb-12">
                    <h1 className={styles.typography.h1}>Personal Journal</h1>
                    <p className={styles.typography.bodyLarge}>
                        Documenting my thoughts and opinions
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search posts and tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`${styles.inputs.base} ${styles.typography.body} pl-10`}
                            />
                        </div>
                        {/*<button
                            onClick={() => setSelectedCategory("")}
                            className={
                                selectedCategory ? styles.buttons.ghost : styles.buttons.primary
                            }
                        >
                            All Posts
                        </button>*/}
                    </div>

                    {/* Category Filter */}
                    {(
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="text-sm text-slate-600 mr-2">Categories:</span>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => selectedCategory === category.id ? setSelectedCategory("") : setSelectedCategory(category.id)}
                                    className={`${selectedCategory === category.id ? styles.tags.category_default : styles.tags.category} cursor-pointer hover:bg-sky-200 transition-colors`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    )}


                    {/* Tag Filter */}
                    {allTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className="text-sm text-slate-600 mr-2">Tags:</span>
                            {allTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => onClickTag(tag)}
                                    className={`${selectedTags.includes(tag) ? styles.tags.default : styles.tags.secondary} cursor-pointer hover:bg-sky-200 transition-colors`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}

                </div>
            </div>

            {/* Categories Overview */}
            {/*!selectedCategory && (
                <div className={`${styles.layout.container} mb-16`}>
                    <h2 className={`${styles.typography.h3} text-center mb-8`}>
                        Categories
                    </h2>
                    <div className={styles.layout.grid.twoLg}>
                        {categories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <div
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={styles.cards.interactive}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg ${category.color}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className={`${styles.typography.h4} mb-2`}>
                                                {category.name}
                                            </h3>
                                            <p className={`${styles.typography.muted} mb-3`}>
                                                {category.description}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className={styles.badges.default}>
                                                    {category.posts} posts
                                                </span>
                                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-sky-600 transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )*/}

            {/* Posts List */}
            <div className={`${styles.layout.container} pb-20`}>
                {/*selectedCategory && (
                    <div className="mb-8">
                        <h2 className={styles.typography.h2}>
                            {categories.find((c) => c.id === selectedCategory)?.name}
                        </h2>
                    </div>
                )*/}

                <div className="max-w-4xl mx-auto space-y-6">
                    {filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            onClick={() => router.push(`journal/${post.id}`)}
                            className={styles.cards.interactive}
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        {post.tags.slice(0, 3).map((tag) => (
                                            <span key={tag} className={styles.tags.default}>
                                                {tag}
                                            </span>
                                        ))}
                                        {post.tags.length > 3 && (
                                            <span className={styles.tags.secondary}>
                                                +{post.tags.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    <h3
                                        className={`${styles.typography.h4} mb-2 group-hover:text-sky-600 transition-colors`}
                                    >
                                        {post.title}
                                    </h3>

                                    <p className={`${styles.typography.muted} mb-4`}>
                                        {post.summary}
                                    </p>

                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(post.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {post.readTime} min read
                                        </div>
                                    </div>
                                </div>

                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-sky-600 transition-colors flex-shrink-0" />
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPosts.length === 0 && (
                    <div className="text-center py-12">
                        <p className={styles.typography.muted}>
                            No posts found matching your criteria.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
