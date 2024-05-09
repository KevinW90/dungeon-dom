import { game } from '$lib/stores';
import type { GameEvent } from '$lib/types';
import { get, writable, type Writable } from 'svelte/store';

const eventLog: Writable<GameEvent[]> = writable([]);

export function logEvent(event: GameEvent) {
	const log = get(eventLog);
	log.push(event);

	const gameCopy = { ...get(game) };
	gameCopy.log = log;
	game.update((g) => ({ ...g, ...gameCopy }));
}

export function updateEvent(message: string): void {
	const log = get(eventLog);
	log[log.length - 1].messages.push(message);

	const gameCopy = { ...get(game) };
	gameCopy.log = log;
	game.update((g) => ({ ...g, ...gameCopy }));
}
