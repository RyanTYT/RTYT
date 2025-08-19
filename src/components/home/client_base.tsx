"use client";
import { createStyles } from "@/app/theme";
import { useRouter } from "next/navigation";

export default function BackButton({ label = "← Back" }: { label?: string }) {
	const router = useRouter();
	const styles = createStyles();

	return (
		<button
			onClick={() => router.back()}
			className={`${styles.buttons.ghost} mb-6`}
		>
			{label}
		</button>
	);
}
