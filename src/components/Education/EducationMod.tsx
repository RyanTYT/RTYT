import React from "react";
import { BBAsvg, BothSVG, BZAsvg } from "@/components/Education/EducationIcons";
import styles from "@/components/Education/educationMod.module.css";
import { NUSmod } from "@/components/modules/NUSmod";
import { ForwardedRef, forwardRef } from "react";

export default function EducationMod({ mod }: { mod: NUSmod }) {
    const icon = {
        bba: <BBAsvg />,
        bza: <BZAsvg />,
        both: <BothSVG />,
    };
    function truncate(descr: string, n: number) {
        return descr.length > n ? descr.slice(0, n - 1) + "..." : descr;
    }

    return (
        <div className={styles.container}>
            <div className={styles.icon}>
                {icon[mod.type?.toLowerCase() as "bba" | "bza" | "both"]}
            </div>
            <span className={styles.header}>{`${mod.name}: ${mod.title}`}</span>
            <span className={styles.description}>
                {truncate(mod.description ? mod.description : "", 100)}
            </span>
            <span>{`Grade: ${mod.grade}`}</span>
        </div>
    );
}

export const EducationModRef = forwardRef(
    ({ mod }: { mod: NUSmod }, ref: ForwardedRef<HTMLDivElement>) => {
        const icon = {
            bba: <BBAsvg />,
            bza: <BZAsvg />,
            both: <BothSVG />,
        };
        function truncate(descr: string, n: number) {
            return descr.length > n ? descr.slice(0, n - 1) + "..." : descr;
        }

        return (
            <div className={styles.container} ref={ref}>
                <div className={styles.icon}>
                    {icon[mod.type!.toLowerCase() as "bba" | "bza" | "both"]}
                </div>
                <span
                    className={styles.header}
                >{`${mod.name}: ${mod.title}`}</span>
                <span className={styles.description}>
                    {truncate(mod.description ? mod.description : "", 100)}
                </span>
                <span>{`Grade: ${mod.grade}`}</span>
            </div>
        );
    }
);
EducationModRef.displayName = "EducationModRef";
