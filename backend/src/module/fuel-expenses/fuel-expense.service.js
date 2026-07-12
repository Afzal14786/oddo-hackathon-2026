// src/module/fuel-expenses/fuel-expense.service.js

import { FuelLog } from './fuel.model.js';
import { Expense } from './expense.model.js';
import { Vehicle } from '../vehicles/vehicle.model.js';
import { Maintenance } from '../maintenance/maintenance.model.js';
import { AppError } from '../../shared/utils/app-error.js';
import { HTTP_STATUS } from '../../shared/constant/http-codes.js';

// ----- Fuel Log Services -----

export const createFuelLog = async (data) => {
  const vehicle = await Vehicle.findById(data.vehicleId);
  if (!vehicle) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Vehicle not found');
  return await FuelLog.create(data);
};

export const getFuelLogs = async (filters = {}, options = {}) => {
  const query = {};
  if (filters.vehicleId) query.vehicleId = filters.vehicleId;
  if (filters.tripId) query.tripId = filters.tripId;
  if (filters.fromDate || filters.toDate) {
    query.date = {};
    if (filters.fromDate) query.date.$gte = new Date(filters.fromDate);
    if (filters.toDate) query.date.$lte = new Date(filters.toDate);
  }

  const limit = options.limit ? parseInt(options.limit) : 100;
  const skip = options.skip ? parseInt(options.skip) : 0;
  const sort = options.sort || { date: -1 };

  return await FuelLog.find(query)
    .populate('vehicleId', 'registrationNumber name model')
    .populate('tripId', 'source destination status')
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

export const getFuelLogById = async (id) => {
  const log = await FuelLog.findById(id)
    .populate('vehicleId')
    .populate('tripId');
  if (!log) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Fuel log not found');
  return log;
};

export const updateFuelLog = async (id, data) => {
  const log = await FuelLog.findById(id);
  if (!log) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Fuel log not found');
  const allowed = ['liters', 'cost', 'date'];
  const updateData = {};
  allowed.forEach(field => {
    if (data[field] !== undefined) updateData[field] = data[field];
  });
  const updated = await FuelLog.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  return updated;
};

export const deleteFuelLog = async (id) => {
  const log = await FuelLog.findById(id);
  if (!log) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Fuel log not found');
  await FuelLog.findByIdAndDelete(id);
};

// ----- Expense Services -----

export const createExpense = async (data) => {
  const vehicle = await Vehicle.findById(data.vehicleId);
  if (!vehicle) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Vehicle not found');
  return await Expense.create(data);
};

export const getExpenses = async (filters = {}, options = {}) => {
  const query = {};
  if (filters.vehicleId) query.vehicleId = filters.vehicleId;
  if (filters.tripId) query.tripId = filters.tripId;
  if (filters.type) query.type = filters.type;
  if (filters.fromDate || filters.toDate) {
    query.date = {};
    if (filters.fromDate) query.date.$gte = new Date(filters.fromDate);
    if (filters.toDate) query.date.$lte = new Date(filters.toDate);
  }

  const limit = options.limit ? parseInt(options.limit) : 100;
  const skip = options.skip ? parseInt(options.skip) : 0;
  const sort = options.sort || { date: -1 };

  return await Expense.find(query)
    .populate('vehicleId', 'registrationNumber name model')
    .populate('tripId', 'source destination status')
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

export const getExpenseById = async (id) => {
  const exp = await Expense.findById(id)
    .populate('vehicleId')
    .populate('tripId');
  if (!exp) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Expense not found');
  return exp;
};

export const updateExpense = async (id, data) => {
  const exp = await Expense.findById(id);
  if (!exp) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Expense not found');
  const allowed = ['type', 'amount', 'description', 'date'];
  const updateData = {};
  allowed.forEach(field => {
    if (data[field] !== undefined) updateData[field] = data[field];
  });
  const updated = await Expense.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  return updated;
};

export const deleteExpense = async (id) => {
  const exp = await Expense.findById(id);
  if (!exp) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Expense not found');
  await Expense.findByIdAndDelete(id);
};

// ----- aggregation Service (for Reports) -----

export const getVehicleOperationalCost = async (vehicleId, fromDate, toDate) => {
  const dateFilter = {};
  if (fromDate) dateFilter.$gte = new Date(fromDate);
  if (toDate) dateFilter.$lte = new Date(toDate);

  const match = { vehicleId: vehicleId };
  if (Object.keys(dateFilter).length) match.date = dateFilter;

  // sum fuel costs
  const fuelAgg = await FuelLog.aggregate([
    { $match: match },
    { $group: { _id: null, totalFuelCost: { $sum: '$cost' } } }
  ]);
  const totalFuelCost = fuelAgg.length ? fuelAgg[0].totalFuelCost : 0;

  // sum expenses
  const expenseAgg = await Expense.aggregate([
    { $match: match },
    { $group: { _id: null, totalExpense: { $sum: '$amount' } } }
  ]);
  const totalExpense = expenseAgg.length ? expenseAgg[0].totalExpense : 0;

  // sum maintenance costs (only closed records)
  const maintMatch = { vehicleId: vehicleId, closed: true };
  if (Object.keys(dateFilter).length) maintMatch.date = dateFilter;
  const maintAgg = await Maintenance.aggregate([
    { $match: maintMatch },
    { $group: { _id: null, totalMaintenance: { $sum: '$cost' } } }
  ]);
  const totalMaintenance = maintAgg.length ? maintAgg[0].totalMaintenance : 0;

  return {
    totalFuelCost,
    totalExpense,
    totalMaintenance,
    totalOperationalCost: totalFuelCost + totalExpense + totalMaintenance,
  };
};