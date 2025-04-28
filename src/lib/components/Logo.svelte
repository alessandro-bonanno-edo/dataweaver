<script lang="ts">
	import { gsap } from 'gsap';
	import MotionPathPlugin from 'gsap/dist/MotionPathPlugin';

	gsap.registerPlugin(MotionPathPlugin);

	const PARTICLE_COUNT = 30;
	const STAR_COUNT = 100; // Maybe more stars for wider view?

	let particles: SVGElement[] = [];
	let stars: SVGCircleElement[] = [];
	let shadowTextEl: SVGTextElement | null = null; // Or initialize as undefined

	// Path IDs remain the same
	const weavePaths = ['#line1', '#line2', '#line3', '#line4'];

	function random(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}

	// $effect containing all animations (Path drawing, particle motion, stars, text)
	$effect(() => {
		console.log('Effect running...');
		// --- Path Drawing Animation ---
		const pathElements = weavePaths
			.map((selector) => document.querySelector(selector) as SVGPathElement | null)
			.filter(Boolean);
		if (pathElements.length > 0) {
			pathElements.forEach((path, index) => {
				const length = path!.getTotalLength();
				if (length > 0) {
					gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
					gsap.to(path, {
						strokeDashoffset: 0,
						duration: random(2, 4),
						delay: random(0, 1),
						ease: 'power2.inOut'
					});
				} else {
					console.warn(`Path ${path!.id} has zero length.`);
				}
			});
		} else {
			console.warn('No valid path elements for drawing animation.');
		}

		// --- Particle Animation (Revised Positioning) ---
		if (particles.length > 0) {
			particles.forEach((particle, i) => {
				const randomPathSelector = weavePaths[Math.floor(Math.random() * weavePaths.length)];
				const randomDuration = random(6, 14);
				const eases = ['none', 'sine.inOut', 'power1.inOut', 'power2.in', 'power2.out'];
				const randomEase = eases[Math.floor(Math.random() * eases.length)];
				const randomDelay = random(0, 2);

				gsap.set(particle, {
					// Position Instantly
					opacity: 1,
					motionPath: {
						path: randomPathSelector,
						align: 'auto',
						alignOrigin: [0.5, 0.5],
						autoRotate: true
					}
				});
				gsap.to(particle, {
					// Animate Movement
					motionPath: {
						path: randomPathSelector,
						align: 'auto',
						alignOrigin: [0.5, 0.5],
						autoRotate: true
					},
					duration: randomDuration,
					ease: randomEase,
					repeat: -1,
					delay: randomDelay
				});
				gsap.to(particle, {
					// Pulse
					attr: { r: random(0.8, 2.5) },
					duration: random(1.5, 3),
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut',
					delay: randomDelay + 0.5
				});
			});
		} else {
			console.warn('No particle elements found to animate.');
		}

		// --- Star Animation (Twinkling) ---
		if (stars.length > 0) {
			stars.forEach((star, i) => {
				gsap.to(star, {
					opacity: random(0.1, 0.9),
					duration: random(2, 5),
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut',
					delay: random(0, 5)
				});
			});
		} else {
			console.warn('No star elements found to animate.');
		}

		// --- Text Fade-in ---
		const textElement = document.querySelector('#logo-text');
		if (textElement) {
			gsap.fromTo(textElement, { opacity: 0 }, { opacity: 1, duration: 2, delay: 1.5 });
		}

		// --- Moving Rainbow Text Shadow Animation ---
		const shadowTarget = shadowTextEl ?? document.querySelector('#logo-text-shadow');
		if (shadowTarget) {
			console.log('Animating rainbow text shadow...');
			// Animate position
			gsap.to(shadowTarget, {
				x: '+=4', // Slightly increased offset X
				y: '+=4', // Slightly increased offset Y
				duration: 4, // Maybe slow it down a bit
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut'
			});

			// Animate fill color through hues
			gsap.to(shadowTarget, {
				fill: 'hsl(+=360, 100%, 60%)', // Cycle hue (+=360), keep saturation high, adjust lightness (60%?)
				duration: 10, // How long a full rainbow cycle takes
				repeat: -1,
				ease: 'none' // Linear transition through colors
			});
		} else {
			console.warn('Shadow text element not found for animation.');
		}
	}); // End of $effect
</script>

<svg
	viewBox="0 0 1200 600"
	width="100%"
	preserveAspectRatio="xMidYMid slice"
	xmlns="http://www.w3.org/2000/svg"
>
	<defs>
		<radialGradient id="bgGradient" cx="50%" cy="50%" r="60%">
			<stop offset="0%" stop-color="#0b0c2a" />
			<stop offset="100%" stop-color="#050510" />
		</radialGradient>
		<linearGradient id="weaveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
			<stop offset="0%" stop-color="#33faff" stop-opacity="1" />
			<stop offset="50%" stop-color="#e600ff" stop-opacity="0.8" />
			<stop offset="100%" stop-color="#5f00ff" stop-opacity="1" />
		</linearGradient>
		<filter id="glow">
			<feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
			<feMerge>
				<feMergeNode in="coloredBlur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<filter id="shadow-blur">
			<feGaussianBlur stdDeviation="1.5" />
		</filter>
	</defs>

	<rect width="1200" height="600" fill="url(#bgGradient)" />

	<g id="stars">
		{#each Array(STAR_COUNT) as _, i}
			<circle
				cx={random(0, 1200)}
				cy={random(0, 600)}
				r={random(0.4, 1.8)}
				fill="white"
				opacity="0.3"
				bind:this={stars[i]}
			/>
		{/each}
	</g>

	<g id="logo-group" transform="translate(300, 300) scale(1.1)">
		<g id="weaving-paths" fill="none" stroke="url(#weaveGradient)" stroke-width="1.5">
			<path id="line1" d="M0,0 C-100,-300 100,-300 0,0 C-100,300 100,300 0,0" />
			<path id="line2" d="M0,0 C-300,-100 -300,100 0,0 C300,-100 300,100 0,0" stroke-width="1" />
			<path id="line3" d="M0,0 C-150,-150 150,-150 0,0 C-150,150 150,150 0,0" />
			<path id="line4" d="M0,0 C-200,-50 -200,50 0,0 C200,-50 200,50 0,0" stroke-width="2" />
		</g>

		<g id="particles" filter="url(#glow)">
			{#each Array(PARTICLE_COUNT) as _, i}
				<circle r="1.5" fill="url(#weaveGradient)" bind:this={particles[i]} />
			{/each}
		</g>
	</g>

	<text
		id="logo-text-shadow"
		bind:this={shadowTextEl}
		x="750"
		y="300"
		dominant-baseline="middle"
		text-anchor="middle"
		fill="hsl(0, 100%, 60%)"
		opacity="0.7"
		font-size="64"
		font-family="Arial, Helvetica, sans-serif"
		font-weight="bold"
		letter-spacing="1"
		filter="url(#shadow-blur)"
	>
		DataWeaver
	</text>

	<text
		id="logo-text"
		x="750"
		y="300"
		dominant-baseline="middle"
		text-anchor="middle"
		fill="#f0f0f0"
		font-size="64"
		font-family="Arial, Helvetica, sans-serif"
		font-weight="bold"
		letter-spacing="1"
		filter="url(#glow)"
	>
		DataWeaver
	</text>
</svg>

<style>
	svg {
		display: block;
		width: 100%; /* Already set, but good to confirm */
		height: 125px; /* Set the desired fixed height */
		background-color: #050510; /* Or your background */
		overflow: hidden; /* Hide parts cropped by 'slice' if needed */
	}
</style>
