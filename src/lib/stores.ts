import { writable, type Writable } from 'svelte/store';
import type { Game } from './types';

export const game: Writable<Game> = writable({ objects: [] });
