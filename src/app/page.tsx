"use client";

import React, { useState, useEffect } from "react";
import {
	ChevronRight,
	TrendingUp,
	Code2,
	Database,
	Brain,
	Mail,
	Phone,
	Linkedin,
	Github,
	ExternalLink,
    LucideIcon
} from "lucide-react";

// Import theme and components
import { theme, createStyles } from "./theme";
import {
	Button,
	Container,
	Grid,
	Heading,
	Section,
	StatusBadge,
	Text,
} from "@/components/home/base";
import { Card, MetricCard, ProjectCard } from "@/components/home/cards";
import { BulletList, SocialLinksFooter } from "@/components/home/common";
import ProjectModal from "@/components/home/ProjectPopUp"
import projects from "@/content/projects.json";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type ProjectType = {
	id: string;
	title: string;
	description: string;
    link?: string;
	type: string;
	duration: string;
	status: string;
	tech: string[];
	details: {
		overview: string;
		architecture?: string[];
		projects?: string[];
		technical?: string[];
		research?: string[];
		results?: string[];
	};
};
const Portfolio = () => {
	const [selectedProject, setSelectedProject] = useState({} as ProjectType);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const styles = createStyles(theme);
    const router = useRouter();

	// Social links configuration
	const socialLinks = [
		{ href: "mailto:ryan.tyt@u.nus.edu", icon: Mail, label: "Email" },
		{
			href: "https://linkedin.com/in/",
			icon: Linkedin,
			label: "LinkedIn",
		},
		{ href: "https://github.com/RyanTYT", icon: Github, label: "GitHub" },
		{ href: "+6596433328", icon: Phone, label: "Phone" },
	];

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY });
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	const tech_skills = [
		"Python, TypeScript, React, Rust",
		"Docker, PostgreSQL, MongoDB",
		"IBKR API",
		"Machine Learnings, LLMs",
	];
	const interest_areas = [
		"Quantitative Trading",
		"Financial Data Analysis",
		"System Architecture",
	];

    const basePath = process.env.NODE_ENV === "development" ? "" : "/RTYT";
    console.log(`base path is ${basePath}`);

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Subtle Background */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div
					className="absolute w-96 h-96 bg-gradient-to-br from-sky-200/10 to-transparent rounded-full blur-3xl transition-all duration-1000"
					style={{
						left: mousePosition.x - 200,
						top: mousePosition.y - 200,
					}}
				/>
			</div>

			{/* Hero Section */}
			<Section id="home" className="lg:py-32">
				<Container>
					<Grid cols="twoLg" className="items-center">
						<div>
							<StatusBadge Icon={TrendingUp} className="mb-6">
								Seeking Quantitative Finance Opportunities
							</StatusBadge>

							<Heading level={1}>Hi, I&apos;m Ryan!</Heading>

							<Text variant="bodyLarge" className="mb-8">
								Business Analytics student at NUS with experience in AI
								development and algorithmic trading. I enjoy working with data
								and building systems that solve real problems.
							</Text>

							<div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/experience">
                                  <Button variant="primary" Icon={ChevronRight}>
                                    View My Experience
                                  </Button>
                                </Link>
								<a 
                                  href="/resume/resume.pdf" 
                                  download 
                                  className="inline-block"
                                >
                                  <Button variant="secondary" Icon={ExternalLink}>
                                    Resume
                                  </Button>
                                </a>
							</div>
						</div>

						<div className="relative">
							<Card variant="elevated">
								<div className="text-center mb-6">
									<div className="w-32 h-32 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <img 
                                            src={`${basePath}/journal_images/selfie.jpeg`}
                                            alt="Selfie" 
                                            className="w-full h-full object-cover rounded-full"
                                          />
									</div>
									<Heading level={4}>Ryan Tan Yan Tong</Heading>
									<Text variant="muted">NUS Business Analytics</Text>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<MetricCard
										value="Y3"
										label="Current Year"
										Icon={TrendingUp}
									/>
									<MetricCard value="SAP" label="AI Experience" Icon={Brain} />
									<MetricCard
										value="Full-Stack"
										label="Trading Bot"
										Icon={Code2}
									/>
									<MetricCard
										value="Docker"
										label="Deployment"
										Icon={Database}
									/>
								</div>
							</Card>
						</div>
					</Grid>
				</Container>
			</Section>

			{/* Projects Section */}
			<section className={`${styles.layout.section} bg-white`}>
				<div className={styles.layout.container}>
					<div className="text-center mb-16">
						<h2 className={styles.typography.h2}>Recent Work</h2>
						<p className={`${styles.typography.bodyLarge} max-w-3xl mx-auto`}>
							What I&apos;ve been working on lately
						</p>
					</div>

					<div className={styles.layout.grid.twoMd}>
                    {
                        projects
                            .filter((project) => project.type !== "Academic")
                            .map((project) => {
                                return (
                                    <ProjectCard
                                        key={project.title}
                                        title={project.title}
                                        description={project.description}
                                        tech={project.tech}
                                        type="Personal Project"
                                        delay={0}
                                        duration={project.duration}
                                        onClick={() => setSelectedProject(project)}
                                    />
                                );
                            })
                    }
				    </div>
				</div>
			</section>

			{/* Skills & Background */}
			<section className={`${styles.layout.section} bg-slate-50`}>
				<div className={styles.layout.container}>
					<div className={styles.layout.grid.three}>
						<div>
							<h3 className={styles.typography.h3}>Technical Skills</h3>
							<BulletList points={tech_skills} />
						</div>

						<div>
							<h3 className={styles.typography.h3}>Areas of Interest</h3>
							<BulletList points={interest_areas} />
						</div>

						<div>
							<h3 className={styles.typography.h3}>Currently</h3>
							<div className={`${styles.cards.base} p-6`}>
								<p className={`${styles.typography.bodyTight} mb-4`}>
									Final year student looking for opportunities in quantitative
									finance and algorithmic trading.
								</p>
								<div className="flex flex-col space-y-3">
									<a
										href="mailto:ryan.tyt@u.nus.edu"
										className={`inline-flex items-center ${styles.links.primary}`}
									>
										<Mail className="w-4 h-4 mr-2" />
										ryan.tyt@u.nus.edu
									</a>
									<a
										href="tel:+6596433328"
										className={`inline-flex items-center ${styles.links.primary}`}
									>
										<Phone className="w-4 h-4 mr-2" />
										+65 9643 3328
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Modal */}
			{selectedProject && (
				<ProjectModal
					project={selectedProject}
					onClose={() => setSelectedProject({} as ProjectType)}
				/>
			)}

			{/* Footer */}
			<footer className="bg-slate-900 text-white py-12">
				<div className={styles.layout.container}>
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="mb-6 md:mb-0">
							<h3 className="text-xl font-bold mb-2">Get in Touch</h3>
							<p className="text-slate-400">
								Always interested in discussing quantitative finance and new
								opportunities
							</p>
						</div>
						<SocialLinksFooter links={socialLinks} />
					</div>
					<div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
						<p>&copy; 2025 Ryan Tan Yan Tong. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default Portfolio;
