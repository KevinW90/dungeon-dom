import { game } from '$lib/stores';
import type { Character, Weapon } from '$lib/types';
import { calculateAttackPoints, calculateDefensePoints } from '$lib/utils';
import { get } from 'svelte/store';
import { equipBasicWeapon, equipRandomWeapon } from './inventory';
import { updateCharacter, updateTurn } from './update';
import { logEvent, updateEvent } from './eventLog';
import { nextRoom } from './room';
import { findAllEnemies } from '$lib/characters/enemies';

export function attack(attacker: Character, defender: Character): void {
	logEvent({
		type: 'attack',
		messages: [
			`${attacker.name} (${attacker.id}) attacks ${defender.name} (${defender.id}) with a ${attacker.weapon?.name}!`
		]
	});

	// damage is at least 1
	const damage = Math.max(1, calculateAttackPoints(attacker) - calculateDefensePoints(defender));
	takeDamage(defender, damage);

	// handle weapon durability
	if (attacker.weapon?.durability) attacker.weapon.durability -= 1;
	if (attacker.weapon?.durability && attacker.weapon?.durability <= 0)
		breakWeapon(attacker, attacker.weapon!);

	const gameCopy = get(game);
	// if it is the enemy turn, set the action-complete flag to true
	if (attacker.type === 'enemy') {
		gameCopy.enemyActionComplete = true;
		game.update((g) => ({ ...g, ...gameCopy }));
	}

	// hero attacking ends your turn
	const updatedDefender = gameCopy.room.tiles.find((t) => t.content?.id === defender.id)!.content;
	if (gameCopy.running && attacker === gameCopy.hero && updatedDefender?.hp > 0) updateTurn();
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
	const gameCopy = { ...get(game) };

	if (character.type === 'hero') {
		updateEvent('Game Over!');
		gameCopy.running = false;
		game.update((g) => ({ ...g, ...gameCopy }));
		return;
	}

	gameCopy.room.tiles.find((t) => t.content?.id === character.id)!.content = null;
	// after the enemy is removed from the game
	//   if it is the last enemy, go to the next room
	if (!findAllEnemies().length) return nextRoom();
	game.update((g) => ({ ...g, ...gameCopy }));
}
