import { get } from 'svelte/store';
import type { Character } from './types';
import { game } from './stores';

export const defaultGame = {
	objects: []
};

export function calculateDefensePoints(character: Character): number {
	return character.armor
		? Object.values(character.armor).reduce((total, piece) => {
				return total + (piece.defense || 0);
		  }, 0)
		: 0;
}

export function attack(attacker: Character, defender: Character): void {
	// total defense points is all armor points

	// damage is at least 1
	const damage = Math.max(1, attacker.weapon.damage - calculateDefensePoints(defender));
	takeDamage(defender, damage);
}

export function takeDamage(defender: Character, damage: number): void {
	// calculate the new stats
	const newDefenderStats = {
		...defender,
		hp: defender.hp - damage
	};

	// replace the game object's stats
	const goCharacterIndex = get(game).objects.findIndex((go) => go.id === defender.id);
	get(game).objects.splice(goCharacterIndex, 1, newDefenderStats);
	game.update((g) => {
		return {
			...g
		};
	});
}
