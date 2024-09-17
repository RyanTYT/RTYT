"use client";
import styles from "@/components/Home/timeline.module.css";
import Branch from "@/components/Home/Branch";
import Bark from "@/components/Home/Bark";
import React, { ReactElement, useState } from "react";
import Semester from "@/components/Academics/Semester";
import ProjectPopup from "@/components/Home/ProjectPopup";
import Year from "@/components/Home/Year";

import projects from "@/data/projects.json";

export default function Timeline({
	show_academics,
	show_projects,
}: {
	show_academics: boolean;
	show_projects: boolean;
}) {
	const years = [2024, 2023, 2022];

	const semesters = [
		{
			semester: "Y1S1",
			date: "Aug 2022 - Nov 2022",
			year: 2022,
			month: 8,
		},
		{
			semester: "Y1S2",
			date: "Jan 2023 - May 2023",
			year: 2023,
			month: 1,
		},
		{
			semester: "Y2S1",
			date: "Aug 2023 - Nov 2023",
			year: 2023,
			month: 8,
		},
		{
			semester: "Y2S2",
			date: "Jan 2024 - May 2024",
			year: 2024,
			month: 1,
		},
	];

	let alignment: "left" | "right" = "left";
	const toggleAlignment = (alignment: "left" | "right") =>
		alignment === "left" ? "right" : "left";

	return (
		<div className={styles.tree} id="timeline">
			<Bark />
			{years.map((year) => {
				const branches: ReactElement[] = [];
				Array.from({ length: 12 }, (_, i) => i + 1)
					.reverse()
					.forEach((month) => {
						// Add semester info first
						const semester = semesters.find(
							(elem) => elem.year === year && elem.month === month
						);
						if (show_academics && semester) {
							alignment = toggleAlignment(alignment);
							console.log(alignment);
							const [active, setActive] = useState(false);
							branches.push(
								<Branch
									date={semester.date}
									content={
										<Semester
											semester={semester.semester}
											active={active}
										/>
									}
									// semester={semester_data.semester}
									setActiveParent={setActive}
									alignment={alignment}
									id={semester.semester}
									key={semester.semester}
								/>
							);
						}

						if (!show_projects) return;
						projects
							.filter(
								(elem) =>
									elem.year === year && elem.month === month
							)
							.forEach((project) => {
								alignment = toggleAlignment(alignment);
								const [active, setActive] = useState(false);
								branches.push(
									<Branch
										date={project.date}
										content={
											<ProjectPopup
												img_src={project.img_src}
												img_alt={project.img_alt}
												title={project.title}
												achievement={project.achivement}
												description={
													project.description
												}
												skills={project.skills}
												live_link={project.live_link}
												source_code_link={
													project.source_code_link
												}
												alignment={alignment}
											/>
										}
										// semester={semester_data.semester}
										setActiveParent={setActive}
										alignment={alignment}
										id={project.title}
										key={project.title}
									/>
								);
							});
					});

				if (branches.length === 0) return <></>;
				return (
					<>
						<Year year={`${year}`} height="20rem" id={`${year}`} />
						{branches}
					</>
				);
			})}
		</div>
	);
}
