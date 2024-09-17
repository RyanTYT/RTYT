import React, { useEffect, useState } from "react";
import styles from "@/components/Home/bark.module.css";

export default function Bark() {
	const [height, setHeight] = useState(0.0);
	useEffect(() => {
		window.addEventListener("scroll", () => {
			const timeline_element = document.getElementById("timeline");
			if (!timeline_element) {
				console.log("Error: Timeline Element Not Found");
				return;
			}
			const timeline_starting_y = timeline_element.offsetTop;
			const curr_y = window.scrollY;

			setHeight(
				Math.max(
					curr_y - timeline_starting_y + window.innerHeight / 2,
					0.0
				)
			);
		});
	}, []);
	return (
		<>
			<div className={styles.bark} />
			<div
				style={{ height: `${height}px` }}
				className={styles.progress}
			/>
		</>
	);
}
