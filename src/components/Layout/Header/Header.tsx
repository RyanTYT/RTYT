import StarryBackground from "@/components/Layout/Background/starryBackground";
import React, { ReactElement } from "react";
import styles from "./header.module.css";

export default function CustomHeader({
	header,
	description,
}: {
	header: string;
	description: ReactElement;
}) {
	return (
		<>
			<div className={styles.background}>
				<StarryBackground
					numParticles={200}
					uniqueID="HeaderBackground"
				/>
			</div>
			<div className={styles.container}>
				<div className={styles.header}>{header}</div>
				<div className={styles.description}>{description}</div>
			</div>
		</>
	);
}
