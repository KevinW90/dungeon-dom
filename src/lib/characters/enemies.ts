import { game } from '$lib/stores';
import type { Character } from '$lib/types';
import { get, writable, type Writable } from 'svelte/store';

export const goblin = {
	name: 'Goblin',
	type: 'enemy',
	hp: 3,
	maxHp: 3,
	inventory: new Array(6).fill(null),
	weapon: null,
	armor: {
		head: null,
		chest: null,
		legs: null,
		feet: null,
		hands: null
	}
};

export function findAllEnemies(): Character[] {
	return get(game)
		.room.tiles.filter((tile) => tile.content?.type === 'enemy')
		.map((tile) => tile.content);
}
