import { goblin } from '$lib/characters/enemies';
import { createCharacter } from '$lib/factory';
import type { Room, Tile } from '$lib/types';
import * as utils from '$lib/utils';

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
