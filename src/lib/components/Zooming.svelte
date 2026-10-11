<script lang="ts">
	import Countdown from '#lib/components/Countdown.svelte';
	import type { Settings } from '#lib/server/db/schema.ts';

	let { settings }: { settings: Settings } = $props();

	const MAX_FONT = 130;
	const MIN_FONT = 12;
	const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

	const randomSequence = () =>
		Array.from({ length: settings.zoomLetters }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join(' ');

	// Every row gets its own random sequence
	const randomRows = () => Array.from({ length: settings.zoomRows }, randomSequence);

	let rows = $state(randomRows());
	// svelte-ignore state_referenced_locally
	let remaining = $state(settings.zoomRefreshSeconds);
	let round = $state(0);

	// Font size per row, shrinking geometrically from MAX_FONT to MIN_FONT
	const sizes = $derived.by(() => {
		const rows = settings.zoomRows;
		const ratio = rows > 1 ? (MIN_FONT / MAX_FONT) ** (1 / (rows - 1)) : 1;
		return Array.from({ length: rows }, (_, i) => MAX_FONT * ratio ** i);
	});

	$effect(() => {
		const timer = setInterval(() => {
			remaining -= 1;
			if (remaining > 0) return;
			rows = randomRows();
			remaining = settings.zoomRefreshSeconds;
			round += 1;
		}, 1000);
		return () => clearInterval(timer);
	});
</script>

<div class="zooming">
	<div class="counter">
		{#key round}
			<Countdown {remaining} seconds={settings.zoomRefreshSeconds} />
		{/key}
	</div>

	<div class="chart">
		{#each sizes as size, i}
			<div class="row" class:line={i + 1 === settings.zoomMarkerRow} style:font-size="{size}px">
				{rows[i]}
			</div>
		{/each}
	</div>
</div>

<style>
	.zooming {
		flex: 1;
		position: relative;
		display: flex;
	}

	.chart {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-bottom: 2vh;
	}

	.row {
		width: 70%;
		margin: auto;
		text-align: center;
		line-height: 1;
		white-space: nowrap;
	}

	/* ----- marker line ----- */
	.line::before,
	.line::after {
		content: '';
		display: inline-block;
		margin: 0 2rem;
		vertical-align: middle;
		width: 20vw;
		height: 3px;
		border-top: solid 2px white;
		border-bottom: solid 2px white;
	}

	.counter {
		position: absolute;
		top: 0;
		right: 3rem;
	}
</style>
