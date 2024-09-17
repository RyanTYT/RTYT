import React from "react";
import styles from "@/components/Project/project.module.css";

export default function Project({
    img_src,
    img_alt,
    title,
    date,
    description,

    live_link,
    source_code_link,
}: {
    img_src: string;
    img_alt: string;
    title: string;
    date: string;
    description: string;

    live_link: string;
    source_code_link: string;
}) {
    const Link = ({ text, link }: { text: string; link: string }) => {
        return (
            <div className={styles.link}>
                <a
                    href={link}
                    className={`${styles.link_text} normal-font-style`}
                >
                    {text}
                </a>
            </div>
        );
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span
                    style={{
                        color: "var(--highlight)",
                    }}
                    className="normal-header-font-style"
                >
                    {title}
                </span>
                <span
                    style={{
                        color: "var(--highlight)",
                    }}
                    className="normal-header-font-style"
                >
                    {date}
                </span>
            </div>
            <div className={styles.image_description}>
                <img alt={img_alt} src={img_src} className={styles.image} />
                <div className={styles.description}>
                    <span className="normal-font-style">{description}</span>
                    <div className={styles.link}>
                        {live_link ? (
                            <Link text="Live Link" link={live_link} />
                        ) : (
                            <></>
                        )}
                        {source_code_link ? (
                            <Link text="Source Code" link={source_code_link} />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
