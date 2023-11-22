// factories that allow the generation of game objects like player, enemy, etc.
import { game } from './stores';

export function create(what: string, options: any) {
	switch (what) {
		case 'player':
			game.update((g) => {
				return {
					...g,
					player: {
						...options
					}
				};
			});
			break;
		case 'enemy':
			console.log('enemy');
		default:
			console.error(`Unknown object ${what}`);
	}
}
