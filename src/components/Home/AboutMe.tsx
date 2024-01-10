import React from "react";
import styles from "@/components/Home/aboutMe.module.css";

export default function AboutMe() {
	return (
		<div className={styles.container}>
			<img className={styles.image} src='./PersonalPhoto.jpeg' alt="RTYT!" />
			<div className={styles.text}>
				Hi! I&apos;m currently a Year 2 undergraduate studying Business
				Analytics (BZA) and Business Administration (BBA) in NUS
				(National University of Singapore). My primary interest lies in
				the applications of machine learning and AI algorithms using the
				vast data pools available to us in this age. However, I&apos;m also
				exploring this space as I continue to learn more and am
				currently interested in building applications and code
				optimisation. Feel free to reach out to me via any of the links
				below!
			</div>
		</div>
	);
}
