import AboutMe from "@/components/Home/old/AboutMe";
import React from "react";
import Timeline from "@/components/Home/Timeline";
import projects from "@/data/projects.json";

export default function Home() {
	return (
		<>
			<AboutMe />
			<Timeline show_projects={true} show_academics={true} />;
		</>
	);
}
