// factories that allow the generation of game objects like player, enemy, etc.
import type { Character, Item } from './types';
import * as utils from '$lib/utils';
import { BASIC_WEAPONS } from './items/weapons';

function _createCharacter(options: any = {}): Character {
	return {
		id: utils.uuid(),
		...options,
		inventory: options.type === 'hero' ? new Array(12) : new Array(6)
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
			go = _createCharacter(options);
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
		weapon: createGameObject('item', BASIC_WEAPONS.sword),
		armor: {
			chest: null,
			legs: null,
			feet: null,
			hands: null,
			head: null
		}
	});

	const enemy = createGameObject('character', {
		name: 'skeleton',
		type: 'enemy',
		hp: 3,
		maxHp: 3
	});

	return {
		objects: [hero, enemy]
	};
}
