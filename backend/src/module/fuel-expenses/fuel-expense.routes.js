import express from 'express';
import {createFuel, listFuel, getFuel, updateFuel, deleteFuel, createExp, listExpenses, getExp, updateExp, deleteExp} from './fuel-expense.controller.js';
import { createFuelValidation, updateFuelValidation, fuelIdValidation, listFuelValidation, createExpenseValidation, updateExpenseValidation, expenseIdValidation, listExpenseValidation} from './fuel-expense.validation.js';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware.js';
import { validate } from '../../shared/middlewares/validation.middleware.js';

const router = express.Router();

// all routes require authentication
router.use(authenticate);

// ----- fule routes -----
router.get('/fuel', listFuelValidation, validate, listFuel);
router.get('/fuel/:id', fuelIdValidation, validate, getFuel);
router.use(authorize(['fleet_manager']));
router.post('/fuel', createFuelValidation, validate, createFuel);
router.patch('/fuel/:id', updateFuelValidation, validate, updateFuel);
router.delete('/fuel/:id', fuelIdValidation, validate, deleteFuel);

// ----- expense routes -----
router.get('/expenses', listExpenseValidation, validate, listExpenses);
router.get('/expenses/:id', expenseIdValidation, validate, getExp);
router.use(authorize(['fleet_manager']));
router.post('/expenses', createExpenseValidation, validate, createExp);
router.patch('/expenses/:id', updateExpenseValidation, validate, updateExp);
router.delete('/expenses/:id', expenseIdValidation, validate, deleteExp);

export default router;