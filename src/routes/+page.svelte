<script lang="ts">
	import room, { currentRoom } from '$lib/systems/room';
</script>

<main>
	<h1>{$currentRoom?.id}</h1>
	<button on:click={() => room.new()}>Enter new Room</button>

	{#if $currentRoom}
		<div class="map" style="--width:{$currentRoom.width};--height:{$currentRoom.height}">
			{#each $currentRoom?.tiles as tile}
				<div class="tile">{tile.id}</div>
			{/each}
		</div>
	{/if}
</main>

<style>
	.map {
		display: grid;
		grid-template-columns: repeat(var(--width), 1fr);
		grid-template-rows: repeat(var(--height), 1fr);
	}

	.tile {
		text-align: center;
		border: 1px solid black;
	}

	.tile:nth-child(odd) {
		background-color: #bebebe;
	}

	.tile:nth-child(even) {
		background-color: #646464;
	}
</style>
