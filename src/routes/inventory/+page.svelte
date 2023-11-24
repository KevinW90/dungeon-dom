<script lang="ts">
	import { game } from '$lib/stores';

	$: inventory = $game.objects.find((go) => go.type === 'hero')!.inventory;
</script>

<div class="container">
	<div class="inventory">
		{#each inventory as item}
			<div class="inventory-slot"></div>
		{/each}
	</div>
</div>

<a href="/">Back</a>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.inventory {
		display: grid;
		grid-template-columns: repeat(3, 75px);
		grid-template-rows: repeat(4, 75px);
		place-items: center;
		gap: 1rem;
	}

	.inventory-slot {
		width: 100%;
		height: 100%;
		border-radius: 1rem;
		background-color: green;

		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
