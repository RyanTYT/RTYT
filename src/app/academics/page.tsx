import React from "react";
import styles from "@/app/academics/page.module.css";
import { NUSmod, NUSmods, gradeToGPA } from "@/components/modules/NUSmod";
import Timeline from "@/components/Home/Timeline";

import nusMods from "@/data/nusMods.json";
import Semester from "@/components/Academics/Semester";

export default function Academics() {
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
	const filtered_nus_mods = (nusMods as NUSmods).modules.filter(
		(mod) =>
			Object.values(mod).filter((val) => val === null).length <=
			(mod["review"] === null ? 1 : 0)
	);

	// Get GPA
	// Get GPA
	const graded_mods = filtered_nus_mods.filter(
		(mod) =>
			mod["moduleCredit"]! > 0.0 &&
			["A+", "A", "A-", "B+", "B"].includes(mod["grade"] || "")
	);
	const gpa_sum = graded_mods.reduce(
		(cum_gpa, next_mod) =>
			cum_gpa +
			(gradeToGPA.get(next_mod["grade"]!) || 0.0) *
				next_mod["moduleCredit"]!,
		0.0
	);
	const module_credits_sum = graded_mods.reduce(
		(cum_credits, next_mod) =>
			cum_credits + (next_mod["moduleCredit"] || 0),
		0.0
	);
	const gpa = (gpa_sum / module_credits_sum).toFixed(2);

	// {semesters.map((semester) => (
	//     <Semester semester={semester} key={semester} />
	// ))}
	return (
		<div className={styles.page}>
			<Timeline show_projects={false} show_academics={true} />
			<span
				className="important-font-style"
				style={{ color: "var(--highlight)" }}
			>{`Overall GPA: ${gpa}`}</span>
		</div>
	);
}
