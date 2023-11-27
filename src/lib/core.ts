import { get } from 'svelte/store';
import type { Armor, Character, Item, Weapon } from './types';
import { game } from './stores';
import { calculateAttackPoints, calculateDefensePoints } from './utils';

export function attack(attacker: Character, defender: Character): void {
	// check the durability of the weapon used
	const attCopy = { ...attacker };
	if (attCopy.weapon?.durability) {
		attCopy.weapon.durability--;
		if (attCopy.weapon.durability <= 0) {
			const basicWeapon = attCopy.inventory.find((i) => i && !i.durability) || null;
			attCopy.weapon = null;
			equip(basicWeapon, attCopy);
		}
	}
	// damage is at least 1
	const damage = Math.max(1, calculateAttackPoints(attacker) - calculateDefensePoints(defender));
	takeDamage(defender, damage);
}

export function takeDamage(defender: Character, damage: number): void {
	// calculate the new stats
	const newDefenderStats = {
		...defender,
		hp: defender.hp - damage
	};

	// replace the game object's stats
	console.log('defender', defender);
	const ndx = get(game).room.tiles.findIndex((t) => t?.content?.id === defender.id);
	console.log(ndx);
	const gameCopy = { ...get(game) };
	gameCopy.room.tiles[ndx].content = newDefenderStats;

	// Update the game store with the modified game object
	game.update((g) => ({ ...g, ...gameCopy }));
}

export function addToInventory(item: Item, character: Character): void {
	let freeSpaceIndex = character.inventory.findIndex((slot) => !slot);

	if (freeSpaceIndex !== -1) {
		const characterCopy = { ...character };
		characterCopy.inventory[freeSpaceIndex] = item;

		const ndx = get(game).room.tiles.findIndex((t) => t?.content?.id === character.id);
		const gameCopy = { ...get(game) };
		gameCopy.room.tiles[ndx].content = characterCopy;

		// Update the game store with the modified game object
		game.update((g) => ({ ...g, ...gameCopy }));
	}
}

export function equip(item: Item | null, character: Character) {
	// checks
	if (!item) return;

	// copy of character
	const characterCopy = { ...character };

	const itemIndex = character.inventory.findIndex((i) => i?.id === item?.id);

	// type guard to check if the item is a weapon
	const isWeapon = (item: Item): item is Weapon => item.slot === 'weapon';

	// check the type of item (weapon or armor)
	if (isWeapon(item)) {
		console.log('is weapon', item);
		if (characterCopy.weapon) {
			// replace the item in the inventory with the current weapon
			characterCopy.inventory.splice(itemIndex, 1, characterCopy.weapon);
		} else characterCopy.inventory.splice(itemIndex, 1, null);
		characterCopy.weapon = item as Weapon;
	} else {
		const slot = item.slot;
		if (characterCopy.armor?.[slot]) {
			// replace the item in the inventory with the current armor
			characterCopy.inventory.splice(itemIndex, 1, characterCopy.armor[slot]);
		} else characterCopy.inventory.splice(itemIndex, 1, null);
		characterCopy.armor = {
			...characterCopy.armor,
			[slot]: item as Armor
		};
	}

	const gameCopy = { ...get(game) };
	gameCopy.hero = characterCopy;

	// Update the game store with the modified game object
	game.update((g) => ({ ...g, ...gameCopy }));
}

export function unequip(item: Armor | null, character: Character) {
	if (!item) return;

	// copy the character
	const characterCopy = { ...character };

	// check if room in inventory
	const freeSpaceIndex = characterCopy.inventory.findIndex((slot) => !slot);
	if (freeSpaceIndex === -1) return;

	// remove the armor from the character
	const slot = item.slot;
	characterCopy.armor[slot] = null;

	// add the armor to the inventory
	characterCopy.inventory[freeSpaceIndex] = item;

	// update the game object
	const gameCopy = { ...get(game) };
	gameCopy.hero = characterCopy;

	// Update the game store with the modified game object
	game.update((g) => ({ ...g, ...gameCopy }));
}
