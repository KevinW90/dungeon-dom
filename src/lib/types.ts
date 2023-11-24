export type Game = {
	objects: Character[];
};

export type Weapon = {
	id: string;
	type: string;
	name: string;
	damage: number;
	// other weapon properties
	durability: number | null;
};

export type Armor = {
	id: string;
	name: string;
	defense: number;
	// other armor properties
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
	armor?: {
		chest: Armor | null;
		legs: Armor | null;
		feet: Armor | null;
		hands: Armor | null;
		head: Armor | null;
	};
};
