<script lang="ts">
	import room, { currentRoom } from '$lib/systems/room';
</script>

<main>
	<div class="extra">
		<h1>{$currentRoom?.id ?? 'No current room'}</h1>
		<button on:click={() => room.new()}>Enter new Room</button>
	</div>

	{#if $currentRoom}
		<div class="map" style="--width:{$currentRoom.width};--height:{$currentRoom.height}">
			{#each $currentRoom?.tiles as tile}
				<div class="tile">{tile.id}</div>
			{/each}
		</div>
	{/if}
</main>

<style>
	.extra {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		background-color: #f1f1f1;
	}
	main {
		width: 100vw;
		height: 100vh;
	}

	.map {
		width: 100%;
		height: 100%;

		display: grid;
		grid-template-columns: repeat(var(--width), 3rem);
		grid-template-rows: repeat(var(--height), 3rem);
		justify-content: center;
		align-content: center;
	}

	.tile {
		width: 3rem;
		height: 3rem;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.tile:nth-child(odd) {
		background-color: #bebebe;
	}

	.tile:nth-child(even) {
		background-color: #646464;
	}
</style>
