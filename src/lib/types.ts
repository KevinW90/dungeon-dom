export type Game = {
	objects: Character[];
};

export type Weapon = {
	id: string;
	name: string;
	damage: number;
	// other weapon properties
};

export type Armor = {
	id: string;
	name: string;
	defense: number;
	// other armor properties
};

export type Character = {
	id: string;
	name: string;
	type: 'hero' | 'enemy';
	hp: number;
	maxHp: number;
	inventory: any[];
	weapon: Weapon;
	armor?: {
		chest: Armor;
		legs: Armor;
		feet: Armor;
		hands: Armor;
		head: Armor;
	};
};
