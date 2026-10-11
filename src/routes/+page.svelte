<script lang="ts">
	import SettingsIcon from '#lib/components/SettingsIcon.svelte';
</script>

<a class="settings-button" href="/settings" aria-label="Settings"><SettingsIcon /></a>

<main>
	<a class="start-button" href="/training">start</a>
</main>

<style>
	main {
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.start-button {
		color: var(--text);
		text-decoration: none;
		letter-spacing: 1.8rem;
		font-size: 3.5rem;
		font-weight: 100;
	}

	.settings-button {
		position: absolute;
		top: 3rem;
		right: 3rem;
		width: 70px;
		height: 70px;
		fill: var(--muted);
		transition: fill 0.3s;
	}

	.settings-button:hover {
		fill: white;
	}
</style>
