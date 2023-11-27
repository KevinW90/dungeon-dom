export type Game = {
	hero: Character;
	room: Room;
};

export type Room = {
	id: string;
	tiles: Tile[];
};

export type Tile = {
	content: any;
};

export type Weapon = {
	id: string;
	type: string;
	name: string;
	damage: number;
	// other weapon properties
	durability: number | null;
	slot: 'weapon';
};

export type Armor = {
	id: string;
	type: string;
	name: string;
	defense: number;
	// other armor properties
	durability: number | null;
	slot: 'chest' | 'legs' | 'feet' | 'hands' | 'head';
};

export type Item = Weapon | Armor;

export type Character = {
	id: string;
	name: string;
	type: 'hero' | 'enemy';
	hp: number;
	maxHp: number;
	inventory: any[];
	weapon: Weapon | null;
	armor: {
		head: Armor | null;
		chest: Armor | null;
		legs: Armor | null;
		feet: Armor | null;
		hands: Armor | null;
	};
};
