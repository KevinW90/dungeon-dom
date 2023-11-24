<script lang="ts">
	import { addToInventory, attack } from '$lib/core';
	import { calculateAttackPoints, calculateDefensePoints } from '$lib/utils';
	import { createGameObject } from '$lib/factory';
	import { game } from '$lib/stores';
	import type { Character } from '$lib/types';
	import { weapons } from '$lib/weapons';

	let hero: Character, enemies: Character[];
	$: {
		hero = $game.objects?.find((go) => go?.type === 'hero')!;
		enemies = $game.objects?.filter((go) => go?.type === 'enemy');
	}
</script>

<button on:click={() => addToInventory(createGameObject('item', weapons[0]), hero)}
	>Add weapon</button
>
{#if hero}
	<div>{hero.id}</div>
	<h1>{hero.name}</h1>
	<h2>HP: {hero.hp}/{hero.maxHp}</h2>
	<h2>ATK: {calculateAttackPoints(hero)}</h2>
	<h2>DEF: {calculateDefensePoints(hero)}</h2>
	<div>
		Weapon: {hero.weapon?.name}
	</div>
	<div>
		Weapon ID: {hero.weapon?.id}
	</div>
	<button on:click={() => attack(hero, enemies[0])}>Attack</button>
{/if}

{#if enemies.length > 0}
	{#each enemies as enemy}
		<div>{enemy.id}</div>
		<h1>{enemy.name}</h1>
		<h2>HP: {enemy.hp}/{enemy.maxHp}</h2>
		<h2>ATK: {calculateAttackPoints(enemy)}</h2>
		<h2>DEF: {calculateDefensePoints(enemy)}</h2>
		<button on:click={() => attack(enemy, hero)}>Attack</button>
	{/each}
{:else}
	<h1>Loading...</h1>
{/if}

<a href="/inventory">inventory</a>
