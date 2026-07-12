import mongoose from 'mongoose';
import { Trip } from './trip.model.js';
import { Vehicle } from '../vehicles/vehicle.model.js';
import { Driver } from '../drivers/driver.model.js';
import { AppError } from '../../shared/utils/app-error.js';
import { HTTP_STATUS } from '../../shared/constant/http-codes.js';
import { updateVehicleStatus } from '../vehicles/vehicle.service.js';
import { updateDriverStatus } from '../drivers/driver.service.js';


export const createTrip = async (data) => {
  // basic existence check for vehicle and driver (they must exist)
  const [vehicle, driver] = await Promise.all([
    Vehicle.findById(data.vehicleId),
    Driver.findById(data.driverId),
  ]);

  if (!vehicle) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Vehicle not found');
  if (!driver) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Driver not found');

  // Create trip
  const trip = await Trip.create(data);
  return trip;
};

/**
 * get trips with filters.
 * { status, vehicleId, driverId, fromDate, toDate, search? }
 * { limit, skip, sort }
 */
export const getTrips = async (filters = {}, options = {}) => {
  const query = {};

  if (filters.status) query.status = filters.status;
  if (filters.vehicleId) query.vehicleId = filters.vehicleId;
  if (filters.driverId) query.driverId = filters.driverId;
  if (filters.fromDate || filters.toDate) {
    query.createdAt = {};
    if (filters.fromDate) query.createdAt.$gte = new Date(filters.fromDate);
    if (filters.toDate) query.createdAt.$lte = new Date(filters.toDate);
  }

  const limit = options.limit ? parseInt(options.limit) : 100;
  const skip = options.skip ? parseInt(options.skip) : 0;
  const sort = options.sort || { createdAt: -1 };

  return await Trip.find(query)
    .populate('vehicleId', 'registrationNumber name model type status')
    .populate('driverId', 'name licenseNumber status')
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

/**
 * get a single trip by ID.
 */
export const getTripById = async (id) => {
  const trip = await Trip.findById(id)
    .populate('vehicleId')
    .populate('driverId');
  if (!trip) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Trip not found');
  }
  return trip;
};

/**
 * update a draft trip (only allowed if status is draft).
 */
export const updateTrip = async (id, data) => {
  const trip = await Trip.findById(id);
  if (!trip) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Trip not found');
  }
  if (trip.status !== 'draft') {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Cannot update trip after dispatch');
  }

  // if vehicle or driver is changed, we need to check existence (but no availability yet)
  if (data.vehicleId) {
    const vehicle = await Vehicle.findById(data.vehicleId);
    if (!vehicle) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Vehicle not found');
  }
  if (data.driverId) {
    const driver = await Driver.findById(data.driverId);
    if (!driver) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Driver not found');
  }

  const updated = await Trip.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return updated;
};

/**
 * dispatch a trip – enforces ALL business rules.
 * tripId
 * Dispatched trip
 */
export const dispatchTrip = async (tripId) => {
  // fetch trip
  const trip = await Trip.findById(tripId);
  if (!trip) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Trip not found');
  if (trip.status !== 'draft') {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, `Cannot dispatch trip with status ${trip.status}`);
  }

  // fetch vehicle and driver
  const vehicle = await Vehicle.findById(trip.vehicleId);
  const driver = await Driver.findById(trip.driverId);
  if (!vehicle) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Vehicle not found');
  if (!driver) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Driver not found');

  // business rules
  if (vehicle.status === 'retired' || vehicle.status === 'in_shop') {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, `Vehicle is ${vehicle.status} and cannot be dispatched`);
  }
  if (!driver.isLicenseValid()) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Driver license is expired or driver is suspended');
  }
  if (vehicle.status === 'on_trip') {
    throw new AppError(HTTP_STATUS.CONFLICT, 'Vehicle is already on another trip');
  }
  if (driver.status === 'on_trip') {
    throw new AppError(HTTP_STATUS.CONFLICT, 'Driver is already on another trip');
  }
  if (trip.cargoWeight > vehicle.maxLoadCapacity) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      `Cargo weight (${trip.cargoWeight}kg) exceeds vehicle capacity (${vehicle.maxLoadCapacity}kg)`
    );
  }

  // update trip status
  trip.status = 'dispatched';
  trip.dispatchedAt = new Date();
  await trip.save();

  // update vehicle and driver status to on_trip
  vehicle.status = 'on_trip';
  await vehicle.save();

  driver.status = 'on_trip';
  await driver.save();

  await trip.populate('vehicleId driverId');
  return trip;
};

/**
 * complete a dispatched trip – updates odometer, fuel, statuses.
 * tripId
 * { actualDistance, fuelConsumed, revenue? }
 * Completed trip
 */
export const completeTrip = async (tripId, data) => {
  const { actualDistance, fuelConsumed, revenue } = data;

  if (actualDistance == null || actualDistance < 0) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Actual distance is required and must be positive');
  }
  if (fuelConsumed == null || fuelConsumed < 0) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Fuel consumed is required and must be positive');
  }

  const trip = await Trip.findById(tripId);
  if (!trip) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Trip not found');
  if (trip.status !== 'dispatched') {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Only dispatched trips can be completed');
  }

  const vehicle = await Vehicle.findById(trip.vehicleId);
  const driver = await Driver.findById(trip.driverId);
  if (!vehicle) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Vehicle not found');
  if (!driver) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Driver not found');

  // update trip
  trip.status = 'completed';
  trip.completedAt = new Date();
  trip.actualDistance = actualDistance;
  if (revenue !== undefined) trip.revenue = revenue;
  await trip.save();

  // update vehicle odometer and status
  vehicle.odometer += actualDistance;
  vehicle.status = 'available';
  await vehicle.save();

  // update driver status
  driver.status = 'available';
  await driver.save();

  await trip.populate('vehicleId driverId');
  return trip;
};

/**
 * cancel a trip (draft or dispatched).
 * tripId
 * Cancelled trip
 */
export const cancelTrip = async (tripId) => {
  const trip = await Trip.findById(tripId);
  if (!trip) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Trip not found');
  if (trip.status === 'completed') {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Completed trips cannot be cancelled');
  }
  if (trip.status === 'cancelled') {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Trip is already cancelled');
  }

  // If dispatched, restore vehicle and driver statuses
  if (trip.status === 'dispatched') {
    const vehicle = await Vehicle.findById(trip.vehicleId);
    const driver = await Driver.findById(trip.driverId);
    if (vehicle && vehicle.status === 'on_trip') {
      vehicle.status = 'available';
      await vehicle.save();
    }
    if (driver && driver.status === 'on_trip') {
      driver.status = 'available';
      await driver.save();
    }
  }

  trip.status = 'cancelled';
  trip.cancelledAt = new Date();
  await trip.save();

  await trip.populate('vehicleId driverId');
  return trip;
};

/**
 * Delete a trip (only if draft).
 */
export const deleteTrip = async (tripId) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Trip not found');
  }
  if (trip.status !== 'draft') {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Only draft trips can be deleted');
  }
  await Trip.findByIdAndDelete(tripId);
};