import styles from "@/components/Layout/SideBar/sidebarLink.module.css";
import { ReactElement } from "react";
import Link from "next/link";

export default function SidebarLink({
	icon,
	text,
	link,
	funcOnClick,
}: {
	icon: ReactElement;
	text: string;
	link: string;
	funcOnClick: () => void;
}) {
	return (
		<Link className={styles.text} href={link} onClick={funcOnClick}>
			<div className={styles.container}>
				<div className={styles.icon}>{icon}</div>
				<div className={styles.link}>{text}</div>
			</div>
		</Link>
	);
}
