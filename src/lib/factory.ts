// factories that allow the generation of game objects like player, enemy, etc.
import { game } from './stores';

export function createHero(type: string, options: any = {}) {
	const id = Math.random().toString(36).substring(2, 9);
	game.update((g) => {
		return {
			...g,
			entities: [
				...g.entities,
				{
					...options,
					id,
					type: 'hero'
				}
			]
		};
	});
}

export function createEnemy(type: string, options: any = {}) {
	const id = Math.random().toString(36).substring(2, 9);
	game.update((g) => {
		return {
			...g,
			entities: [
				...g.entities,
				{
					...options,
					id,
					type: 'enemy'
				}
			]
		};
	});
}
