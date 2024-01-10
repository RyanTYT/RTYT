import React from "react";
import { BBAsvg, BothSVG, BZAsvg } from "@/components/Education/EducationIcons";
import styles from "@/components/Education/educationMod.module.css";
import { NUSmod } from "@/components/modules/NUSmod";
import { ForwardedRef, forwardRef } from "react";
import Link from "next/link";

export default function EducationMod({ mod }: { mod: NUSmod }) {
	const icon = {
		bba: <BBAsvg />,
		bza: <BZAsvg />,
		both: <BothSVG />,
	};
	function truncate(descr: string, n: number) {
		return descr.length > n ? descr.slice(0, n - 1) + "..." : descr;
	}

	return (
		<Link className={styles.bigContainer} href={`/education/${mod.name as string}`}>
			<div className={styles.container}>
				<div className={styles.icon}>
					{icon[mod.type?.toLowerCase() as "bba" | "bza" | "both"]}
				</div>
				<span className={styles.name}>{mod.name}</span>
				<span className={styles.title}>{mod.title}</span>
				<span className={styles.grade}>{`Grade: ${mod.grade}`}</span>
				<div className={styles.lineContainer}>
					<div className={styles.line} />
				</div>
				<span className={styles.description}>
					{truncate(mod.description ? mod.description : "", 200)}
				</span>
			</div>
		</Link>
	);
}

export const EducationModRef = forwardRef(
	({ mod }: { mod: NUSmod }, ref: ForwardedRef<HTMLDivElement>) => {
		return (
			<div ref={ref}>
				<EducationMod mod={mod} />
			</div>
		);
	}
);
EducationModRef.displayName = "EducationModRef";
