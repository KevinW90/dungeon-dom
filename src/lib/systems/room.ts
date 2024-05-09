import { goblin } from '$lib/characters/enemies';
import { createGameObject } from '$lib/factory';
import type { Room, Tile } from '$lib/types';
import * as utils from '$lib/utils';

export function createRoom(enemyCount: number): Room {
	const tiles: Tile[] = Array.from({ length: 25 }, () => ({ content: null }));

	// random enemy tiles
	while (enemyCount > 0) {
		const index = Math.floor(Math.random() * 25);

		if (tiles[index].content) continue;

		tiles[index].content = createGameObject('character', goblin);
		enemyCount--;
	}

	return {
		id: utils.uuid(),
		tiles
	};
}
