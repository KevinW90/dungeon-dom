import { game } from '$lib/stores';
import type { Character, Weapon } from '$lib/types';
import { calculateAttackPoints, calculateDefensePoints } from '$lib/utils';
import { get } from 'svelte/store';

export function attack(attacker: Character, defender: Character): void {
	console.log(`${attacker.name} attacks ${defender.name} with a ${attacker.weapon?.name}!`);

	// damage is at least 1
	const damage = Math.max(1, calculateAttackPoints(attacker) - calculateDefensePoints(defender));
	takeDamage(defender, damage);

	// check the current weapon durability
	if (!attacker.weapon?.durability) return;

	// handle weapon durability
	attacker.weapon.durability -= 1;
	if (attacker.weapon.durability > 0) return;
	breakWeapon(attacker, attacker.weapon);

	// no game update needed, takeDamage always fires an update
}

export function takeDamage(defender: Character, damage: number): void {
	console.log(`${defender.name} takes ${damage} damage`);
	// calculate the new stats
	const newDefenderStats = {
		...defender,
		hp: defender.hp - damage
	};
	console.log(newDefenderStats);

	// replace the game object's stats
	const ndx = get(game).room.tiles.findIndex((t) => t?.content?.id === defender.id);
	console.log(ndx);
	const gameCopy = { ...get(game) };

	// check if the defender is dead
	// TODO: replace with a `die` function
	gameCopy.room.tiles[ndx].content = newDefenderStats.hp <= 0 ? null : newDefenderStats;
	// Update the game store with the modified game object
	game.update((g) => ({ ...g, ...gameCopy }));
}

function breakWeapon(character: Character, weapon: Weapon): void {
	console.log(`${character.name}'s ${weapon.name} breaks!`);
	character.weapon = null;
	// equip the basic weapon (hero) or random weapon (enemy)
	if (character.type === 'hero') {
		// TODO: equipBasicWeapon(character);
		const basicWeapon = character.inventory.find((i) => i?.type === 'basic')!;
		character.weapon = basicWeapon;
	} else {
		// TODO: equipRandomWeapon(character);
		const weapons = character.inventory.filter((i) => i?.damage > 0);
		if (weapons.length === 0) return;

		const randomWeapon = weapons[Math.floor(Math.random() * weapons.length)];
		character.weapon = randomWeapon;
	}
}
