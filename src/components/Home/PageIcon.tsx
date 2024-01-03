import React, { ReactElement } from "react";
import Link from "next/link";
import styles from "@/components/Home/pageIcon.module.css";

export default function PageIcon({
	link,
	img,
	desc,
}: {
	link: string;
	img: ReactElement;
	desc: string;
}) {
	return (
		<div className={styles.pageIcon}>
			<Link className={styles.link} href={link}>
				<div className={styles.icon}>{img}</div>
				<div className={styles.description}>{desc}</div>
			</Link>
		</div>
	);
}
