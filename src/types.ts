export enum DamageType {
	Bludgeoning = 'bludgeoning',
	Piercing = 'piercing',
	Slashing = 'slashing',
	Fire = 'fire',
	Cold = 'cold',
	Acid = 'acid',
	Thunder = 'thunder',
	Lightning = 'lightning',
	Poison = 'poison',
	Radiant = 'radiant',
	Necrotic = 'necrotic',
	Psychic = 'psychic',
	Force = 'force',
}

export enum DefenseType {
	Immunity = 'immunity',
	Resistance = 'resistance',
}

export interface Defense {
	type: DamageType;
	defense: DefenseType;
}

export interface Character {
	name: string;
	level: number;
	hitPoints: number;
	temporaryHitPoints?: number;
	defenses: Defense[];
}
