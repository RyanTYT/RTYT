import React from "react";
import { aboutMeStr } from "@/data/aboutMe";
import styles from "@/components/Home/old/aboutMe.module.css";

export default function AboutMe() {
    console.log(aboutMeStr)
	return (
		<div className={styles.container}>
			<img
				className={styles.image}
				src="./PersonalPhoto.jpeg"
				alt="RTYT!"
			/>
			<div className={styles.text} dangerouslySetInnerHTML={{ __html: aboutMeStr}}/>
		</div>
	);
}
