import express from 'express';
import * as characterController from '../controllers/characterController';
import { validateDealDamage, validateHeal, validateTempHP } from '../middleware/validate';

const router = express.Router();

router.post('/deal-damage', validateDealDamage, characterController.dealDamage);
router.post('/heal', validateHeal, characterController.heal);
router.post('/add-temporary-hit-points', validateTempHP, characterController.addTemporaryHitPoints);

export default router;
