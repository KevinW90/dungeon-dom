import { game } from '$lib/stores';
import type { Character, Weapon } from '$lib/types';
import { calculateAttackPoints, calculateDefensePoints } from '$lib/utils';
import { get } from 'svelte/store';
import { equipBasicWeapon, equipRandomWeapon } from './inventory';
import { updateCharacter, updateTurn } from './update';
import { logEvent, updateEvent } from './eventLog';

export function attack(attacker: Character, defender: Character): void {
	logEvent({
		type: 'attack',
		messages: [`${attacker.name} attacks ${defender.name} with a ${attacker.weapon?.name}!`]
	});

	// damage is at least 1
	const damage = Math.max(1, calculateAttackPoints(attacker) - calculateDefensePoints(defender));
	takeDamage(defender, damage);

	// handle weapon durability
	if (attacker.weapon?.durability) attacker.weapon.durability -= 1;
	if (attacker.weapon?.durability && attacker.weapon?.durability <= 0)
		breakWeapon(attacker, attacker.weapon!);

	// if it is the enemy turn, set the action-complete flag to true
	if (attacker.type === 'enemy') {
		const gameCopy = { ...get(game) };
		gameCopy.enemyActionComplete = true;
		game.update((g) => ({ ...g, ...gameCopy }));
	}
}

export function takeDamage(defender: Character, damage: number): void {
	updateEvent(`${defender.name} (${defender.id}) takes ${damage} damage`);
	// calculate the new stats
	const newDefenderStats = {
		...defender,
		hp: defender.hp - damage
	};

	updateCharacter(newDefenderStats);
	// check if defender is dead
	if (newDefenderStats.hp <= 0) die(defender);
}

function breakWeapon(character: Character, weapon: Weapon): void {
	logEvent({
		type: 'info',
		messages: [`${character.name}'s ${weapon.name} breaks!`]
	});

	// equip the basic weapon (hero) or random weapon (enemy)
	if (character.type === 'hero') return equipBasicWeapon();
	equipRandomWeapon(character);
}

function die(character: Character): void {
	logEvent({
		type: 'death',
		messages: [`${character.name} (${character.id}) died!`]
	});
	if (character.type === 'hero') return updateEvent('Game Over!');

	const gameCopy = { ...get(game) };
	gameCopy.room.tiles.find((t) => t.content?.id === character.id)!.content = null;
	game.update((g) => ({ ...g, ...gameCopy }));
}
