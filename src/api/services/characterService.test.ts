import { getCharacter, updateCharacter } from './characterService';
import { Character } from '../../types';

describe('Character Service', () => {
	let initialCharacter: Character;

	beforeEach(() => {
		initialCharacter = getCharacter();
	});

	test('should load character data from briv.json', () => {
		const character = getCharacter();
		expect(character).toBeDefined();
		expect(character.name).toBe('Briv');
		expect(character.hitPoints).toBe(25);
	});

	test('should update character data', () => {
		const updatedCharacter = { ...initialCharacter, hitPoints: 30 };
		updateCharacter(updatedCharacter);

		const character = getCharacter();
		expect(character.hitPoints).toBe(30);
	});
});
