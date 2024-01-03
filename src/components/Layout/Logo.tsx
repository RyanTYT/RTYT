import React from "react";
import styles from "./logo.module.css";

export default function Logo() {
	return (
		<div className={styles.logo}>
			<img src="" alt="RTYT!" />
			<div className={styles.header_name}>
				<div className={styles.header_name_row}>
					<span className={styles.header_name_i}>R</span>
					<span className={styles.header_name_i_after}>yan</span>
					<span className={styles.header_name_i_small_space}>T</span>
					<span className={styles.header_name_i_after}>an</span>
				</div>
				<div className={styles.header_name_row}>
					<span className={styles.header_name_i_small_space}>Y</span>
					<span className={styles.header_name_i_after}>an</span>
					<span className={styles.header_name_i_small_space}>T</span>
					<span className={styles.header_name_i_after}>ong</span>
				</div>
			</div>
		</div>
	);
}
