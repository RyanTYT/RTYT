"use client";
import { RefObject, useEffect, useMemo, useState } from "react";
import { scroller } from "react-scroll";

export default function useScrollOnChange(
    ref: RefObject<HTMLElement>,
    element_name: string,
    windowScroller: typeof scroller
) {
    const [, setIsIntersecting] = useState(false);

    const observer = useMemo(
        () =>
            typeof IntersectionObserver !== "undefined"
                ? new IntersectionObserver(([entry]) => {
                    if (entry.isIntersecting) {
                        document.body.style.overflow = "hidden";
                        windowScroller.scrollTo(element_name, {
                            duration: 500,
                            smooth: true,
                            isDynamic: true,
                        });
                        document.body.style.overflow = "scroll";
                    }
                    setIsIntersecting(entry.isIntersecting);
                })
                : null,
        []
    );

    useEffect(() => {
        observer?.observe(ref.current!);

        return () => {
            observer?.disconnect();
        };
    }, [ref, observer]);

    return;
}
