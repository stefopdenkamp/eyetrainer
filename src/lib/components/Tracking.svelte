<script lang="ts">
	import { untrack } from 'svelte';
	import Countdown from '#lib/components/Countdown.svelte';
	import type { Settings } from '#lib/server/db/schema.ts';

	let { settings, onDone }: { settings: Settings; onDone: () => void } = $props();

	const BALL = 40;
	const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
	const JITTER = Math.PI / 8; // max random turn on a wall bounce
	const MIN_WALL_ANGLE = Math.PI / 12; // never leave a wall flatter than this

	let phase = $state<'moving' | 'flashing'>('moving');
	// svelte-ignore state_referenced_locally
	let remaining = $state(settings.moveSeconds);
	let width = $state(0);
	let height = $state(0);
	let x = $state(0);
	let y = $state(0);
	let visible = $state(true);
	let letter = $state('');

	// Countdown: moving -> flashing -> done
	$effect(() => {
		const timer = setInterval(() => {
			remaining -= 1;
			if (remaining > 0) return;
			if (phase === 'moving') {
				phase = 'flashing';
				remaining = settings.flashSeconds;
			} else {
				onDone();
			}
		}, 1000);
		return () => clearInterval(timer);
	});

	// Moving: ball bounces off the walls of the box
	$effect(() => {
		if (phase !== 'moving') return;
		const angle = Math.random() * 2 * Math.PI;
		let vx = Math.cos(angle) * settings.ballSpeed;
		let vy = Math.sin(angle) * settings.ballSpeed;
		untrack(() => {
			x = (width - BALL) / 2;
			y = (height - BALL) / 2;
			visible = true;
		});

		// Reflect off a wall (n = unit normal pointing into the box), turned by a random angle
		const bounce = (nx: number, ny: number) => {
			const [tx, ty] = [-ny, nx];
			const max = Math.PI / 2 - MIN_WALL_ANGLE;
			const reflected = Math.atan2(vx * tx + vy * ty, Math.abs(vx * nx + vy * ny));
			const a = Math.max(-max, Math.min(max, reflected + (Math.random() * 2 - 1) * JITTER));
			vx = settings.ballSpeed * (nx * Math.cos(a) + tx * Math.sin(a));
			vy = settings.ballSpeed * (ny * Math.cos(a) + ty * Math.sin(a));
		};

		let last = performance.now();
		let frame = requestAnimationFrame(function step(now) {
			const dt = (now - last) / 1000;
			last = now;
			x += vx * dt;
			y += vy * dt;
			if (x < 0) {
				x = 0;
				bounce(1, 0);
			}
			if (x > width - BALL) {
				x = width - BALL;
				bounce(-1, 0);
			}
			if (y < 0) {
				y = 0;
				bounce(0, 1);
			}
			if (y > height - BALL) {
				y = height - BALL;
				bounce(0, -1);
			}
			frame = requestAnimationFrame(step);
		});
		return () => cancelAnimationFrame(frame);
	});

	// Flashing: ball appears at random spots, not too close to the previous one
	$effect(() => {
		if (phase !== 'flashing') return;
		let timeout: ReturnType<typeof setTimeout>;

		const show = () => {
			const minDistance = Math.min(width, height) / 3;
			let nx, ny;
			let tries = 0;
			do {
				nx = Math.random() * (width - BALL);
				ny = Math.random() * (height - BALL);
			} while (Math.hypot(nx - x, ny - y) < minDistance && ++tries < 50);
			[x, y] = [nx, ny];
			letter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
			visible = true;
			timeout = setTimeout(hide, settings.flashShowMs);
		};
		const hide = () => {
			visible = false;
			timeout = setTimeout(show, settings.flashPauseMs);
		};

		visible = false;
		timeout = setTimeout(show, settings.flashPauseMs);
		return () => clearTimeout(timeout);
	});
</script>

<div class="tracking">
	<div class="timer">
		{#key phase}
			<Countdown {remaining} seconds={phase === 'moving' ? settings.moveSeconds : settings.flashSeconds} />
		{/key}
	</div>
	<div class="box" bind:clientWidth={width} bind:clientHeight={height}>
		{#if visible}
			<div class="ball" style:width="{BALL}px" style:height="{BALL}px" style:translate="{x}px {y}px">
				{#if phase === 'flashing'}{letter}{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.tracking {
		flex: 1;
		position: relative;
		display: flex;
		flex-direction: column;
		padding: calc(70px + 1rem) 1rem 1rem;
	}

	/* same spot as the zooming timer */
	.timer {
		position: absolute;
		top: 0;
		right: 3rem;
	}

	.box {
		flex: 1;
		position: relative;
		border: solid white 3px;
		overflow: hidden;
	}

	.ball {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		background: var(--text);
		color: black;
		font-size: 1.4rem;
		line-height: 1;
	}
</style>
