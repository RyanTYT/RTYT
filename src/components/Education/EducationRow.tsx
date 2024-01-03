"use client";
import React from "react";
import { gradeToGPA, NUSmod } from "@/components/modules/NUSmod";
import styles from "@/components/Education/educationRow.module.css";
import EducationMod, {
    EducationModRef,
} from "@/components/Education/EducationMod";
import { ForwardedRef, forwardRef, ReactElement, useRef } from "react";
import useInView from "@/hooks/useInView";

const Scroller = forwardRef(
    (
        {
            mods,
            className,
            elemNum,
        }: {
            mods: NUSmod[];
            className: string;
            elemNum: number;
        },
        ref: ForwardedRef<HTMLDivElement>
    ) => {
        // Return empty element if mods is empty
        if (mods.length === 0) {
            return <div className={className} ref={ref}></div>;
        }

        // Initialise and pass the ref down to the right elements
        const modsElem: ReactElement[] = mods.map((mod) => (
            <EducationMod mod={mod} key={mod.title} />
        ));

        if (elemNum === 1) {
            modsElem[0] = (
                <EducationModRef mod={mods[0]} key={mods[0].title} ref={ref} />
            );
        }
        if (elemNum === 3) {
            modsElem[mods.length - 1] = (
                <EducationModRef
                    mod={mods[mods.length - 1]}
                    key={mods[mods.length - 1].title}
                    ref={ref}
                />
            );
        }

        return (
            <>
                {elemNum === 2 ? (
                    <div
                        className={className}
                        style={{
                            animationDuration: `${mods.length * 5}s`,
                        }}
                        ref={ref}
                    >
                        {modsElem}
                    </div>
                ) : (
                    <div
                        className={className}
                        style={{
                            animationDuration: `${mods.length * 5}s`,
                        }}
                    >
                        {modsElem}
                    </div>
                )}
            </>
        );
    }
);
Scroller.displayName = "Scroller";

export default function EducationRow({
    title,
    NUSmodules,
}: {
    title: string;
    NUSmodules: NUSmod[];
}) {
    NUSmodules.sort((mod1, mod2) => {
        // Check for null values
        if (mod1.type === mod2.type && mod1.type === null) {
            return 0;
        } else if (mod1.type === null) {
            return -1;
        } else if (mod2.type === null) {
            return 1;
        }

        // if all not null
        if (mod1.type > mod2.type) {
            return 1;
        } else if (mod1.type < mod2.type) {
            return -1;
        }
        return 0;
    });

    const firstElem = useRef<null | HTMLDivElement>(null),
        secElem = useRef<null | HTMLDivElement>(null),
        thirdElem = useRef<null | HTMLDivElement>(null);
    const rowScroller = useRef<null | HTMLDivElement>(null);

    const scrollers = [
        <Scroller
            mods={NUSmodules}
            className={`${styles.longRow} ${styles.before}`}
            ref={firstElem}
            elemNum={1}
            key="elem1"
        />,
        <Scroller
            mods={NUSmodules}
            className={`${styles.longRow} ${styles.current}`}
            ref={secElem}
            elemNum={2}
            key="elem2"
        />,
        <Scroller
            mods={NUSmodules}
            className={`${styles.longRow} ${styles.after}`}
            ref={thirdElem}
            elemNum={3}
            key="elem3"
        />,
    ];

    useInView(firstElem, () => {
        rowScroller.current!.scrollLeft += 440 * NUSmodules.length;
    });
    useInView(thirdElem, () => {
        rowScroller.current!.scrollLeft -= 440 * NUSmodules.length;
    });

    // useEffect(() => {
    //     secElem.current!.scrollIntoView();
    // }, []);

    // Variables for footnote
    const numModsTaken = NUSmodules.filter((mod) => mod.moduleCredit).length;
    const modCredits = NUSmodules.map((mod) =>
        mod.moduleCredit ? mod.moduleCredit : 0
    ).reduce((a, b) => a + b, 0.0);
    const countedMods = NUSmodules.filter(
        (mod) =>
            mod.grade === "A+" ||
            mod.grade === "A" ||
            mod.grade === "A-" ||
            mod.grade === "B+" ||
            mod.grade === "B" ||
            mod.grade === "B-" ||
            mod.grade === "C+" ||
            mod.grade === "C" ||
            mod.grade === "D+" ||
            mod.grade === "D" ||
            mod.grade === "F"
    );
    const countedModCredits = countedMods
        .map((mod) => (mod.moduleCredit ? mod.moduleCredit : 0.0))
        .reduce((a, b) => a + b, 0.0);
    const gpa =
        countedMods
            .map((mod) => {
                var grade = mod.grade ? gradeToGPA.get(mod.grade) : 0.0;
                grade = grade ? grade : 0.0;
                console.log(`${mod.semester} ${grade} - ${mod.moduleCredit}`);

                // If there is a grade, there must be a moduleCredit as well
                return grade * mod.moduleCredit!;
            })
            .reduce((a, b) => a + b, 0.0) / countedModCredits;

    return (
        <div className={styles.container}>
            <div className={styles.header}>{title}</div>
            <div className={styles.rowContainer}>
                <div className={styles.row} ref={rowScroller}>
                    {scrollers}
                </div>
            </div>
            <div className={styles.footnote}>
                <span>Modules Taken: {numModsTaken}</span>
                <span>Module Credits Taken: {modCredits}</span>
                <span>GPA for Semester: {gpa.toFixed(1)}</span>
            </div>
        </div>
    );
}
