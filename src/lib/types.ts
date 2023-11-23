export type Hero = {
	id: string;
	name: string;
	hp: number;
	maxHp: number;
	atk: number;
	def: number;
	type: 'hero';
};

export type Enemy = {
	id: string;
	name: string;
	hp: number;
	maxHp: number;
	atk: number;
	def: number;
	type: 'enemy';
};
