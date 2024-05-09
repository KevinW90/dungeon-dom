import { writable, type Writable } from 'svelte/store';
import type { Game } from './types';
import { createGame } from './systems/initialization';

export const game: Writable<Game> = writable(createGame());
