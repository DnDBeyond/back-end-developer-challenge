import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import * as fs from 'fs';
import * as path from 'path';

import characterRoutes from './characterRoutes';
import { updateCharacter } from '../services/characterService';
import { Character, DamageType } from '../../types';


const app = express();
app.use(bodyParser.json());
app.use('/api/character', characterRoutes);

const originalCharacterDataPath = path.join(__dirname, '../../data/briv.json');
const loadOriginalCharacter = (): Character => {
	return JSON.parse(fs.readFileSync(originalCharacterDataPath, 'utf8'));
};

beforeEach(() => {
	updateCharacter(loadOriginalCharacter());
});

describe('Character API Endpoints', () => {
	describe('POST /deal-damage', () => {
		it('should deal 0 damage if the character is immune to the damage type', async () => {
			// In briv.json, Briv is immune to "fire"
			const res = await request(app)
			.post('/api/character/deal-damage')
			.send({ damage: 10, type: DamageType.Fire });
			expect(res.statusCode).toBe(200);
			expect(res.body.message).toContain('Dealt 0 damage');

			// Hit points should remain unchanged
			const originalHP = loadOriginalCharacter().hitPoints;
			expect(res.body.character.hitPoints).toBe(originalHP);
		});

		it('should reduce damage by half (rounded down) when character has resistance', async () => {
			// In briv.json, Briv has resistance to "slashing"
			const res = await request(app)
			.post('/api/character/deal-damage')
			.send({ damage: 10, type: DamageType.Slashing });
			expect(res.statusCode).toBe(200);
			// finalDamage should be floor(10 / 2) = 5
			expect(res.body.message).toContain('Dealt 5 damage');

			const originalHP = loadOriginalCharacter().hitPoints;
			expect(res.body.character.hitPoints).toBe(originalHP - 5);
		});

		it('should subtract temporary hit points before reducing hit points', async () => {
			// First, add 5 temporary hit points
			await request(app)
			.post('/api/character/add-temporary-hit-points')
			.send({ amount: 5 });

			// Then, deal 8 damage with a type that is neither immune nor resisted.
			const res = await request(app)
			.post('/api/character/deal-damage')
			.send({ damage: 8, type: DamageType.Cold });

			expect(res.statusCode).toBe(200);
			// The 5 temporary hit points should absorb 5 damage,
			// leaving 3 damage to reduce hit points.
			expect(res.body.message).toContain('Dealt 3 damage');
			expect(res.body.character.temporaryHitPoints).toBe(0);

			const originalHP = loadOriginalCharacter().hitPoints;
			expect(res.body.character.hitPoints).toBe(originalHP - 3);
		});
	});

	describe('POST /heal', () => {
		it('should heal the character by the specified amount', async () => {
			// First, deal some damage so that healing can be observed.
			await request(app)
			.post('/api/character/deal-damage')
			.send({ damage: 10, type: DamageType.Cold });

			// Heal 5 hit points
			const res = await request(app)
			.post('/api/character/heal')
			.send({ amount: 5 });

			expect(res.statusCode).toBe(200);
			expect(res.body.message).toContain('Healed 5 HP');

			// Check that hitPoints increased by 5 relative to the damaged state.
			const originalHP = loadOriginalCharacter().hitPoints;
			// Damage of 10 was applied, then healed by 5 => net -5 HP
			expect(res.body.character.hitPoints).toBe(originalHP - 10 + 5);
		});
	});

	describe('POST /add-temporary-hit-points', () => {
		it('should add temporary hit points if none exist', async () => {
			const res = await request(app)
			.post('/api/character/add-temporary-hit-points')
			.send({ amount: 7 });

			expect(res.statusCode).toBe(200);
			expect(res.body.message).toContain('Added 7 temporary HP');
			expect(res.body.character.temporaryHitPoints).toBe(7);
		});

		it('should update temporary hit points if the new amount is greater than the current temporary hit points', async () => {
			// First add 5 temporary hit points.
			await request(app)
			.post('/api/character/add-temporary-hit-points')
			.send({ amount: 5 });

			// Try adding a smaller amount; the temporary hit points should remain unchanged.
			const resLower = await request(app)
			.post('/api/character/add-temporary-hit-points')
			.send({ amount: 3 });
			expect(resLower.statusCode).toBe(200);
			expect(resLower.body.character.temporaryHitPoints).toBe(5);

			// Now, add a larger amount; the temporary hit points should be updated.
			const resHigher = await request(app)
			.post('/api/character/add-temporary-hit-points')
			.send({ amount: 8 });
			expect(resHigher.statusCode).toBe(200);
			expect(resHigher.body.character.temporaryHitPoints).toBe(8);
		});
	});

	describe('POST /deal-damage - Negative Test Cases', () => {
		it('should return 400 when damage is not an integer', async () => {
			const response = await request(app)
			.post('/api/character/deal-damage')
			.send({ damage: 'ten', type: 'fire' });

			expect(response.status).toBe(400);
			expect(response.body.error).toBe('Damage must be a positive integer.');
		});

		it('should return 400 when damage field is missing', async () => {
			const response = await request(app)
			.post('/api/character/deal-damage')
			.send({ type: 'fire' });

			expect(response.status).toBe(400);
			expect(response.body.error).toBe('Damage must be a positive integer.');
		});

		it('should return 400 when damage type is invalid', async () => {
			const response = await request(app)
			.post('/api/character/deal-damage')
			.send({ damage: 10, type: 'unknown' });

			expect(response.status).toBe(400);
			expect(response.body.error).toBe('Invalid damage type.');
		});

		it('should return 400 when damage is negative (if not allowed)', async () => {
			const response = await request(app)
			.post('/api/character/deal-damage')
			.send({ damage: -5, type: 'fire' });

			expect(response.status).toBe(400);
			expect(response.body.error).toBe('Damage must be a positive integer.');
		});
	});

	describe('POST /heal - Negative Test Cases', () => {
		it('should return 400 if amount is not an integer', async () => {
			const res = await request(app)
			.post('/api/character/heal')
			.send({ amount: 'five' });
			expect(res.status).toBe(400);
		});

		it('should return 400 if amount is missing', async () => {
			const res = await request(app)
			.post('/api/character/heal')
			.send({});
			expect(res.status).toBe(400);
		});
	});

	describe('POST /add-temporary-hit-points - Negative Test Cases', () => {
		it('should return 400 if tempHP is not an integer', async () => {
			const res = await request(app)
			.post('/api/character/add-temporary-hit-points')
			.send({ tempHP: 'ten' });
			expect(res.status).toBe(400);
		});

		it('should return 400 if tempHP is missing', async () => {
			const res = await request(app)
			.post('/api/character/add-temporary-hit-points')
			.send({});
			expect(res.status).toBe(400);
		});
	});
});
