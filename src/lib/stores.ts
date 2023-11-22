import { writable } from 'svelte/store';

export const game = writable({
	player: {
		name: '',
		hp: 0,
		maxHp: 0,
		atk: 0,
		def: 0
	}
});
