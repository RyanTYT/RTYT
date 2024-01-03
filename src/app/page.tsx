"use client";
import AboutMe from "@/components/Home/AboutMe";
import OtherPages from "@/components/Home/OtherPages";
import Welcome from "@/components/Home/Welcome";
import { scroller, Element as ReactScrollElement } from "react-scroll";
import React, { useRef } from "react";
import useScrollOnChange from "@/hooks/useScrollOnChange";

export default function Home() {
	const firstElem = useRef(null);
	const secElem = useRef(null);

	useScrollOnChange(firstElem, "first-section", scroller);
	useScrollOnChange(secElem, "second-section", scroller);

	return (
		<>
			<div ref={firstElem}>
				<ReactScrollElement name="first-section">
					<Welcome />
				</ReactScrollElement>
			</div>
			<div ref={secElem}>
				<ReactScrollElement name="second-section">
					<AboutMe />
					<OtherPages />
				</ReactScrollElement>
			</div>
		</>
	);
}
