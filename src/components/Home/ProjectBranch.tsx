"use client";
import { useState } from "react";
import Branch from "@/components/Home/Branch";
import ProjectPopup from "@/components/Home/ProjectPopup";

export default function ProjectBranch({
	date,
	alignment,
	id,

	img_src,
	img_alt,
	title,
	achievement,
	description,
	skills,
	live_link,
	source_code_link,
}: {
	date: string;
	id: string;

	img_src: string;
	img_alt: string;
	title: string;
	achievement: string;
	description: string[];
	skills: string[];
	live_link: string;
	source_code_link: string;
	alignment: "left" | "right";
}) {
	const [active, setActive] = useState(false);
	return (
		<Branch
			date={date}
			content={
				<ProjectPopup
					img_src={img_src}
					img_alt={img_alt}
					title={title}
					achievement={achievement}
					description={description}
					skills={skills}
					live_link={live_link}
					source_code_link={source_code_link}
					alignment={alignment}
				/>
			}
			// semester={semester_data.semester}
			setActiveParent={setActive}
			alignment={alignment}
			id={id}
		/>
	);
}
