import React from "react";
import styles from "@/components/Education/educationIcons.module.css";

export const Line = () => (
	<svg height="32px" width="32px">
		<line
			x1="5%"
			y1="5%"
			x2="95%"
			y2="95%"
			style={{
				stroke: "#161616",
				strokeWidth: 2,
			}}
		/>
	</svg>
);

export const BZAsvg = () => (
	<svg
		fill="#161616"
		version="1.1"
		id="Capa_1"
		xmlns="http://www.w3.org/2000/svg"
		width="32px"
		height="32px"
		viewBox="0 0 357.742 357.741"
		stroke="#ffffff"
	>
		<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
		<g
			id="SVGRepo_tracerCarrier"
			strokeLinecap="round"
			strokeLinejoin="round"
		></g>
		<g id="SVGRepo_iconCarrier">
			{" "}
			<g>
				{" "}
				<g>
					{" "}
					<g>
						{" "}
						<path d="M0,18.999v319.743h357.742V18.999H0z M11.061,327.693V57.012h335.62v270.682H11.061z"></path>{" "}
					</g>{" "}
					<g>
						{" "}
						<polygon points="39.013,175.637 39.013,186.725 124.375,230.704 124.375,215.656 55.586,181.17 123.708,147.039 124.375,146.7 124.375,131.646 39.659,175.298 "></polygon>{" "}
					</g>{" "}
					<g>
						{" "}
						<rect
							x="133.835"
							y="240.96"
							width="91.813"
							height="11.325"
						></rect>{" "}
					</g>{" "}
					<g>
						{" "}
						<polygon points="235.1,146.7 304.408,181.17 235.754,215.332 235.1,215.656 235.1,230.704 319.797,187.259 320.452,186.929 320.452,175.427 235.1,131.651 "></polygon>{" "}
					</g>{" "}
				</g>{" "}
			</g>{" "}
		</g>
	</svg>
);

export const BBAsvg = () => (
	<svg
		fill="#161616"
		width="32px"
		height="32px"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		stroke="#161616"
		strokeWidth="0.00024000000000000003"
	>
		<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
		<g
			id="SVGRepo_tracerCarrier"
			strokeLinecap="round"
			strokeLinejoin="round"
		></g>
		<g id="SVGRepo_iconCarrier">
			{" "}
			<title></title>{" "}
			<g id="growth">
				{" "}
				<path d="M21.5,21H20V9.5a.5.5,0,0,0-.5-.5h-3a.5.5,0,0,0-.5.5V21H14V13.5a.5.5,0,0,0-.5-.5h-3a.5.5,0,0,0-.5.5V21H8V14.5a.5.5,0,0,0-.5-.5h-3a.5.5,0,0,0-.5.5V21H2.5a.5.5,0,0,0,0,1h19a.5.5,0,0,0,0-1ZM7,21H5V15H7Zm6,0H11V14h2Zm6,0H17V10h2Z"></path>{" "}
				<path d="M2.5,13a.47.47,0,0,0,.35-.15l4.7-4.69L11.2,10.9a.49.49,0,0,0,.65-.05L19,3.71V5.5a.5.5,0,0,0,1,0v-3a.41.41,0,0,0,0-.19A.51.51,0,0,0,19.69,2a.41.41,0,0,0-.19,0h-3a.5.5,0,0,0,0,1h1.79L11.45,9.84,7.8,7.1a.49.49,0,0,0-.65.05l-5,5a.48.48,0,0,0,0,.7A.47.47,0,0,0,2.5,13Z"></path>{" "}
			</g>{" "}
		</g>
	</svg>
);

// Create the half icons for the melding together
const HalfBZAsvg = () => (
	<svg
		fill="#161616"
		version="1.1"
		id="Capa_1"
		xmlns="http://www.w3.org/2000/svg"
		width="32px"
		height="32px"
		viewBox="0 0 357.742 357.741"
		stroke="#161616"
		className={styles.bza}
	>
		<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
		<g
			id="SVGRepo_tracerCarrier"
			strokeLinecap="round"
			strokeLinejoin="round"
		></g>
		<g id="SVGRepo_iconCarrier">
			{" "}
			<g>
				{" "}
				<g>
					{" "}
					<g>
						{" "}
						<path d="M0,18.999v319.743h357.742V18.999H0z M11.061,327.693V57.012h335.62v270.682H11.061z"></path>{" "}
					</g>{" "}
					<g>
						{" "}
						<polygon points="39.013,175.637 39.013,186.725 124.375,230.704 124.375,215.656 55.586,181.17 123.708,147.039 124.375,146.7 124.375,131.646 39.659,175.298 "></polygon>{" "}
					</g>{" "}
					<g>
						{" "}
						<rect
							x="133.835"
							y="240.96"
							width="91.813"
							height="11.325"
						></rect>{" "}
					</g>{" "}
					<g>
						{" "}
						<polygon points="235.1,146.7 304.408,181.17 235.754,215.332 235.1,215.656 235.1,230.704 319.797,187.259 320.452,186.929 320.452,175.427 235.1,131.651 "></polygon>{" "}
					</g>{" "}
				</g>{" "}
			</g>{" "}
		</g>
	</svg>
);

const HalfBBAsvg = () => (
	<svg
		fill="#161616"
		width="32px"
		height="32px"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
		stroke="#161616"
		strokeWidth="0.00024000000000000003"
		className={styles.bba}
	>
		<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
		<g
			id="SVGRepo_tracerCarrier"
			strokeLinecap="round"
			strokeLinejoin="round"
		></g>
		<g id="SVGRepo_iconCarrier">
			{" "}
			<title></title>{" "}
			<g id="growth">
				{" "}
				<path d="M21.5,21H20V9.5a.5.5,0,0,0-.5-.5h-3a.5.5,0,0,0-.5.5V21H14V13.5a.5.5,0,0,0-.5-.5h-3a.5.5,0,0,0-.5.5V21H8V14.5a.5.5,0,0,0-.5-.5h-3a.5.5,0,0,0-.5.5V21H2.5a.5.5,0,0,0,0,1h19a.5.5,0,0,0,0-1ZM7,21H5V15H7Zm6,0H11V14h2Zm6,0H17V10h2Z"></path>{" "}
				<path d="M2.5,13a.47.47,0,0,0,.35-.15l4.7-4.69L11.2,10.9a.49.49,0,0,0,.65-.05L19,3.71V5.5a.5.5,0,0,0,1,0v-3a.41.41,0,0,0,0-.19A.51.51,0,0,0,19.69,2a.41.41,0,0,0-.19,0h-3a.5.5,0,0,0,0,1h1.79L11.45,9.84,7.8,7.1a.49.49,0,0,0-.65.05l-5,5a.48.48,0,0,0,0,.7A.47.47,0,0,0,2.5,13Z"></path>{" "}
			</g>{" "}
		</g>
	</svg>
);

export const BothSVG = () => (
	<div className={styles.both}>
		<div className={styles.overlap}>
			<HalfBBAsvg />
		</div>
		<div className={styles.overlap}>
			<HalfBZAsvg />
		</div>
		<div className={styles.overlap}>
			<Line />
		</div>
	</div>
);
