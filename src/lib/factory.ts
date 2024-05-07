// factories that allow the generation of game objects like player, enemy, etc.
import type { Character, Item, Room, Tile } from './types';
import * as utils from '$lib/utils';
import { BASIC_WEAPONS } from './items/weapons';
import { goblin } from './characters/enemies';

function _createCharacter(options: any = {}): Character {
	return {
		id: utils.uuid(),
		...options
	};
}

function _createItem(options: any): Item {
	return {
		id: utils.uuid(),
		...options
	};
}

export function createGameObject(what: string, options: any) {
	let go: any;
	switch (what) {
		case 'character':
			go = _createCharacter({ ...options });
			break;
		case 'item':
			go = _createItem(options);
			break;
		default:
			throw new Error(`Unknown game object type: ${what}`);
	}

	return go;
}

function createRoom(): Room {
	const tiles: Tile[] = Array.from({ length: 25 }, () => ({ content: null }));

	// random enemy tiles
	let enemyCount = 3;
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

export function createGame() {
	const hero = createGameObject('character', {
		name: 'Hero',
		type: 'hero',
		hp: 10,
		maxHp: 10,
		inventory: new Array(12).fill(null),
		weapon: createGameObject('item', BASIC_WEAPONS.sword),
		armor: {
			chest: null,
			legs: null,
			feet: null,
			hands: null,
			head: null
		}
	});

	const room = createRoom();

	return {
		hero,
		room
	};
}
