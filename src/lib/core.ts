import { get } from 'svelte/store';
import type { Character, Item, Weapon } from './types';
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

export function addToInventory(item: Item, character: Character): void {
	let freeSpaceIndex = character.inventory.findIndex((slot) => !slot);

	if (freeSpaceIndex !== -1) {
		const characterCopy = { ...character };
		characterCopy.inventory[freeSpaceIndex] = item;

		const goCharacterIndex = get(game).objects.findIndex((go) => go.id === character.id);
		get(game).objects.splice(goCharacterIndex, 1, characterCopy);
		game.update((g) => {
			return {
				...g
			};
		});
	}
}

export function equip(item: Item, character: Character) {
	// copy of character
	const characterCopy = { ...character };

	// check if the character has a weapon
	if (characterCopy.weapon && characterCopy.weapon.name !== 'Fists') {
		// replace the item in the inventory with the current weapon
		characterCopy.inventory.unshift(characterCopy.weapon);
	}

	characterCopy.weapon = item as Weapon;

	const itemIndex = characterCopy.inventory.findIndex((i) => i?.id === item.id);
	if (character.weapon.name === 'Fists') characterCopy.inventory.splice(itemIndex, 1, null);
	else characterCopy.inventory.splice(itemIndex, 1);

	const gameCopy = { ...get(game) };
	const characterIndex = gameCopy.objects.findIndex((go) => go.id === character.id);
	gameCopy.objects.splice(characterIndex, 1, characterCopy);

	// Update the game store with the modified game object
	game.update((g) => ({ ...g, ...gameCopy }));
}
