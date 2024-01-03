"use client";
import styles from "@/components/Layout/Sidebar/sidebar.module.css";
import { Spin as Hamburger } from "hamburger-react";
import React, { ReactElement, useState } from "react";
import SidebarLink from "@/components/Layout/SideBar/SidebarLink";
// import { ReactComponent as Home } from "@home/icons/whiteHome.svg";
// import { ReactComponent as Education } from "@home/icons/whiteEdu.svg";
// import { ReactComponent as Project } from "@home/icons/whiteProject.svg";

export default function SideBar() {
	const [isOpen, setOpen] = useState(false);

	const icons = [
		<img src="/icons/whiteHome.svg" key="HomeIcon"/>,
		<img src="/icons/whiteEdu.svg" key="EduIcon"/>,
		<img src="/icons/whiteProject.svg" key="ProjectIcon"/>,
	];
	const texts = ["Home", "Education", "Projects"];
	const links = ["/", "/education", "/projects"]; // to change this for react-router

	const menu: ReactElement[] = [];

	for (let i = 0; i < texts.length; i++) {
		menu.push(
			<SidebarLink
				funcOnClick={() => setOpen(false)}
				icon={icons[i]}
				text={texts[i]}
				link={links[i]}
				key={`${texts[i]}-${links[i]}`}
			/>
		);
	}

	return (
		<div className={`${styles.container} ${isOpen ? styles.open : ""}`}>
			<div className={styles.hamburger} onClick={() => setOpen(!isOpen)}>
				<Hamburger
					toggled={isOpen}
					toggle={setOpen}
					size={40}
					direction="left"
					duration={0.5}
					distance="lg"
					easing="ease-in"
					label="table of contents"
				/>
			</div>
			<div
				className={`${styles.sidebar} ${
					isOpen ? styles.display : styles.hide
				}`}
			>
				{menu}
			</div>
		</div>
	);
}
