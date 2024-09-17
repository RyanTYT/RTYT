import React from "react";

import styles from "@/components/Layout/Footer/footer.module.css";

export default function ContactMe() {
    return (
        <div className={styles.footer}>
            <span
                className="normal-font-style"
                style={{ color: "var(--important)" }}
            >
                Ryan Tan Yan Tong
            </span>
            <div className={styles.links}>
                <a href="https://github.com/RyanTYT">
                    <span
                        className="normal-font-style"
                        style={{ color: "var(--important)" }}
                    >
                        Github
                    </span>
                </a>
                <a href="https://www.linkedin.com/in/ryan-tan-yan-tong/">
                    <span
                        className="normal-font-style"
                        style={{ color: "var(--important)" }}
                    >
                        LinkedIn
                    </span>
                </a>
                <a href="mailto:ryan.tyt@u.nus.edu">
                    <span
                        className="normal-font-style"
                        style={{ color: "var(--important)" }}
                    >
                        Email
                    </span>
                </a>
            </div>
        </div>
    );
}
