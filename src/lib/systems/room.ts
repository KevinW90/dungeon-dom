// Room System File

import { writable, type Writable } from 'svelte/store';

type Room = {
	id: string;
};

export const currentRoom: Writable<null | Room> = writable(null);

function newRoom(width: number = 5, height: number = 5) {
	currentRoom.set({
		id: Math.random().toString(36).substring(2, 9)
	});
}

export default {
	new: () => newRoom()
};
