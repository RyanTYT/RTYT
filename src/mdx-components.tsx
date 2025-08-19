import { createStyles } from "@/app/theme";
import type { MDXComponents } from "mdx/types";
import clsx from "clsx";

export function useMDXComponents(components: MDXComponents): MDXComponents {
	const styles = createStyles();
	return {
		// h1: ({ children }) => <h1 className={styles.typography.h1}>{children}</h1>,
		// h2: ({ children }) => <h2 className={styles.typography.h2}>{children}</h2>,
		// h3: ({ children }) => <h3 className={styles.typography.h3}>{children}</h3>,
		// h4: ({ children }) => <h4 className={styles.typography.h4}>{children}</h4>,
		h1: ({ children }) => <h3 className={styles.typography.h3}>{children}</h3>,
		h2: ({ children }) => <h4 className={styles.typography.h4}>{children}</h4>,
		h3: ({ children }) => <h5 className={styles.typography.h5}>{children}</h5>,
		// h4: ({ children }) => <h4 className={styles.typography.h4}>{children}</h4>,
		p: ({ children }) => <p className={`${styles.typography.body} mb-4`}>{children}</p>,
		a: ({ href, children }) => (
			<a href={href} className={styles.links.primary}>
				{children}
			</a>
		),
		li: ({ children }) => (
			<div className="flex items-center">
				<div className={styles.utilities.dotList}></div>
				<span className={`${styles.typography.bodyTight} w-full`}>
					{children}
				</span>
			</div>
		),
		ul: ({ children }) => <div className="space-y-3 mt-2 mb-2">{children}</div>,
        table: ({ className, children, ...props }) => (
          <table
            className={clsx(
              "w-full border-collapse text-sm", // base styles
              className?.includes("outlined") &&
                "border border-gray-300 shadow-sm rounded-lg overflow-hidden"
            )}
            {...props}
          >{children}</table>
        ),
        th: ({ children }) => <th className="max-w-md">{children}</th>,
        td: ({ children }) => <td className="max-w-md">{children}</td>,
		...components,
	};
}
