<script lang="ts">
	import { equip } from '$lib/core';
	import { game } from '$lib/stores';

	$: inventory = $game.objects.find((go) => go.type === 'hero')!.inventory;
	$: hero = $game.objects.find((go) => go.type === 'hero')!;
</script>

<div class="container">
	<div class="inventory">
		{#each inventory as item}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="inventory-slot" on:click={() => equip(item, hero)}>
				{item?.name || ''}
			</div>
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
