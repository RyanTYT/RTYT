import React, { ElementType, HTMLAttributes, ReactNode } from "react";
import { createStyles } from "@/app/theme";
import { ExternalLink, LucideIcon } from "lucide-react";

const styles = createStyles();

// This file is ordered by size of component, from simplest and smallest to largest - Heading -> Containers

export const Heading = ({
	level = 1,
	children,
	className = "",
	...props
}: {
	level?: 1 | 2 | 3 | 4;
	children: ReactNode;
	className?: string;
}) => {
	const Tag = `h${level}` as ElementType;
	const baseStyle = styles.typography[`h${level}`] || styles.typography.h1;

	return (
		<Tag className={`${baseStyle} ${className}`} {...props}>
			{children}
		</Tag>
	);
};

export const Text = ({
	variant = "body",
	children,
	className = "",
	...props
}: {
	variant?: keyof typeof styles.typography;
	children: ReactNode;
	className?: string;
}) => {
	const baseStyle = styles.typography[variant];

	return (
		<p className={`${baseStyle} ${className}`} {...props}>
			{children}
		</p>
	);
};

// Button Components
export const Button = ({
	variant = "primary",
	children,
	className = "",
	Icon,
	iconPosition = "right",
	...props
}: {
	variant?: keyof typeof styles.buttons;
	children: ReactNode;
	className?: string;
	Icon: LucideIcon;
	iconPosition?: "right" | "left";
} & HTMLAttributes<HTMLButtonElement>) => {
	const baseStyle = styles.buttons[variant];

	return (
		<button className={`${baseStyle} ${className}`} {...props}>
			{iconPosition === "left" && Icon && <Icon className="w-5 h-5 mr-2" />}
			{children}
			{iconPosition === "right" && Icon && (
				<Icon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
			)}
		</button>
	);
};

// Badge Components
// This is a simple component showcasing the status of something - i.e. Completed badge, ...
export const Badge = ({
	variant = "default",
	className = "",
	children,
	...props
}: {
	variant?: keyof typeof styles.badges;
	children: ReactNode;
	className?: string;
}) => {
	const baseStyle = styles.badges[variant];

	return (
		<span className={`${baseStyle} ${className}`} {...props}>
			{children}
		</span>
	);
};

// This is a Badge with an icon preceding it
export const StatusBadge = ({
	Icon,
	children,
	variant = "primary",
	className = "",
	...props
}: {
	Icon: LucideIcon;
	children: ReactNode;
	variant?: "primary";
	className?: string;
}) => (
	<div
		className={`inline-flex items-center px-4 py-2 bg-sky-50 text-sky-700 rounded-full text-sm ${className}`}
		{...props}
	>
		<Icon className="w-4 h-4 mr-2" />
		{children}
	</div>
);

// This is for tags for a particular project - i.e. Python, Docker, ...
export const Tag = ({
	variant = "default",
	children,
	className = "",
	...props
}: {
	variant?: keyof typeof styles.tags;
	children: ReactNode;
	className?: string;
}) => {
	const baseStyle = styles.tags[variant];

	return (
		<span className={`${baseStyle} ${className}`} {...props}>
			{children}
		</span>
	);
};

export const Link = ({
	variant = "primary",
	children,
	className = "",
	Icon,
	external = false,
	href = "",
	...props
}: {
	variant?: keyof typeof styles.links;
	children: ReactNode;
	className?: string;
	Icon?: LucideIcon;
	href?: string;
	external?: boolean;
}) => {
	const baseStyle = styles.links[variant];
	const IconComponent = external ? ExternalLink : Icon;

	if (href !== "")
		return (
			<a
				className={`${baseStyle} ${className} inline-flex items-center`}
				href={href}
				{...props}
			>
				{children}
				{IconComponent && <IconComponent className="w-4 h-4 ml-2" />}
			</a>
		);
	return (
		<a
			className={`${baseStyle} ${className} inline-flex items-center`}
			{...props}
		>
			{children}
			{IconComponent && <IconComponent className="w-4 h-4 ml-2" />}
		</a>
	);
};

// Layout Components
export const Container = ({
	children,
	className = "",
	...props
}: {
	children: ReactNode;
	className?: string;
}) => (
	<div className={`${styles.layout.container} ${className}`} {...props}>
		{children}
	</div>
);

export const Section = ({
	children,
	className = "",
	...props
}: {
	children: ReactNode;
	className?: string;
} & HTMLAttributes<HTMLElement>) => (
	<section className={`${styles.layout.section} ${className}`} {...props}>
		{children}
	</section>
);

export const Grid = ({
	cols = "twoMd",
	children,
	className = "",
	...props
}: {
	cols?: keyof typeof styles.layout.grid;
	children: ReactNode;
	className?: string;
}) => {
	const baseStyle = styles.layout.grid[cols] || styles.layout.grid.twoMd;

	return (
		<div className={`${baseStyle} ${className}`} {...props}>
			{children}
		</div>
	);
};
