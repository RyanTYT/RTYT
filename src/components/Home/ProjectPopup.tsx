import styles from "@/components/Home/projectPopup.module.css";
import React from "react";

export default function ProjectPopup({
	img_src,
	img_alt,
	title,
	achievement,
	description,
	skills,
	live_link,
	source_code_link,
	alignment,
}: {
	img_src: string;
	img_alt: string;
	achievement: string;
	title: string;
	description: string[];
	skills: string[];
	live_link: string;
	source_code_link: string;
	alignment: "left" | "right";
}) {
	return (
		<div className={styles.project}>
			<img
				src={img_src}
				alt={img_alt}
				className={`${styles.image} ${alignment === "left" ? styles.image_right : styles.image_left}`}
			/>
			<div
				className={`${styles.card} ${alignment === "left" ? styles.card_left : styles.card_right}`}
			>
				<div
					className={`${styles.inner_card} ${alignment === "left" ? styles.inner_card_left : styles.inner_card_right}`}
				>
					<div className={styles.title}>
						<div
							className={`normal-header-font-style`}
							style={{
								textDecorationLine: "none",
								fontSize: "1.5rem",
							}}
						>
							{title}
						</div>
						{achievement === "" ? (
							<></>
						) : (
							<span
								className={`${styles.achievement} important-font-style`}
								key={`${styles.achievement}`}
							>
								{achievement}
							</span>
						)}
					</div>
					<div
						className={`${styles.inner_card_content} ${alignment === "left" ? styles.inner_card_content_left : styles.inner_card_content_right}`}
					>
						<div style={{ height: "fit-content" }}>
							<ul>
								{description.map((point) => (
									<li
										className="normal-font-style"
										key={point}
									>
										{point}
									</li>
								))}
							</ul>
						</div>
						<span
							style={{
								color: "var(--important)",
								fontSize: "1rem",
								textDecorationLine: "none",
							}}
							className="important-font-style"
						>
							{skills.reduce(
								(cum_skill, next_skill) =>
									cum_skill + ", " + next_skill
							)}
						</span>
						{live_link === "" && source_code_link === "" ? (
							<></>
						) : (
							<div className={styles.action_items}>
								{live_link === "" ? (
									<></>
								) : (
									<a href={live_link}>
										<div className={styles.action_item}>
											<div className={styles.icon}>
												<img
													style={{
														width: "1.5rem",
														height: "1.5rem",
													}}
													src="link.svg"
												/>
											</div>
											<span
												className="normal-font-style"
												style={{
													fontSize: "1rem",
													color: "var(--flip-font-color)",
												}}
											>
												Live Link
											</span>
										</div>
									</a>
								)}
								{source_code_link === "" ? (
									<></>
								) : (
									<a href={source_code_link}>
										<div className={styles.action_item}>
											<div className={styles.icon}>
												<img
													style={{
														width: "1.5rem",
														height: "1.5rem",
													}}
													src="/code.svg"
												/>
											</div>
											<span
												className="normal-font-style"
												style={{
													fontSize: "1rem",
													color: "var(--flip-font-color)",
												}}
											>
												Source Code
											</span>
										</div>
									</a>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
