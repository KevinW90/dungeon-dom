import { game } from '$lib/stores';
import type { Character } from '$lib/types';
import { get } from 'svelte/store';

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
