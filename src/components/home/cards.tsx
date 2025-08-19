// components.js - Reusable component library
import React, { HTMLAttributes, ReactNode } from "react";
import { ArrowRight, LucideIcon, Clock } from "lucide-react";
import { createStyles } from "@/app/theme";
import { Badge, Heading, Tag, Text } from "@/components/home/base";

const styles = createStyles();

// Card Components
export const Card = ({
	variant = "base",
	children,
	className = "",
	interactive = false,
	...props
}: {
	variant?: keyof typeof styles.cards;
	children: ReactNode | ReactNode[];
	className?: string;
	interactive?: boolean;
} & HTMLAttributes<HTMLElement>) => {
	const baseStyle = interactive
		? styles.cards.interactive
		: styles.cards[variant];

	return (
		<div className={`${baseStyle} ${className}`} {...props}>
			{interactive && <div className={styles.utilities.backgroundOverlay} />}
			<div className={interactive ? "relative z-10" : ""}>{children}</div>
		</div>
	);
};

// Specialized Components
export const ProjectCard = ({
	title,
	description,
	tech = [],
	type,
	delay = 0,
	className = "",
	duration = "3 months",
	project_status = "Completed",
	...props
}: {
	title: string;
	description: string;
	tech: string[];
	type: string;
	delay?: number;
	className?: string;
	duration?: string;
	project_status?: string;
} & HTMLAttributes<HTMLElement>) => (
	<Card
		interactive
		className={className}
		style={{ animationDelay: `${delay}ms` }}
		{...props}
	>
		<div className={styles.utilities.flexBetween + " mb-4"}>
			<Heading
				level={4}
				className="group-hover:text-sky-600 transition-colors duration-300"
			>
				{title}
			</Heading>
			<Badge>{type}</Badge>
		</div>

		<Text variant="muted" className="mb-4">
			{description}
		</Text>

		<div className="flex flex-wrap gap-2 mb-4">
			{tech.map((item, index) => (
				<Tag key={index}>{item}</Tag>
			))}
		</div>

		<div className={`${styles.utilities.flexBetween} text-sm`}>
			<div className="flex items-center space-x-4">
				<div className="flex items-center">
					<Clock className="w-4 h-4 mr-1 text-slate-500" />
					<span className={styles.typography.small}>{duration}</span>
				</div>
				<span className={styles.badges.success}>{project_status}</span>
			</div>
			<div className="flex items-center text-sky-600 font-medium group-hover:text-sky-700 transition-colors duration-300">
				<span className="mr-2">View Details</span>
				<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
			</div>
		</div>
	</Card>
);
// <Link variant="primary" className="font-medium">
// 	View Details
// 	<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
// </Link>

export const MetricCard = ({
	value,
	label,
	Icon,
	className = "",
	...props
}: {
	value: string;
	label: string;
	Icon: LucideIcon;
	className?: string;
}) => (
	<Card className={`${className}`} {...props} variant="base">
		<div
			className={`${styles.utilities.flexCenter} w-12 h-12 bg-sky-100 rounded-lg mb-4 mx-auto`}
		>
			<Icon className="w-6 h-6 text-sky-600" />
		</div>
		<div className="text-2xl font-bold text-slate-900 mb-2">{value}</div>
		<Text variant="muted">{label}</Text>
	</Card>
);

// export const SkillItem = ({
// 	skill,
// 	variant = "primary",
// 	className = "",
// 	...props
// }: {
// 	skill: string;
// 	variant?: "primary";
// 	className?: string;
// }) => {
// 	const dotStyle =
// 		variant === "primary"
// 			? styles.utilities.dotPrimary
// 			: styles.utilities.dotSuccess;
//
// 	return (
// 		<div className={`flex items-center ${className}`} {...props}>
// 			<div className={dotStyle} />
// 			<Text variant="body">{skill}</Text>
// 		</div>
// 	);
// };

// export default {
// 	Card,
// 	ProjectCard,
// 	MetricCard,
// };
