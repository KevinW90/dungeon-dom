// factories that allow the generation of game objects like player, enemy, etc.
import type { Character, Item, Room, Tile } from './types';
import * as utils from '$lib/utils';

export function createCharacter(options: any = {}): Character {
	return {
		id: utils.uuid(),
		...options
	};
}

export function createItem(options: any): Item {
	return {
		id: utils.uuid(),
		...options
	};
}
