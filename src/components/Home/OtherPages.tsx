import React, { ReactElement } from "react";
import PageIcon from "@/components/Home/PageIcon";
import styles from "@/components/Home/otherPages.module.css";
// import ReactComponent as Home from "@/components/Home/icons/home.svg";
// import { ReactComponent as Education } from "@home/icons/edu.svg";
// import { ReactComponent as Project } from "@home/icons/project.svg";

export default function OtherPages() {
	const pageLinks = ["/", "/education", "/projects"]; // to change this for react-router
	const pageIcons: ReactElement[] = [
		<img src="/icons/home.svg" key="HomeIcon"/>,
		<img src="/icons/edu.svg" key="EduIcon"/>,
		<img src="/icons/project.svg" key="ProjectIcon"/>,
	];
	const pageDesc: string[] = ["Home", "Education", "Projects"];

	const allPages: ReactElement[] = [];

	for (let i = 0; i < pageIcons.length; i++) {
		allPages.push(
			<PageIcon
				link={pageLinks[i]}
				img={pageIcons[i]}
				desc={pageDesc[i]}
				key={`page-${i}`}
			/>
		);
	}

	return <div className={styles.pages_row}>{allPages}</div>;
}
