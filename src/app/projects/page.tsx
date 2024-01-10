import Project from "@/components/Project/Project";
import styles from "@/app/projects/page.module.css";
import { ReactElement } from "react";
import CustomHeader from "@/components/Layout/Header/Header";

export default function ProjectPage() {
    const icons: string[] = ["./classmate.png"];
	const imgAlts: string[] = ["ClassMate"];
	const titles: string[] = ["ClassMate"];
	const descriptions: string[] = [
		"Web App built using Next.js, React.js, Sequelize, Jest, PostgreSQL and z3-solver. Sign up, log in and form groups! Based on these groups, you can find various combinations of tutorials, labs and lectures that you can take together in the group, making it easy to choose and take modules with friends!",
	];

	const projects: ReactElement[] = [];

	for (let i = 0; i < icons.length; i++) {
		projects.push(
			<Project
				img={icons[i]}
				imgAlt={imgAlts[i]}
				title={titles[i]}
				description={descriptions[i]}
			/>
		);
	}

	return (
		<>
			<CustomHeader header="Projects" description={<></>} />
			<div className={styles.projects}>{projects}</div>
		</>
	);
}
