"use client";
import React, { useState } from "react";
import {
	MapPin,
	GraduationCap,
	Brain,
	TrendingUp,
	ChevronDown,
	ExternalLink,
	ArrowRight,
	LucideIcon,
} from "lucide-react";
import { createStyles } from "@/app/theme";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const ExperiencePage = () => {
	const styles = createStyles();
    const router = useRouter();

	const timelineData = [
		{
			id: "current",
			period: "Aug 2023 - Present",
			title: "Business Analytics Student",
			organization: "National University of Singapore",
			type: "Education",
			location: "Singapore",
			icon: GraduationCap,
			color: "bg-emerald-500",
			description:
				"Currently in Year 3, focusing on quantitative methods and data analysis.",
			details: [
				"Relevant coursework: Statistics, Data Mining, Operations Research",
				"Maintained strong academic performance while pursuing practical projects",
				"Active in finance and technology student organizations",
			],
			skills: ["Statistics", "Data Analysis", "Python", "R", "SQL"],
		},
		{
			id: "trading",
			period: "Summer 2024",
			title: "Independent Trading Bot Development",
			organization: "Personal Project",
			type: "Project",
			location: "Singapore",
			icon: TrendingUp,
			color: "bg-sky-500",
			description:
				"Dedicated summer to building a comprehensive algorithmic trading system.",
			details: [
				"Designed and implemented real-time data processing pipeline",
				"Developed risk management and position sizing algorithms",
				"Built backtesting framework for strategy validation",
				"Deployed system using Docker containers for scalability",
				"Extensive research into market microstructure and trading strategies",
			],
			skills: [
				"Python",
				"Docker",
				"PostgreSQL",
				"Financial APIs",
				"Risk Management",
				"Backtesting",
			],
			achievements: [
				"Successfully processed real-time market data",
				"Implemented multiple trading strategies",
				"Created comprehensive monitoring dashboard",
			],
		},
		{
			id: "sap",
			period: "Summer 2023",
			title: "AI Developer Intern",
			organization: "SAP",
			type: "Internship",
			location: "Singapore",
			icon: Brain,
			color: "bg-purple-500",
			description:
				"Frontend and backend development for AI-powered business applications.",
			details: [
				"Developed user interfaces for LLM-powered applications",
				"Implemented API integrations for AI services",
				"Collaborated with cross-functional teams on product features",
				"Gained experience with enterprise-scale software development",
				"Worked on improving user experience for AI tools",
			],
			skills: [
				"React",
				"TypeScript",
				"Node.js",
				"LLMs",
				"API Design",
				"Enterprise Software",
			],
			achievements: [
				"Delivered production-ready features",
				"Improved user interface performance",
				"Contributed to AI application architecture",
			],
		},
	];

	const TimelineItem = ({
		item,
		isLast,
	}: {
		item: {
			id: string;
			icon: LucideIcon;
			color: string;
			period: string;
			type: string;
			title: string;
			organization: string;
			location: string;
			description: string;
			skills: string[];
			details: string[];
			achievements?: string[] | undefined;
		};
		isLast: boolean;
	}) => {
		// const isExpanded = expandedItem === item.id;
		const [isExpanded, setIsExpanded] = useState(false);

		const Icon = item.icon;

		return (
			<div className="relative">
				{/* Timeline line */}
				{!isLast && (
					<div className="absolute left-6 top-16 w-0.5 h-full bg-slate-200"></div>
				)}

				<div
					className={`${styles.cards.interactive} cursor-pointer`}
					// onClick={() => setExpandedItem(isExpanded ? null : item.id)}
					onClick={() => setIsExpanded(isExpanded ? false : true)}
				>
					<div className="flex items-start gap-4">
						{/* Icon */}
						<div className={`${item.color} p-3 rounded-lg flex-shrink-0`}>
							<Icon className="w-6 h-6 text-white" />
						</div>

						{/* Content */}
						<div className="flex-1">
							<div className={styles.utilities.flexBetween}>
								<div>
									<div className="flex items-center gap-2 mb-1">
										<span className={styles.badges.primary}>{item.period}</span>
										<span className={styles.badges.default}>{item.type}</span>
									</div>
									<h3 className={styles.typography.h4}>{item.title}</h3>
									<p className={`${styles.typography.muted} mb-2`}>
										{item.organization}
									</p>
									<div className="flex items-center gap-1 mb-3">
										<MapPin className="w-4 h-4 text-slate-400" />
										<span className={styles.typography.small}>
											{item.location}
										</span>
									</div>
								</div>
								<ChevronDown
									className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
								/>
							</div>
							<p className={`${styles.typography.body} mb-4`}>
								{item.description}
							</p>
							{/* Skills tags */}
							<div className="flex flex-wrap gap-2 mb-4">
								{item.skills.map((skill, index) => (
									<span key={index} className={styles.tags.default}>
										{skill}
									</span>
								))}
							</div>
							{/* Expandable content */}
							<AnimatePresence>
								{isExpanded && (
									<motion.div
										key={`expand-${item.id}`}
										layout
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: "auto", opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{ duration: 0.3 }}
										className="overflow-hidden"
									>
										<div className="mt-6 pt-6 border-t border-slate-200">
											<div className="space-y-6">
												<div>
													<h4 className={`${styles.typography.h4} mb-3`}>
														Key Responsibilities
													</h4>
													<ul className="space-y-2">
														{item.details.map((detail, index) => (
															<li
																key={index}
																className="flex items-start gap-2"
															>
																<div
																	className={`${styles.utilities.dotPrimary} mt-2`}
																/>
																<span className={styles.typography.body}>
																	{detail}
																</span>
															</li>
														))}
													</ul>
												</div>

												{item.achievements && (
													<div>
														<h4 className={`${styles.typography.h4} mb-3`}>
															Key Achievements
														</h4>
														<ul className="space-y-2">
															{item.achievements.map((achievement, index) => (
																<li
																	key={index}
																	className="flex items-start gap-2"
																>
																	<div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2" />
																	<span className={styles.typography.body}>
																		{achievement}
																	</span>
																</li>
															))}
														</ul>
													</div>
												)}
											</div>
										</div>
									</motion.div>
								)}
							</AnimatePresence>{" "}
						</div>
					</div>
				</div>
			</div>
		);
	};

	const SkillCategory = ({
		title,
		skills,
	}: {
		title: string;
		skills: string[];
	}) => (
		<div className={styles.cards.base}>
			<h3 className={styles.typography.h4}>{title}</h3>
			<div className="flex flex-wrap gap-2 mt-4">
				{skills.map((skill, index) => (
					<span key={index} className={styles.tags.secondary}>
						{skill}
					</span>
				))}
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Hero Section */}
			<section className={`${styles.layout.section} pt-16`}>
				<div className={styles.layout.container}>
					<div className={styles.utilities.textCenter}>
						<h1 className={styles.typography.h1}>Experience & Background</h1>
						<p className={`${styles.typography.bodyLarge} max-w-3xl mx-auto`}>
							My journey from AI development to quantitative finance, building
							practical experience along the way.
						</p>
					</div>
				</div>
			</section>

			{/* Timeline Section */}
			<section className={`${styles.layout.section} bg-white`}>
				<div className={styles.layout.container}>
					<div className={styles.layout.grid.twoLg}>
						{/* Timeline */}
						<div>
							<h2 className={`${styles.typography.h2} mb-8`}>Timeline</h2>
							<div className="space-y-8">
								{timelineData.map((item, index) => (
									<TimelineItem
										key={item.id}
										item={item}
										isLast={index === timelineData.length - 1}
									/>
								))}
							</div>
						</div>

						{/* Skills Overview */}
						<div>
							<h2 className={`${styles.typography.h2} mb-8`}>
								Skills Overview
							</h2>
							<div className="space-y-6">
								<SkillCategory
									title="Programming & Development"
									skills={[
										"Python",
										"TypeScript",
										"React",
										"Node.js",
										"SQL",
										"Docker",
									]}
								/>
								<SkillCategory
									title="Finance & Trading"
									skills={[
										"Algorithmic Trading",
										"Risk Management",
										"Market Data",
										"Backtesting",
										"Financial APIs",
									]}
								/>
								<SkillCategory
									title="Data & Analytics"
									skills={[
										"Statistics",
										"Data Mining",
										"Machine Learning",
										"PostgreSQL",
										"Data Visualization",
									]}
								/>
								<SkillCategory
									title="AI & Machine Learning"
									skills={[
										"LLMs",
										"Natural Language Processing",
										"API Integration",
										"Model Deployment",
									]}
								/>
							</div>

							{/* Academic Background */}
							<div className={`${styles.cards.elevated} mt-8`}>
								<h3 className={styles.typography.h3}>Academic Background</h3>
								<div className="space-y-4">
									<div className="flex items-start gap-3">
										<GraduationCap className="w-5 h-5 text-sky-600 mt-1" />
										<div>
											<h4 className={styles.typography.h4}>
												Bachelor of Science in Business Analytics
											</h4>
											<p className={styles.typography.muted}>
												National University of Singapore
											</p>
											<p className={styles.typography.small}>
												Expected Graduation: 2025
											</p>
										</div>
									</div>
									<div className="pt-4 border-t border-slate-200">
										<p className={styles.typography.body}>
											Focused on quantitative methods, statistical analysis, and
											practical applications of data science in business
											contexts.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Links */}
			<section className={`${styles.layout.section} bg-slate-50`}>
				<div className={styles.layout.container}>
					<div className={`${styles.utilities.textCenter} max-w-3xl mx-auto`}>
						<h2 className={styles.typography.h2}>What&#39;s Next</h2>
						<p className={`${styles.typography.bodyLarge} mb-8`}>
							Looking forward to applying my experience in quantitative finance
							and algorithmic trading roles.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<button className={styles.buttons.primary} onClick={() => router.push("/projects")}>
								View My Projects
								<ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
							</button>
                            <a 
                              href="/resume/resume.pdf" 
                              download 
                              className="inline-block"
                            >
							  <button className={styles.buttons.ghost}>
                                Download Resume
								<ExternalLink className="w-4 h-4 ml-2" />
                              </button>
                            </a>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default ExperiencePage;
