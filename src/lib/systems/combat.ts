import { game } from '$lib/stores';
import type { Character } from '$lib/types';
import { calculateAttackPoints, calculateDefensePoints } from '$lib/utils';
import { get } from 'svelte/store';

export function attack(attacker: Character, defender: Character): void {
	console.log(`${attacker.name} attacks ${defender.name}`);

	// damage is at least 1
	const damage = Math.max(1, calculateAttackPoints(attacker) - calculateDefensePoints(defender));
	takeDamage(defender, damage);

	// check the current weapon durability
	if (!attacker.weapon?.durability) return;

	// reduce the weapon durability
	attacker.weapon.durability -= 1;
	// TODO: `breakWeapon` function
	if (attacker.weapon?.durability > 0) return;
	console.log(`${attacker.name}'s ${attacker.weapon.name} breaks!`);
	attacker.weapon = null;
	// equip the basic weapon
	const basicWeapon = attacker.inventory.find((i) => i?.type === 'basic')!;
	attacker.weapon = basicWeapon;
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
