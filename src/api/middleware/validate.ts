import { Request, Response, NextFunction } from 'express';
import { DamageType } from '../../types';

interface DealDamageRequest {
	damage: number;
	type: DamageType;
}

interface HealRequest {
	amount: number;
}

interface TempHPRequest {
	amount: number;
}

export const validateDealDamage = (req: Request, res: Response, next: NextFunction) => {
	const { damage, type } = req.body as DealDamageRequest;

	if (typeof damage !== 'number' || !Number.isInteger(damage) || damage <= 0) {
		res.status(400).json({ error: 'Damage must be a positive integer.' });
		return;
	}

	if (!Object.values(DamageType).includes(type)) {
		res.status(400).json({ error: 'Invalid damage type.' });
		return;
	}

	next();
};

export const validateHeal = (req: Request, res: Response, next: NextFunction) => {
	const { amount } = req.body as HealRequest;

	if (typeof amount !== 'number' || !Number.isInteger(amount) || amount <= 0) {
		res.status(400).json({ error: 'Amount must be a positive integer.' });
		return;
	}

	next();
};

export const validateTempHP = (req: Request, res: Response, next: NextFunction) => {
	const { amount } = req.body as TempHPRequest;

	if (typeof amount !== 'number' || !Number.isInteger(amount) || amount <= 0) {
		res.status(400).json({ error: 'Temporary HP amount must be a positive integer.' });
		return;
	}

	next();
};
