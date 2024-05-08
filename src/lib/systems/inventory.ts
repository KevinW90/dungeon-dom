import { game } from '$lib/stores';
import type { Character, Weapon } from '$lib/types';
import { get } from 'svelte/store';

/**
 * @description Equips a weapon to the HERO
 *
 * @param weapon The weapon that should be equipped
 */
export function equipWeapon(weapon: Weapon): void {
	const hero = get(game).hero;
	// swap currently equipped weapon with the new weapon
	const oldWeapon = hero.weapon;
	hero.weapon = weapon;
	// remove the weapon from inventory
	const index = hero.inventory.indexOf(weapon);
	hero.inventory[index] = oldWeapon;
	console.log(`${hero.name} equipped ${weapon.name}!`);

	// TODO: update character
	const gameCopy = { ...get(game) };
	gameCopy.hero = hero;
	game.update((g) => ({ ...g, ...gameCopy }));
}

/**
 * @description Equips the BASIC WEAPON to the HERO
 *
 * @returns void
 */
export function equipBasicWeapon(): void {
	const hero = get(game).hero;
	// find the basic weapon in inventory
	const basicWeapon = hero.inventory.find((i) => i?.durability === null);
	// equip the basic weapon
	hero.weapon = basicWeapon;

	// remove the basic weapon from inventory
	const index = hero.inventory.indexOf(basicWeapon);
	hero.inventory[index] = null;

	console.log(`${hero.name} equipped ${basicWeapon?.name}!`);

	// TODO: update character
	const gameCopy = { ...get(game) };
	gameCopy.hero = hero;
	game.update((g) => ({ ...g, ...gameCopy }));
}

/**
 * @description Equips a random weapon, if available, to the character
 *
 * @param character The character that should equip a random weapon
 */
export function equipRandomWeapon(character: Character): void {
	const weapons = character.inventory.filter((i) => i?.damage > 0);

	const randomWeapon = weapons[Math.floor(Math.random() * weapons.length)];
	character.weapon = randomWeapon || null;

	// remove the weapon from inventory
	const index = character.inventory.indexOf(randomWeapon);
	character.inventory[index] = null;

	console.log(`${character.name} equipped ${randomWeapon?.name}!`);

	// TODO: update character
	const gameCopy = { ...get(game) };
	gameCopy.room.tiles.find((t) => t.content?.id === character.id)!.content = character;
	game.update((g) => ({ ...g, ...gameCopy }));
}
