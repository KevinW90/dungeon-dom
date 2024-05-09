import { createCharacter, createItem } from '$lib/factory';
import { BASIC_WEAPONS } from '$lib/items/weapons';
import { createRoom } from './room';

export function createGame() {
	const hero = createCharacter({
		name: 'Hero',
		type: 'hero',
		hp: 10,
		maxHp: 10,
		inventory: new Array(12).fill(null),
		weapon: createItem(BASIC_WEAPONS.sword),
		armor: {
			chest: null,
			legs: null,
			feet: null,
			hands: null,
			head: null
		}
	});

	const room = createRoom(2);

	return {
		hero,
		room,
		turn: hero,
		log: [
			{
				type: 'info',
				messages: ['Welcome to DungeonDom: Tile Explorer!', 'Click to interact with the tiles.']
			}
		],
		// TODO: turn === hero ? true : false
		enemyActionComplete: true
	};
}
