import {
  createFuelLog,
  getFuelLogs,
  getFuelLogById,
  updateFuelLog,
  deleteFuelLog,
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from './fuel-expense.service.js';
import { ApiResponse } from '../../shared/utils/api-response.js';
import { HTTP_STATUS } from '../../shared/constant/http-codes.js';

// ----- Fuel Controllers -----

export const createFuel = async (req, res, next) => {
  try {
    const log = await createFuelLog(req.body);
    new ApiResponse(res, HTTP_STATUS.CREATED, 'Fuel log created', log).send();
  } catch (error) {
    next(error);
  }
};

export const listFuel = async (req, res, next) => {
  try {
    const { vehicleId, tripId, fromDate, toDate, limit, skip, sort } = req.query;
    const logs = await getFuelLogs(
      { vehicleId, tripId, fromDate, toDate },
      { limit, skip, sort }
    );
    new ApiResponse(res, HTTP_STATUS.OK, 'Fuel logs fetched', logs).send();
  } catch (error) {
    next(error);
  }
};

export const getFuel = async (req, res, next) => {
  try {
    const log = await getFuelLogById(req.params.id);
    new ApiResponse(res, HTTP_STATUS.OK, 'Fuel log fetched', log).send();
  } catch (error) {
    next(error);
  }
};

export const updateFuel = async (req, res, next) => {
  try {
    const log = await updateFuelLog(req.params.id, req.body);
    new ApiResponse(res, HTTP_STATUS.OK, 'Fuel log updated', log).send();
  } catch (error) {
    next(error);
  }
};

export const deleteFuel = async (req, res, next) => {
  try {
    await deleteFuelLog(req.params.id);
    new ApiResponse(res, HTTP_STATUS.NO_CONTENT, 'Fuel log deleted', null).send();
  } catch (error) {
    next(error);
  }
};

// ----- Expense Controllers -----

export const createExp = async (req, res, next) => {
  try {
    const exp = await createExpense(req.body);
    new ApiResponse(res, HTTP_STATUS.CREATED, 'Expense created', exp).send();
  } catch (error) {
    next(error);
  }
};

export const listExpenses = async (req, res, next) => {
  try {
    const { vehicleId, tripId, type, fromDate, toDate, limit, skip, sort } = req.query;
    const exps = await getExpenses(
      { vehicleId, tripId, type, fromDate, toDate },
      { limit, skip, sort }
    );
    new ApiResponse(res, HTTP_STATUS.OK, 'Expenses fetched', exps).send();
  } catch (error) {
    next(error);
  }
};

export const getExp = async (req, res, next) => {
  try {
    const exp = await getExpenseById(req.params.id);
    new ApiResponse(res, HTTP_STATUS.OK, 'Expense fetched', exp).send();
  } catch (error) {
    next(error);
  }
};

export const updateExp = async (req, res, next) => {
  try {
    const exp = await updateExpense(req.params.id, req.body);
    new ApiResponse(res, HTTP_STATUS.OK, 'Expense updated', exp).send();
  } catch (error) {
    next(error);
  }
};

export const deleteExp = async (req, res, next) => {
  try {
    await deleteExpense(req.params.id);
    new ApiResponse(res, HTTP_STATUS.NO_CONTENT, 'Expense deleted', null).send();
  } catch (error) {
    next(error);
  }
};