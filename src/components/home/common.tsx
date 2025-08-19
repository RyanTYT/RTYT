import { createStyles } from "@/app/theme";
import { Link } from "@/components/home/base";
import { LucideIcon } from "lucide-react";

type link = {
	href: string;
	icon: LucideIcon;
	label: string;
};
// Social Links Component
export const SocialLinksNav = ({
	links = [],
	className = "",
	iconSize = "md",
	...props
}: {
	links: link[];
	className?: string;
	iconSize?: string;
}) => {
	const iconClass =
		iconSize === "sm" ? "w-4 h-4" : iconSize === "lg" ? "w-6 h-6" : "w-5 h-5";

	return (
		<div className={`flex items-center space-x-4 ${className}`} {...props}>
			{links.map(({ href, icon: Icon, label }, index) => (
				<Link
					key={index}
					href={href}
					variant="secondary"
					// className="p-2 rounded-lg hover:bg-slate-50"
					// className="p-2 rounded-lg hover:bg-slate-50"
					aria-label={label}
				>
					<Icon className={iconClass} />
				</Link>
			))}
		</div>
	);
};

// Social Links Component
export const SocialLinksFooter = ({
	links = [],
	className = "",
	iconSize = "md",
	...props
}: {
	links: link[];
	className?: string;
	iconSize?: string;
}) => {
	const iconClass =
		iconSize === "sm" ? "w-4 h-4" : iconSize === "lg" ? "w-6 h-6" : "w-5 h-5";

	return (
		<div className={`flex items-center space-x-6 ${className}`} {...props}>
			{links.map(({ href, icon: Icon, label }, index) => (
				<Link
					key={index}
					href={href}
					variant="footer"
					// className="p-2 rounded-lg hover:bg-slate-50"
					// className="p-2 rounded-lg hover:bg-slate-50"
					aria-label={label}
				>
					<Icon className={iconClass} />
				</Link>
			))}
		</div>
	);
};

export const BulletList = ({ points }: { points: string[] }) => {
	const styles = createStyles();
	return (
		<div className="space-y-3">
			{points.map((point, index) => {
				return (
					<div key={index} className="flex items-center">
						<div className={styles.utilities.dotPrimary}></div>
						<span className={styles.typography.bodyTight}>{point}</span>
					</div>
				);
			})}
		</div>
	);
};
