import type { Character } from './types';

export function uuid() {
	return Math.random().toString(36).substring(2, 9);
}

export function calculateDefensePoints(character: Character): number {
	return character.armor
		? Object.values(character.armor).reduce((total, piece) => {
				return total + (piece?.defense || 0);
		  }, 0)
		: 0;
}

export function calculateAttackPoints(character: Character): number {
	return character.weapon?.damage || 1;
}
