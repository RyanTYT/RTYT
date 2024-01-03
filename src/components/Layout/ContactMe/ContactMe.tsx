import React from "react";

import styles from "@/components/Layout/ContactMe/contactMe.module.css";
import LinkingBackground from "@/components/Layout/Background/LinkingBackground";

export default function ContactMe() {
    return (
        <div className={styles.bigContainer}>
            <div className={styles.background}>
                <LinkingBackground
                    numParticles={80}
                    distance={50}
                    uniqueID="ContactMeBackground"
                />
            </div>
            <div className={styles.details}>
                <span>Ryan Tan Yan Tong</span>
                <span>NUS DDP (BZA & BBA)</span>
            </div>
            <div className={styles.outside}>
                Ryan Tan Yan Tong, NUS, National University of Singapore, Business Analytics, Business Administration, Double Degree Programme, DDP, NUS Merit Scholarship
            </div>
            <div className={styles.contacts}>
                <div className={styles.container}>
                    <a href="https://github.com/Ryan-loves-movies">
                        <img src="./icons/whiteGithub.svg" alt="Github" />
                    </a>
                    <a href="https://www.linkedin.com/in/ryan-tan-yan-tong-b820121a3/">
                        <div
                            style={{
                                scale: 0.5,
                            }}
                        >
                            <img
                                src="./icons/whiteLinkedin.svg"
                                alt="Linkedin"
                            />
                        </div>
                    </a>
                    <a href="mailto:ryan.tyt@u.nus.edu">
                        <img src="./icons/whiteEmail.svg" alt="Email" />
                    </a>
                    <a href="tel:+65 96433328" className={styles.phone}>
                        <img src="./icons/whitePhone.svg" alt="Phone" />
                        <span>+65 9643 3328</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
