<script lang="ts">
	import { addToInventory, attack, unequip } from '$lib/core';
	import { calculateAttackPoints, calculateDefensePoints } from '$lib/utils';
	import { createGameObject } from '$lib/factory';
	import { game } from '$lib/stores';
	import type { Character } from '$lib/types';
	import { weapons } from '$lib/items/weapons';
	import { armors } from '$lib/items/armors';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	let hero: Character, enemies: Character[];
	$: {
		hero = $game.objects?.find((go) => go?.type === 'hero')!;
		enemies = $game.objects?.filter((go) => go?.type === 'enemy');
	}

	// game map is a 5x5 tile grid
	// gutter on sides is 3/4 tile width
	let screenSize = { width: 0, height: 0 };
	let tileWidth = 0;
	let gutterSize = 0;

	// Update screen size and calculate tile width and gutter size on mount
	onMount(() => {
		updateScreenSize();
		calculateSizes();
		// Update screen size on resize
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	// Function to update screen size
	function updateScreenSize() {
		screenSize = {
			width: window.innerWidth,
			height: window.innerHeight
		};
		console.log(screenSize);
	}

	// Function to calculate tile width and gutter size
	function calculateSizes() {
		tileWidth = (screenSize.width - 4) / 6.5; // 7 columns (5 tiles + 2(.75) gutters)
		gutterSize = tileWidth * 0.75;
		console.log('tileWidth', tileWidth);
		console.log('gutter', gutterSize);

		console.log('total', tileWidth * 5 + 2 * gutterSize);
	}

	function handleResize() {
		updateScreenSize();
		calculateSizes();
	}

	// tiles
	let tiles = new Array(25);
	tiles[5] = createGameObject('character', {
		type: 'enemy',
		name: 'goblin',
		hp: 3,
		maxHp: 3
	});
	tiles[3] = createGameObject('character', {
		type: 'enemy',
		name: 'goblin',
		hp: 3,
		maxHp: 3
	});
	tiles[22] = createGameObject('character', {
		type: 'enemy',
		name: 'goblin',
		hp: 3,
		maxHp: 3
	});
</script>

<div id="game-screen">
	<div class="container" style="--gutter: {gutterSize}px">
		<div id="top-bar">
			<div class="left">
				<div class="gold-count">
					<Icon icon="akar-icons:coin" class="gold" />
					<span>42</span>
				</div>
				<div class="key-count">
					<Icon icon="solar:key-bold" class="gold" />
					<span>03</span>
				</div>
			</div>
			<div class="right">
				<div class="level-count">room 7</div>
				<div class="settings">
					<Icon icon="solar:settings-bold" />
				</div>
			</div>
		</div>

		<div id="game-map" style="--t-width: {tileWidth}px;">
			{#each tiles as tile}
				<div class="tile">
					{#if tile?.type === 'enemy'}
						<img src="/enemies/Goblin_Idle_000.png" alt="enemy" />
						<div class="stats">
							<div class="hp">
								<Icon icon="solar:heart-bold" />
								<span>{tile.hp}</span>
							</div>
							<div class="atk">
								<Icon icon="mingcute:sword-fill" />
								<span>{calculateAttackPoints(tile)}</span>
							</div>
							<div class="def">
								<Icon icon="ic:round-shield" />
								<span>{calculateDefensePoints(tile)}</span>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<div id="player-options">
			<div class="option">
				<Icon icon="game-icons:backpack" />
			</div>
			<div class="option">
				<Icon icon="solar:heart-bold" />
				<span>10</span>
			</div>
			<div class="option">
				<Icon icon="mingcute:sword-fill" />
				<span>1</span>
			</div>
			<div class="option">
				<Icon icon="ic:round-shield" />
				<span>0</span>
			</div>
			<div class="option">
				<Icon icon="ic:round-question-mark" />
			</div>
		</div>
	</div>
</div>

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

<style lang="scss">
	@import '../global.scss';

	.container {
		display: flex;
		flex-direction: column;
		// align-items: center;
		// justify-content: center;
		gap: 2rem;
		height: 100vh;
		width: 100vw;
		background-color: $color-dark-dark;
		color: #fff;
		padding: 0 var(--gutter);
	}

	#top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;

		background-color: $color-dark;
		border: 3px solid $color-dark-lite;
		border-top: none;
		border-radius: 0 0 0.5rem 0.5rem;

		.left,
		.right {
			display: flex;
			gap: 1rem;

			> div {
				display: flex;
				align-items: center;
				gap: 0.5rem;
			}
		}

		.left {
			padding: 1rem 0 1rem 1rem;
		}

		.right {
			padding: 1rem 1rem 1rem 0;
		}

		.gold-count,
		.key-count {
			color: $color-gold-lite;

			span {
				color: white;
			}
		}
	}

	#game-map {
		width: 100%;

		display: grid;
		grid-template-columns: repeat(5, var(--t-width));
		grid-template-rows: repeat(5, var(--t-width));
		gap: 1px;

		.tile {
			position: relative;
			border-radius: 1rem;
			&:nth-child(even) {
				background-color: $color-dark-lite;
			}

			&:nth-child(odd) {
				background-color: $color-dark;
			}

			img {
				width: 175%;
				height: 175%;
				object-fit: contain;

				translate: -30% -30%;
			}

			.stats {
				position: absolute;
				top: 0;
				right: 0;
				z-index: 1;

				scale: 0.5;
				translate: 0.5rem -0.5rem;

				> div {
					display: flex;
					align-items: center;
					gap: 0.5rem;
				}
			}
		}
	}

	#player-options {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	.option {
		display: flex;
		color: #fff;
	}

	:global(.option:first-child .iconify, .option:last-child .iconify) {
		font-size: 3rem;
	}

	@media screen and (min-width: 550px) {
		#game-map {
			.tile {
				.stats {
					scale: 0.75;
					translate: 0 25%;
				}
			}
		}
	}
</style>
