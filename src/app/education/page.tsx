import React from "react";
import styles from "@/app/education/page.module.css";
import EducationRow from "@/components/Education/EducationRow";
import { gradeToGPA, NUSmod, NUSmods } from "@/components/modules/NUSmod";
import CustomHeader from "@/components/Layout/Header/Header";

import nusMods from '@/data/nusMods.json';

function calcGPA(countedMods: NUSmod[]) {
	const countedModuleCredits = countedMods
		.map((mod) => (mod.moduleCredit ? mod.moduleCredit : 0.0))
		.reduce((a, b) => a + b);
	const overallGPA =
		countedMods
			.map((mod) => {
				if (mod.moduleCredit && mod.grade) {
					return gradeToGPA.get(mod.grade)! * mod.moduleCredit;
				}
				return 0.0;
			})
			.map((modGrade) => (modGrade ? modGrade : 0.0))
			.reduce((a, b) => a + b) / countedModuleCredits;
	return overallGPA;
}

export default function EducationPage() {
	const Header = () => (
		<CustomHeader
			header="Education"
			description={
				<>
					<div className={styles.degree}>
						Double Degree Programme: Bachelor of Business Analytics
						(School of Computing) and Bachelor of Business
						Administration
					</div>
					<div className={styles.gpa}>BZA: {bzaGPA.toFixed(1)}</div>
					<div className={styles.gpa}>BBA: {bbaGPA.toFixed(1)}</div>
				</>
			}
		/>
	);
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

	const countedMods = (nusMods as NUSmods).modules.filter((mod) =>
		mod.grade ? gradeToGPA.get(mod.grade) : null
	);
	const bbaGPA = calcGPA(
		countedMods.filter(
			(mod) =>
				mod.type?.toLowerCase() === "bba" ||
				mod.type?.toLowerCase() === "both"
		)
	);
	const bzaGPA = calcGPA(
		countedMods.filter(
			(mod) =>
				mod.type?.toLowerCase() === "bza" ||
				mod.type?.toLowerCase() === "both"
		)
	);

	return (
		<>
			<Header />
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
