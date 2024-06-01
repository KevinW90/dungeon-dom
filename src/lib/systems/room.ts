import { goblin } from '$lib/characters/enemies';
import { createCharacter } from '$lib/factory';
import { game } from '$lib/stores';
import type { Room, Tile } from '$lib/types';
import * as utils from '$lib/utils';
import { get } from 'svelte/store';
import { logEvent } from './eventLog';

export function createRoom(enemyCount: number): Room {
	const tiles: Tile[] = Array.from({ length: 25 }, () => ({ content: null }));

	// random enemy tiles
	while (enemyCount > 0) {
		const index = Math.floor(Math.random() * 25);

		if (tiles[index].content) continue;

		tiles[index].content = createCharacter(goblin);
		enemyCount--;
	}

	return {
		id: utils.uuid(),
		tiles
	};
}

export function nextRoom(): void {
	logEvent({
		type: 'info',
		messages: ['You entered a new room. What will you do?']
	});
	// update game state
	const gameCopy = { ...get(game) };
	gameCopy.room = createRoom(1);
	gameCopy.turn = gameCopy.hero;
	game.update((g) => ({ ...g, ...gameCopy }));
}
