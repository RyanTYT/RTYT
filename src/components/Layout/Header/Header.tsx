"use client";
import { useRouter } from "next/navigation";
import React, { MouseEvent, useEffect, useState } from "react";
import styles from "./header.module.css";

export default function Header({
    initial_focused_header,
}: {
    initial_focused_header: "Home" | "Academics" | "Projects";
}) {
    const headers = ["Home", "Academics", "Projects"];

    const [focused_header, set_focused_header] = useState(
        initial_focused_header
    );
    const router = useRouter();
    const onClickPage = (ev: React.MouseEvent<HTMLSpanElement>) => {
        ev.preventDefault();
        const page = (ev.target as HTMLSpanElement).innerText.toLowerCase();
        router.push(`/${page}`);
        set_focused_header(
            (page[0].toUpperCase() + page.slice(1)) as
            | "Home"
            | "Academics"
            | "Projects"
        );
        console.log(focused_header)
    };

    useEffect(() => {
        console.log(focused_header)
    }, [focused_header])

    return (
        <div className={styles.header}>
            {headers.map((header) => {
                return (
                    <span
                        className={
                            header === focused_header
                                ? "important-font-style"
                                : "normal-font-style"
                        }
                        onClick={onClickPage}
                        style={{
                            color: `${header === focused_header ? "var(--highlight)" : ""}`,
                            fontSize: "1.5rem"
                        }}
                        key={header}
                    >
                        {header}
                    </span>
                );
            })}
        </div>
    );
}
