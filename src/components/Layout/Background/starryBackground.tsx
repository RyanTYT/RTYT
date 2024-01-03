'use client'
import React from "react";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import styles from "@/components/Layout/Background/starryBackground.module.css";

export default function StarryBackground({
	numParticles,
	uniqueID,
}: {
	numParticles: number;
	uniqueID: string;
}) {
	const [init, setInit] = useState(false);

	// this should be run only once per application lifetime
	useEffect(() => {
		initParticlesEngine(async (engine) => {
			// you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
			// this loads the tsparticles package bundle, it's the easiest method for getting everything ready
			// starting from v2 you can add only the features you need reducing the bundle size
			// await loadAll(engine);
			// await loadFull(engine);
			await loadSlim(engine);
			// await loadBasic(engine);
		}).then(() => {
			setInit(true);
		});
	}, []);

	const options = {
		name: "Starry Background",
		fullScreen: false,
		interactivity: {
			detectsOn: "window",
			events: {
				onClick: {
					enable: false,
					mode: "push",
				},
				onDiv: {
					elementId: "repulse-div",
					enable: false,
					mode: "repulse",
				},
				onHover: {
					enable: true,
					mode: "bubble",
					parallax: {
						enable: false,
						force: 2,
						smooth: 10,
					},
				},
			},
			modes: {
				bubble: {
					distance: 40,
					duration: 2,
					opacity: 8,
					size: 6,
				},
				connect: {
					distance: 80,
					links: {
						opacity: 0.5,
					},
					radius: 60,
				},
				grab: {
					distance: 400,
					links: {
						opacity: 1,
					},
				},
				push: {
					quantity: 4,
				},
				remove: {
					quantity: 2,
				},
				repulse: {
					distance: 200,
					duration: 0.4,
				},
				slow: {
					active: false,
					radius: 0,
					factor: 1,
				},
			},
		},
		particles: {
			color: {
				value: "#ffffff",
			},
			move: {
				enable: true,
				outModes: "bounce",
				speed: 0.3,
			},
			number: {
				limit: 500,
				value: numParticles,
			},
			opacity: {
				animation: {
					enable: true,
					speed: 2,
					sync: false,
				},
				value: {
					min: 0.05,
					max: 0.4,
				},
			},
			shape: {
				type: "circle",
			},
			size: {
				value: 1.2,
			},
		},
		background: {
			color: "161616",
			image: "",
			position: "50% 50%",
			repeat: "repeat",
			size: "cover",
		},
	} as ISourceOptions;

	if (init) {
		return (
			<div className={styles.background}>
				<Particles
					className={styles.particles_background}
					options={options}
					id={uniqueID}
				/>
			</div>
		);
	}
	return <></>;
}
