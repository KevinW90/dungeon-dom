<script lang="ts">
	import { addToInventory, attack, calculateDefensePoints, equip } from '$lib/core';
	import { game } from '$lib/stores';
	import type { Character } from '$lib/types';
	import { weapons } from '$lib/weapons';

	let hero: Character, enemies: Character[];
	$: {
		hero = $game.objects?.find((go) => go?.type === 'hero')!;
		enemies = $game.objects?.filter((go) => go?.type === 'enemy');
	}
</script>

<button on:click={() => addToInventory(weapons.basicSword, hero)}>Add Basic Sword</button>
<button on:click={() => addToInventory(weapons.stick, hero)}>Add Stick</button>
{#if hero}
	<div>{hero.id}</div>
	<h1>{hero.name}</h1>
	<h2>HP: {hero.hp}/{hero.maxHp}</h2>
	<h2>ATK: {hero.weapon.damage}</h2>
	<h2>DEF: {calculateDefensePoints(hero)}</h2>
	<button on:click={() => attack(hero, enemies[0])}>Attack</button>
{/if}

{#if enemies.length > 0}
	{#each enemies as enemy}
		<div>{enemy.id}</div>
		<h1>{enemy.name}</h1>
		<h2>HP: {enemy.hp}/{enemy.maxHp}</h2>
		<h2>ATK: {enemy.weapon.damage}</h2>
		<h2>DEF: {calculateDefensePoints(enemy)}</h2>
		<button on:click={() => attack(enemy, hero)}>Attack</button>
	{/each}
{:else}
	<h1>Loading...</h1>
{/if}

<a href="/inventory">inventory</a>
