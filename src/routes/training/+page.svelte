<script lang="ts">
	import Tracking from '#lib/components/Tracking.svelte';
	import Zooming from '#lib/components/Zooming.svelte';
	import { fade } from 'svelte/transition';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const tabs = ['sunlight', 'tracking', 'zooming'] as const;
	let tab = $state<(typeof tabs)[number]>('sunlight');
	let sunlight = $state(false);
	let fading = $state(false);

	const FADE_MS = 600;

	// Fade out the sunlight tab, then fade in tracking
	function sunlightDone() {
		if (!sunlight) return;
		fading = true;
		setTimeout(() => {
			tab = 'tracking';
			fading = false;
		}, FADE_MS);
	}
</script>

<div class="page">
	<nav>
		<a href="/">home</a>
		{#each tabs as t}
			<button class:active={tab === t} onclick={() => (tab = t)}>{t}</button>
		{/each}
	</nav>

	{#key tab}
		<div class="content" class:fading style:--fade="{FADE_MS}ms" in:fade={{ duration: FADE_MS }}>
			{#if tab === 'sunlight'}
				<label class="sunlight">
					<input type="checkbox" bind:checked={sunlight} onchange={sunlightDone} />
					Get sunlight
				</label>
			{:else if tab === 'tracking'}
				<Tracking settings={data.settings} onDone={() => (tab = 'zooming')} />
			{:else}
				<Zooming settings={data.settings} />
			{/if}
		</div>
	{/key}
</div>

<style>
	.page {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	nav {
		display: flex;
		justify-content: center;
		gap: 3rem;
		padding: 1rem;
		font-size: 1.3rem;
		letter-spacing: 0.4rem;
	}

	nav a {
		position: absolute;
		left: 2rem;
		color: var(--muted);
		text-decoration: none;
	}

	nav button {
		background: none;
		border: none;
		border-bottom: solid 2px transparent;
		color: var(--muted);
		font-size: inherit;
		letter-spacing: inherit;
		cursor: pointer;
	}

	nav button.active {
		color: var(--text);
		border-bottom-color: var(--text);
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		transition: opacity var(--fade);
	}

	.content.fading {
		opacity: 0;
	}

	.sunlight {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1.5rem;
		font-size: 3rem;
		letter-spacing: 0.5rem;
		cursor: pointer;
	}

	.sunlight input {
		width: 3rem;
		height: 3rem;
		accent-color: white;
	}
</style>
