// import Link from "next/link";
import nusMods from "@/data/nusMods.json";
import styles from "@/app/education/[mod]/mod.module.css";
import EducationHeader from "@/components/Education/EducationHeader";
import { BBAsvg, BothSVG, BZAsvg } from "@/components/Education/EducationIcons";

export function generateStaticParams() {
	return nusMods.modules.map((mod) => {
		return {
			mod: mod.name,
		};
	});
}

export default function Page({ params }: { params: { mod: string } }) {
	const icon = {
		bba: <BBAsvg />,
		bza: <BZAsvg />,
		both: <BothSVG />,
	};
	const mod = nusMods.modules.find((mod) => mod.name === params.mod);
	if (mod === undefined) {
		return <></>;
	}
	return (
		<>
			<EducationHeader />
			<div className={styles.bigContainer}>
				<div className={styles.container}>
					<div className={styles.main}>
						{
							icon[
								mod.type?.toLowerCase() as
									| "bba"
									| "bza"
									| "both"
							]
						}
						<div className={styles.blank} />
						<span>{mod.name}</span>
						<span>{mod.title}</span>
						<span>{`Grade: ${mod.grade}`}</span>
					</div>
					<div className={styles.description}>{mod.description}</div>
				</div>
			</div>
		</>
	);
}
