<script lang="ts">
	// Restart the ring animation by wrapping this component in a {#key} block.
	let { remaining, seconds }: { remaining: number; seconds: number } = $props();
</script>

<div class="counter">
	<p>{remaining}</p>
	<svg viewBox="0 0 100 100">
		<circle r="45" cx="50" cy="50" style:animation-duration="{seconds}s"></circle>
	</svg>
</div>

<style>
	.counter {
		position: relative;
		width: 70px;
		height: 70px;
	}

	p {
		font-size: 1.8rem;
		line-height: 70px;
		text-align: center;
	}

	svg {
		position: absolute;
		inset: 0;
		transform: rotateY(-180deg) rotateZ(-90deg);
	}

	circle {
		stroke-width: 6px;
		stroke: white;
		fill: none;
		stroke-dasharray: 283px;
		animation: countdown linear forwards;
	}

	@keyframes countdown {
		from {
			stroke-dashoffset: 0px;
		}
		to {
			stroke-dashoffset: 283px;
		}
	}
</style>
