<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// svelte-ignore state_referenced_locally
	let form = $state({ ...data.settings });
	let message = $state('');

	const sections = [
		{
			title: 'Tracking – moving',
			fields: [
				{ key: 'moveSeconds', label: 'Duration (seconds)' },
				{ key: 'ballSpeed', label: 'Ball speed (pixels per second)' }
			]
		},
		{
			title: 'Tracking – flashing',
			fields: [
				{ key: 'flashSeconds', label: 'Duration (seconds)' },
				{ key: 'flashShowMs', label: 'Ball visible (milliseconds)' },
				{ key: 'flashPauseMs', label: 'Pause between flashes (milliseconds)' }
			]
		},
		{
			title: 'Zooming',
			fields: [
				{ key: 'zoomRefreshSeconds', label: 'Time to refresh (seconds)' },
				{ key: 'zoomRows', label: 'Number of rows' },
				{ key: 'zoomLetters', label: 'Letters per row' },
				{ key: 'zoomMarkerRow', label: 'Row for marker (0 = none)' }
			]
		}
	] as const;

	async function save(event: SubmitEvent) {
		event.preventDefault();
		const { id, ...body } = form;
		const res = await fetch('/api/settings', {
			method: 'PATCH',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(body)
		});
		message = res.ok ? 'Saved' : (await res.json()).message;
	}
</script>

<main>
	<form onsubmit={save}>
		{#each sections as section}
			<h2>{section.title}</h2>
			{#each section.fields as field}
				<label>
					{field.label}
					<input type="number" min={field.key === 'zoomMarkerRow' ? 0 : 1} max={field.key === 'zoomLetters' ? 12 : undefined} bind:value={form[field.key]} required />
				</label>
			{/each}
		{/each}

		<div class="actions">
			<a href="/">back</a>
			<button type="submit">save</button>
		</div>
		<p class="message">{message}</p>
	</form>
</main>

<style>
	main {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 1rem;
	}

	form {
		width: min(1000px, 80%);
		display: flex;
		flex-direction: column;
		padding: 1.5rem 2rem;
		background: var(--panel);
		border: solid white 3px;
	}

	h2 {
		margin-top: 1rem;
		font-weight: 100;
		letter-spacing: 0.3rem;
		text-align: center;
	}

	label {
		display: flex;
		flex-direction: column;
		margin-top: 0.5rem;
		font-size: larger;
		text-align: center;
	}

	input {
		margin-top: 0.2rem;
		padding: 0.4rem;
	}

	.actions {
		display: flex;
		justify-content: space-between;
		margin-top: 1rem;
		font-size: 1.5rem;
		letter-spacing: 0.5rem;
	}

	.actions a,
	.actions button {
		color: var(--text);
		background: none;
		border: none;
		font-size: inherit;
		letter-spacing: inherit;
		text-decoration: none;
		cursor: pointer;
	}

	.message {
		margin-top: 0.5rem;
		min-height: 1.5rem;
		text-align: center;
	}
</style>
