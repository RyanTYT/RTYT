import React from "react";
import styles from "@/app/education/page.module.css";
import EducationRow from "@/components/Education/EducationRow";
import { NUSmod, NUSmods } from "@/components/modules/NUSmod";
import EducationHeader from "@/components/Education/EducationHeader";

import nusMods from "@/data/nusMods.json";

export default function EducationPage() {
	const semesters = [
		"Y1S1",
		"Y1S2",
		"Y2S1",
		"Y2S2",
		"Y3S1",
		"Y3S2",
		"Y4S1",
		"Y4S2",
	];

	// All with any null values filtered out alr
	const nusModsFiltered = (nusMods as NUSmods).modules
		.filter((mod) => {
			for (var key in mod) {
				if (
					mod[
						key as
							| "name"
							| "moduleCode"
							| "semester"
							| "title"
							| "description"
							| "review"
							| "grade"
							| "type"
							| "moduleCredit"
					] === null
				) {
					if (key !== "review") {
						return false;
					}
				}
			}
			return true;
		})
		.map((mod) => mod as any as NUSmod);

	return (
		<>
			<EducationHeader />
			<div className={styles.page}>
				{semesters
					.filter(
						(semester) =>
							nusModsFiltered.find(
								(mod) => mod.semester === semester
							) != null
					)
					.map((semester) => (
						<EducationRow
							title={semester}
							NUSmodules={nusModsFiltered.filter(
								(mod) => mod.semester === semester
							)}
							key={semester}
						/>
					))}
			</div>
		</>
	);
}
