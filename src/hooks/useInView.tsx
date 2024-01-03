"use client";
import { RefObject, useEffect, useMemo, useState } from "react";

export default function useInView(
    ref: RefObject<HTMLDivElement>,
    funcOnVisible: () => void = () => { },
    funcOnInvisible: () => void = () => { }
) {
    const [isIntersecting, setIsIntersecting] = useState(false);

    const observer = useMemo(
        () =>
            typeof IntersectionObserver !== "undefined"
                ? new IntersectionObserver(([entry]) => {
                    setIsIntersecting(entry.isIntersecting);
                    if (entry.isIntersecting) {
                        funcOnVisible();
                    } else {
                        funcOnInvisible();
                    }
                })
                : null,
        [funcOnInvisible, funcOnVisible]
    );

    useEffect(() => {
        observer?.observe(ref.current!);

        return () => {
            observer?.disconnect();
        };
    }, [ref, observer]);

    return isIntersecting;
}
