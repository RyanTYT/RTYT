import React from "react";
import styles from "./semester.module.css";
import { NUSmod, NUSmods, gradeToGPA } from "@/components/modules/NUSmod";

import nusMods from "@/data/nusMods.json";

export default function Semester({
	semester,
	active,
}: {
	semester: string;
	active: boolean;
}) {
	// All with any null values filtered out alr - null value for review allowed
	const filtered_nus_mods = (nusMods as NUSmods).modules.filter(
		(mod) =>
			Object.values(mod).filter((val) => val === null).length <=
			(mod["review"] === null ? 1 : 0)
	);

	const semester_mods = filtered_nus_mods.filter(
		(mod) => mod["semester"] === semester
	);

	if (semester_mods.length === 0) return <></>;

	// Get GPA
	const graded_semester_mods = semester_mods.filter(
		(mod) =>
			mod["moduleCredit"]! > 0.0 &&
			["A+", "A", "A-", "B+", "B"].includes(mod["grade"] || "")
	);
	const gpa_sum = graded_semester_mods.reduce(
		(cum_gpa, next_mod) =>
			cum_gpa +
			(gradeToGPA.get(next_mod["grade"]!) || 0.0) *
				next_mod["moduleCredit"]!,
		0.0
	);
	const module_credits_sum = graded_semester_mods.reduce(
		(cum_credits, next_mod) =>
			cum_credits + (next_mod["moduleCredit"] || 0),
		0.0
	);
	const gpa = (gpa_sum / module_credits_sum).toFixed(2);

	const SemesterHeader = ({ title, gpa }: { title: string; gpa: string }) => {
		return (
			<div
				className={`${styles.semester_header} ${active ? styles.semester_header_active : ""}`}
			>
				<span
					className={`normal-header-font-style ${styles.semester_header_title} ${active ? styles.semester_header_title_active : ""}`}
				>
					{title}
				</span>
				<span
					className={`normal-header-font-style ${styles.semester_header_title} ${active ? styles.semester_header_title_active : ""}`}
					style={{
						textAlign: "end",
					}}
				>{`Semester GPA: ${gpa}`}</span>
			</div>
		);
	};

	const CourseRow = ({ title, grade }: { title: string; grade: string }) => {
		return (
			<div className={styles.course_row}>
				<span>{title}</span>
				<span>{grade}</span>
			</div>
		);
	};

	return (
		<div className={styles.semester}>
			<SemesterHeader title={semester} gpa={gpa.toString()} />
			<div className={styles.courses}>
				{semester_mods.map((mod) => (
					<CourseRow
						title={mod.name!}
						grade={mod.grade!}
						key={mod.title}
					/>
				))}
			</div>
		</div>
	);
}
