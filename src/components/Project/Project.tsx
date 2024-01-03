import React from "react";
import styles from "@/components/Project/project.module.css";

export default function Project({
	img,
	imgAlt,
	title,
	description,
}: {
	img: string;
	imgAlt: string;
	title: string;
	description: string;
}) {
	return (
		<div className={styles.project}>
			<div className={styles.projectImg}>
				<img src={img} alt={imgAlt} />
				<span className={styles.projectTitle}>{title}</span>
			</div>
			<div className={styles.description}>{description}</div>
		</div>
	);
}
