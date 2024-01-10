import CustomHeader from "@/components/Layout/Header/Header";
import { NUSmod, NUSmods, gradeToGPA } from "@/components/modules/NUSmod";
import styles from "@/components/Education/educationHeader.module.css";

import nusMods from "@/data/nusMods.json";

export function calcGPA(countedMods: NUSmod[]) {
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

export default function EducationHeader() {
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
}
