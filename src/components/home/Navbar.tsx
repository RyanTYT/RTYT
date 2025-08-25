"use client";
import { Github, Linkedin, Mail, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { SocialLinksNav } from "@/components/home/common";
import { Container } from "@/components/home/base";
import { ReactNode, useState } from "react";
import { createStyles } from "@/app/theme";
import Link from "next/link";

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
			<Link className={`${baseStyle} ${className}`} href={href} {...props}>
				{children}
			</Link>
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
	const [isOpen, setIsOpen] = useState(false);

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
						{/* Mobile toggle button */}
						<button
							className="md:hidden p-2 text-slate-900"
							style={{ cursor: "pointer" }}
							onClick={() => setIsOpen(!isOpen)}
						>
							{isOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>
					{/* Mobile nav dropdown */}
					{/*isOpen && (
						<div className="mt-4 flex flex-col space-y-4 md:hidden">
							{routes.map((route) => (
								<div onClick={() => setIsOpen(false)} key={route.link}>
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
								</div>
							))}
						</div>
					)*/}
					{/* Mobile nav dropdown with animation */}
					<div
						className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
							isOpen ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0"
						}`}
					>
						<div className="flex flex-col space-y-4">
							{routes.map((route) => (
								<div onClick={() => setIsOpen(false)} key={route.link}>
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
								</div>
							))}
						</div>
					</div>
				</Container>
			</Navigation>
			{children}
		</>
	);
}
