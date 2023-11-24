<script lang="ts">
	import { addToInventory, attack, unequip } from '$lib/core';
	import { calculateAttackPoints, calculateDefensePoints } from '$lib/utils';
	import { createGameObject } from '$lib/factory';
	import { game } from '$lib/stores';
	import type { Character } from '$lib/types';
	import { weapons } from '$lib/items/weapons';
	import { armors } from '$lib/items/armors';

	let hero: Character, enemies: Character[];
	$: {
		hero = $game.objects?.find((go) => go?.type === 'hero')!;
		enemies = $game.objects?.filter((go) => go?.type === 'enemy');
	}
</script>

<button on:click={() => addToInventory(createGameObject('item', weapons[0]), hero)}
	>Add weapon</button
>
<button on:click={() => addToInventory(createGameObject('item', armors[0]), hero)}>Add armor</button
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
	{#each Object.entries(hero.armor) as [slot, armor]}
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div on:click={() => unequip(armor, hero)}>
			{slot}: {armor?.name || 'none'}
			{armor?.id ? `| ${armor.id}` : ''}
		</div>
	{/each}

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
