<script lang="ts">
	import { createEnemy, createHero } from '$lib/factory';
	import { game } from '$lib/stores';
	import type { Hero, Enemy } from '$lib/types';
	import { onMount } from 'svelte';

	function takeDamage<T extends Hero | Enemy>(entity: T, damage: number) {
		const e = $game.entities.find((e) => e.id === entity.id);

		if (!e) {
			return console.error('Entity not found');
		}

		const newEntityStats: Hero | Enemy = {
			...e,
			hp: e!.hp - damage
		};
		game.update((g) => {
			return {
				...g,
				entities: [...g.entities.filter((e) => e.id !== entity.id), newEntityStats]
			};
		});
	}

	function attack(attacker: any, defender: any) {
		console.log('attacker', attacker);
		console.log('defender', defender);
		const damage = Math.max(1, attacker.atk - defender.def);
		console.log('damage', damage);
		takeDamage(defender, damage);
	}

	let hero: Hero;
	let enemies: Enemy[];
	onMount(() => {
		// create a player object
		createHero('warrior', {
			name: 'Warrior Hero',
			hp: 10,
			maxHp: 10,
			atk: 1,
			def: 1
		});
		// create a monster object
		createEnemy('skeleton', {
			name: 'Skeleton',
			hp: 5,
			maxHp: 5,
			atk: 1,
			def: 0
		});
	});

	$: {
		hero = $game.entities.find((e) => e.type === 'hero') as Hero;
		enemies = $game.entities.filter((e) => e.type === 'enemy') as Enemy[];
	}
</script>

{#if hero && enemies.length > 0}
	<h1>{hero.name}</h1>
	<h2>HP: {hero.hp}/{hero.maxHp}</h2>
	<h2>ATK: {hero.atk}</h2>
	<h2>DEF: {hero.def}</h2>
	<button on:click={() => attack(hero, enemies[0])}>Attack</button>

	{#each enemies as enemy}
		<h1>{enemy.name}</h1>
		<h2>HP: {enemy.hp}/{enemy.maxHp}</h2>
		<h2>ATK: {enemy.atk}</h2>
		<h2>DEF: {enemy.def}</h2>
		<button on:click={() => attack(enemy, hero)}>Attack</button>
	{/each}
{:else}
	<h1>Loading...</h1>
{/if}
