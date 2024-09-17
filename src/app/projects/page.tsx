import Project from "@/components/Project/Project";
import styles from "@/app/projects/page.module.css";
import { ReactElement } from "react";
import Timeline from "@/components/Home/Timeline";

import projects from "@/data/projects.json";

export default function ProjectPage() {
	// const projects_element: ReactElement[] = projects.map((project) => {
	//     return (
	//         <Project
	//             img_src={project.img_src}
	//             img_alt={project.img_alt}
	//             title={project.title}
	//             date={project.date}
	//             description={project.description}
	//             live_link={project.live_link}
	//             source_code_link={project.source_code_link}
	//             key={project.title}
	//         />
	//     );
	// });
	//
	// return <div className={styles.projects}>{projects_element}</div>;
	return <Timeline show_projects={true} show_academics={false} />;
}
