import { game } from '$lib/stores';
import type { Character } from '$lib/types';
import { get } from 'svelte/store';
import { attack } from './combat';
import { logEvent } from './eventLog';

export function updateCharacter(characterData: Character): void {
	const gameCopy = { ...get(game) };
	if (characterData.type === 'hero') gameCopy.hero = characterData;
	else {
		const index = gameCopy.room.tiles.findIndex((t) => t.content?.id === characterData.id);
		gameCopy.room.tiles[index].content = characterData;
	}

	game.update((g) => ({ ...g, ...gameCopy }));
}

export function updateTurn(): void {
	const gameCopy = { ...get(game) };
	if (gameCopy.enemyActionComplete) {
		const currentTurn = gameCopy.turn;
		const turnList = [
			gameCopy.hero,
			...gameCopy.room.tiles.filter((t) => t.content?.type === 'enemy').map((t) => t.content)
		];

		const index = turnList.findIndex((t) => t.id === currentTurn.id);

		// find the next character
		let nextIndex = (index + 1) % turnList.length;

		gameCopy.turn = turnList[nextIndex];
		game.update((g) => ({ ...g, ...gameCopy }));
	}

	if (gameCopy.turn.type === 'enemy') {
		gameCopy.enemyActionComplete = false;
		game.update((g) => ({ ...g, ...gameCopy }));
		setTimeout(() => {
			attack(gameCopy.turn, gameCopy.hero);
			// attack function checks for enemy turn and marks action-complete as true
		}, 1000);
	}

	if (gameCopy.turn === gameCopy.hero) {
		logEvent({
			type: 'info',
			messages: ['Your turn! What will you do?']
		});
	}
}
