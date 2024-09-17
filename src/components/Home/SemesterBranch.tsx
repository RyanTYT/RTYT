"use client";
import { useState } from "react";
import Branch from "@/components/Home/Branch";
import Semester from "@/components/Academics/Semester";

export default function SemesterBranch({
	date,
	alignment,
	id,

	semester,
}: {
	date: string;
	alignment: "left" | "right";
	id: string;

	semester: string;
}) {
	const [active, setActive] = useState(false);
	return (
		<Branch
			date={date}
			content={<Semester semester={semester} active={active} />}
			setActiveParent={setActive}
			alignment={alignment}
			id={id}
		/>
	);
}
