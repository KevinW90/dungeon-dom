import { writable, type Writable } from 'svelte/store';
import type { Enemy, Hero } from './types';

export const game: Writable<{
	entities: (Hero | Enemy)[];
}> = writable({
	entities: [] as (Hero | Enemy)[]
});
