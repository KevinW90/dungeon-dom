<script lang="ts">
	import room, { currentRoom } from '$lib/systems/room';
</script>

<main>
	<h1>{$currentRoom?.id}</h1>
	<button on:click={() => room.new()}>Enter new Room</button>
</main>
