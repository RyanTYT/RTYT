"use client";
import { Github, Linkedin, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { SocialLinksNav } from "@/components/home/common";
import { Container } from "@/components/home/base";
import { ReactNode } from "react";
import { createStyles } from "@/app/theme";

const styles = createStyles();
// Navigation Components
const NavLink = ({
	active = false,
	children,
	className = "",
	href = "",
	...props
}: {
	active?: boolean;
	children: ReactNode;
	className?: string;
	href?: string;
}) => {
	const baseStyle = active
		? styles.navigation.linkActive
		: styles.navigation.link;

	if (href !== "")
		return (
			<a className={`${baseStyle} ${className}`} href={href} {...props}>
				{children}
			</a>
		);

	return (
		<a className={`${baseStyle} ${className}`} {...props}>
			{children}
		</a>
	);
};
const Navigation = ({
	children,
	className = "",
	...props
}: {
	children: ReactNode;
	className?: string;
}) => (
	<nav className={`${styles.navigation.bar} ${className}`} {...props}>
		{children}
	</nav>
);

export default function Navbar({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathName = usePathname();
	const routes = [
		{ label: "Home", link: "/" },
		{ label: "Experience", link: "/experience" },
		{ label: "Projects", link: "/projects" },
		{ label: "Journal", link: "/journal" },
	];
	// Social links configuration
	const socialLinks = [
		{ href: "mailto:ryan.tyt@u.nus.edu", icon: Mail, label: "Email" },
		{
			href: "https://linkedin.com/in/",
			icon: Linkedin,
			label: "LinkedIn",
		},
		{ href: "https://github.com/RyanTYT", icon: Github, label: "GitHub" },
	];

	return (
		<>
			{/* Navigation */}
			<Navigation>
				<Container className="py-4">
					<div className="flex items-center justify-between">
						<div className="text-xl font-bold text-slate-900">Ryan Tan YT</div>
						<div className="hidden md:flex items-center space-x-8">
							{routes.map((route) => {
								return (
									<NavLink
										href={route.link}
										active={
											pathName === route.link ||
											(pathName === "/" && route.label === "Home")
										}
										key={route.link}
									>
										{route.label}
									</NavLink>
								);
							})}
						</div>
						<SocialLinksNav links={socialLinks} />
					</div>
				</Container>
			</Navigation>
			{children}
		</>
	);
}
