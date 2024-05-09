// factories that allow the generation of game objects like player, enemy, etc.
import type { Character, Item, Room, Tile } from './types';
import * as utils from '$lib/utils';
import { BASIC_WEAPONS, weapons } from './items/weapons';
import { goblin } from './characters/enemies';
import { createRoom } from './systems/room';

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

	const room = createRoom(1);

	return {
		hero,
		room,
		turn: hero,
		log: [
			{
				type: 'info',
				messages: ['Welcome to DungeonDom: Tile Explorer!', 'Click to interact with the tiles.']
			}
		],
		// TODO: turn === hero ? true : false
		enemyActionComplete: true
	};
}
