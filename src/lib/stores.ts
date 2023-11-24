import { writable, type Writable } from 'svelte/store';
import type { Game } from './types';
import { createGame } from './factory';

export const game: Writable<Game> = writable(createGame());
