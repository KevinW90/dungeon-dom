// factories that allow the generation of game objects like player, enemy, etc.
import type { Character } from './types';
import * as utils from '$lib/utils';

function createCharacter(options: any = {}): Character {
	return {
		id: utils.uuid(),
		...options,
		inventory: new Array(12)
	};
}

export function createGameObject(what: string, options: any) {
	let go: any;
	switch (what) {
		case 'character':
			go = createCharacter(options);
			break;
		default:
			throw new Error(`Unknown game object type: ${what}`);
	}

	return go;
}

export function createGame(options: any = {}) {
	const hero = createGameObject('character', {
		name: 'Hero',
		type: 'hero',
		hp: 10,
		maxHp: 10,
		weapon: {
			id: utils.uuid(),
			name: 'Basic Sword',
			damage: 3
		}
	});

	const enemy = createGameObject('character', {
		name: 'skeleton',
		type: 'enemy',
		hp: 3,
		maxHp: 3,
		weapon: {
			id: utils.uuid(),
			name: 'Fists',
			damage: 1
		}
	});

	return {
		objects: [hero, enemy]
	};
}
