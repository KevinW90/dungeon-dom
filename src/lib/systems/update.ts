import { game } from '$lib/stores';
import type { Character } from '$lib/types';
import { get } from 'svelte/store';

export function updateCharacter(characterData: Character): void {
	const gameCopy = { ...get(game) };
	if (characterData.type === 'hero') gameCopy.hero = characterData;
	else {
		const index = gameCopy.room.tiles.findIndex((t) => t.content?.id === characterData.id);
		gameCopy.room.tiles[index].content = characterData;
	}

	game.update((g) => ({ ...g, ...gameCopy }));
}
