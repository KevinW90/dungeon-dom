// gameStore.js
import { writable } from "svelte/store";

// Create a writable store to hold the Game instance
const game: any = writable();

export default game;
