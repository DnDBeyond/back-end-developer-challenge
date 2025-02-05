import { Character } from '../../types';
import * as fs from 'fs';
import * as path from 'path';

const characterDataPath = path.join(__dirname, '../../data/briv.json');
let character: Character = JSON.parse(fs.readFileSync(characterDataPath, 'utf8'));

export const getCharacter = (): Character => character;

export const updateCharacter = (updatedCharacter: Character): void => {
	character = updatedCharacter;
};
