"use client";
import React, { useState } from "react";
import {
	Brain,
	TrendingUp,
	ExternalLink,
	Github,
	BarChart3,
	Layers,
	X,
	Code2,
	Database,
	LucideIcon,
} from "lucide-react";
import { createStyles } from "@/app/theme";
import { ProjectCard } from "@/components/home/cards";
import ProjectModal from "@/components/home/ProjectPopUp"
import projects from "@/content/projects.json";

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

const ProjectsPage = () => {
	// const [expandedItem, setExpandedItem] = useState(null);
	const [selectedProject, setSelectedProject] = useState({} as ProjectType);
	const styles = createStyles();

    const otherProjects = projects.filter((p) => p.type === "Academics");

	return (
		<div className="min-h-screen ">
			{/* Hero Section */}
			<section className={`${styles.layout.section} `}>
				<div className={styles.layout.container}>
					<div className={styles.utilities.textCenter}>
						<h1 className={styles.typography.h1}>Projects</h1>
						<p className={`${styles.typography.bodyLarge} max-w-3xl mx-auto`}>
							Some of the projects I have done over the years.
						</p>
					</div>
				</div>
			</section>

			{/* Projects Section */}
			<section className={`${styles.layout.section} bg-white`}>
				<div className={styles.layout.container}>
					<div className={styles.layout.grid.twoLg}>
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
                                        onClick={() => setSelectedProject(projects[0])}
                                    />
                                );
                            })
                    }
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
		</div>
	);
};

export default ProjectsPage;
