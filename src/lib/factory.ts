// factories that allow the generation of game objects like player, enemy, etc.
import { game } from './stores';
import type { Character } from './types';
import * as utils from '$lib/utils';
import { defaultGame } from './core';

function createCharacter(options: any = {}): Character {
	return {
		id: utils.uuid(),
		...options,
		inventory: []
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

	game.update((g) => {
		return {
			...g,
			objects: [...g.objects, go]
		};
	});
}

export function createGame(options: any = {}) {
	// code saves cause extra characters
	game.set({ ...defaultGame });

	createGameObject('character', {
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

	createGameObject('character', {
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
}
