import { game } from '$lib/stores';
import type { Character, Weapon } from '$lib/types';
import { calculateAttackPoints, calculateDefensePoints } from '$lib/utils';
import { get } from 'svelte/store';
import { equipBasicWeapon, equipRandomWeapon } from './inventory';

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

	// check if defender is dead
	if (newDefenderStats.hp <= 0) return die(defender);

	// TODO: replace with a `updateCharacter` function
	// replace the game object's stats
	const gameCopy = { ...get(game) };
	gameCopy.room.tiles.find((t) => t.content?.id === defender.id)!.content = newDefenderStats;
	// Update the game store with the modified game object
	game.update((g) => ({ ...g, ...gameCopy }));
}

function breakWeapon(character: Character, weapon: Weapon): void {
	console.log(`${character.name}'s ${weapon.name} breaks!`);

	// equip the basic weapon (hero) or random weapon (enemy)
	if (character.type === 'hero') return equipBasicWeapon();
	equipRandomWeapon(character);
}

function die(character: Character): void {
	console.log(`${character.name} died!`);
	const gameCopy = { ...get(game) };
	gameCopy.room.tiles.find((t) => t.content?.id === character.id)!.content = null;
	game.update((g) => ({ ...g, ...gameCopy }));
}
