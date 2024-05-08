<script lang="ts">
	import { calculateAttackPoints, calculateDefensePoints } from '$lib/utils';
	import { createGameObject } from '$lib/factory';
	import { game } from '$lib/stores';
	import type { Character } from '$lib/types';
	import { weapons } from '$lib/items/weapons';
	import { armors } from '$lib/items/armors';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { attack } from '$lib/systems/combat';

	let hero: Character, enemies: Character[];
	$: {
		hero = $game.hero;
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

	function handleInteraction(tile: any) {
		console.log(tile);
		if (tile?.content?.type === 'enemy') {
			attack(hero, tile.content);
		}
		// TODO: check for other interactions
		// nothing for now
		else {
			console.log('nothing here');
		}
	}
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
				<div class="level-count">{$game.room.id}</div>
				<div class="settings">
					<Icon icon="solar:settings-bold" />
				</div>
			</div>
		</div>

		<div id="game-map" style="--t-width: {tileWidth}px;">
			{#each $game.room.tiles as tile}
				<button class="tile" on:click={() => handleInteraction(tile)}>
					{#if tile?.content?.type === 'enemy'}
						<img src="/enemies/Goblin_Idle_000.png" alt="enemy" />
						<div class="stats">
							<div class="hp">
								<Icon icon="solar:heart-bold" />
								<span>{tile.content.hp}</span>
							</div>
							<div class="atk">
								<Icon icon="mingcute:sword-fill" />
								<span>{calculateAttackPoints(tile.content)}</span>
							</div>
							<div class="def">
								<Icon icon="ic:round-shield" />
								<span>{calculateDefensePoints(tile.content)}</span>
							</div>
						</div>
					{/if}
				</button>
			{/each}
		</div>

		<div id="player-options">
			<div class="option">
				<a href="/inventory">
					<Icon icon="game-icons:backpack" />
				</a>
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
				<span>{$game.hero.weapon?.name} {$game.hero.weapon?.durability}</span>
				<!-- <Icon icon="ic:round-question-mark" /> -->
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	@import '../global.scss';

	a {
		text-decoration: none;
		color: inherit;
	}

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

			// override button styling
			border: none;
			color: white;

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
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				z-index: 1;

				.hp {
					top: 5px;
					right: 5px;
					translate: 15% -15%;
				}

				.atk {
					bottom: 5px;
					left: 5px;
					translate: -15% 15%;
				}

				.def {
					bottom: 5px;
					right: 5px;
					translate: 15% 15%;
				}

				> div {
					position: absolute;
					display: flex;
					align-items: center;
					scale: 0.5;
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

	@media screen and (min-width: 375px) {
		#game-map {
			.tile {
				.stats {
					> div {
						scale: 0.75;
					}
				}
			}
		}
	}
	@media screen and (min-width: 550px) {
		#game-map {
			.tile {
				.stats {
					> div {
						scale: 1;
					}

					.hp {
						translate: 0% -15%;
					}

					.atk {
						translate: -15% 0%;
					}

					.def {
						translate: 0 0;
					}
				}
			}
		}
	}
</style>
