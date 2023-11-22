<script lang="ts">
	import { create } from '$lib/factory';
	import { game } from '$lib/stores';
	import { onMount } from 'svelte';

	function takeDamage(entity: any, damage: number) {
		const newPlayerStats = {
			...entity,
			hp: entity.hp - damage
		};

		game.update((g) => {
			return {
				...g,
				player: newPlayerStats
			};
		});
	}

	onMount(() => {
		// create a player object
		create('player', {
			name: 'Player',
			hp: 10,
			maxHp: 10,
			atk: 1,
			def: 1
		});
	});
</script>

<!-- display all the player's stats -->
<h1>{$game.player.name}</h1>
<p>HP: {$game.player.hp}/{$game.player.maxHp}</p>
<p>ATK: {$game.player.atk}</p>
<p>DEF: {$game.player.def}</p>

<button on:click={() => takeDamage($game.player, 1)}>Attack Player</button>
