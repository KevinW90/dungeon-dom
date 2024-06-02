// Room System File

import { writable, type Writable } from 'svelte/store';

type Tile = {
	id: number;
};

type Room = {
	id: string;
	width: number;
	height: number;
	tiles: Tile[];
};

export const currentRoom: Writable<null | Room> = writable(null);

function newRoom(width: number = 5, height: number = 5) {
	currentRoom.set({
		id: Math.random().toString(36).substring(2, 9),
		width,
		height,
		tiles: tiles(width, height)
	});
}

function tiles(w: number, h: number) {
	return Array.from({ length: w * h }).map((_, i) => ({
		id: i
	}));
}

export default {
	new: () => newRoom()
};
