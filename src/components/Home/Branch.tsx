import React, { ReactElement, useEffect, useState } from "react";
import styles from "@/components/Home/branch.module.css";
import Semester from "@/components/Academics/Semester";

export default function Branch({
	date,
	content,
	// semester,
	setActiveParent,
	alignment,
	id,
}: {
	date: string;
	content: ReactElement;
	// semester: string;
	setActiveParent: Function;
	alignment: "left" | "right";
	id: string;
}) {
	const [active, setActive] = useState(false);

	useEffect(() => {
		window.addEventListener("scroll", () => {
			const timeline_element = document.getElementById("timeline");
			if (!timeline_element) {
				console.log("Error: Timeline Element Not Found");
				return;
			}
			const branch_element = document.getElementById(id);
			if (!branch_element) {
				console.log("Error: Branch Element Not Found");
				return;
			}

			const branch_element_starting_y =
				timeline_element.offsetTop + branch_element.offsetTop;
			const curr_y = window.scrollY + window.innerHeight / 2;

			setActive(curr_y > branch_element_starting_y);
			setActiveParent(curr_y > branch_element_starting_y);
		});
	}, []);

	return (
		<div
			style={{
				position: "relative",
				alignSelf: "stretch",
			}}
            className={styles.branch}
			id={id}
		>
			<span
				className={`${alignment === "left" ? styles.left_aligned_date : styles.right_aligned_date} ${styles.top_aligned} ${active ? styles.active_date : ""}`}
				style={{
					color: active ? "var(--highlight)" : "var(--font-color)",
				}}
			>
				{date}
			</span>
			<div
				className={`${styles.dot} ${active ? styles.active_dot : ""}`}
				style={{
					backgroundColor: active
						? "var(--highlight)"
						: "var(--font-color)",
				}}
			/>
			<div
				className={`
                ${alignment === "left" ? styles.left_aligned_branch : styles.right_aligned_branch} 
                ${styles.top_aligned}
                ${!active ? "" : alignment === "left" ? styles.left_branch_active : styles.right_branch_active}
                `}
			/>
			<div
				className={`
                ${alignment === "left" ? styles.left_aligned_content : styles.right_aligned_content} 
                ${styles.top_aligned}
                ${styles.content_inactive}
                ${active ? styles.content_active : ""}
                `}
			>
				{content}
			</div>
		</div>
	);
	// <Semester semester={semester} active={active} />
}
