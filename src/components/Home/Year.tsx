"use client";
import styles from "@/components/Home/year.module.css";
import React, { useEffect, useState } from "react";

export default function Year({
	year,
	height,
	id,
}: {
	year: string;
	height: string;
	id: string;
}) {
	const [active, setActive] = useState(false);
	const updateYearActive = () => {
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
	};
	useEffect(() => {
		updateYearActive();
		window.addEventListener("scroll", updateYearActive);
	}, []);
	return (
		<div
			style={{ height: height }}
			className={styles.year_position}
			id={id}
		>
			<div className={`${styles.year} ${active ? styles.active : ""}`}>
				<span
					className={`normal-font-style ${active ? styles.active : ""}`}
					style={{
						fontSize: "1.75rem",
						background: "none",
					}}
				>
					{year}
				</span>
			</div>
		</div>
	);
}
