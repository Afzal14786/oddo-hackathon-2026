import { Trip } from './trip.model.js';
import { Vehicle } from '../vehicles/vehicle.model.js';
import { Driver } from '../drivers/driver.model.js';
import { AppError } from '../../shared/utils/app-error.js';
import { HTTP_STATUS } from '../../shared/constant/http-codes.js';
import { updateVehicleStatus } from '../vehicles/vehicle.service.js';
import { updateDriverStatus } from '../drivers/driver.service.js';

// create trip
export const createTrip = async (data) => {

  const [vehicle, driver] = await Promise.all([
    Vehicle.findById(data.vehicleId),
    Driver.findById(data.driverId),
  ]);

  if (!vehicle) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Vehicle not found');
  if (!driver) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Driver not found');
  return await Trip.create(data);
};

// get trip
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

// get trip by id
export const getTripById = async (id) => {
  const trip = await Trip.findById(id)
    .populate('vehicleId')
    .populate('driverId');
  if (!trip) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Trip not found');
  return trip;
};

// update trip
export const updateTrip = async (id, data) => {
  const trip = await Trip.findById(id);
  if (!trip) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Trip not found');
  if (trip.status !== 'draft') {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Cannot update trip after dispatch');
  }

  if (data.vehicleId) {
    const vehicle = await Vehicle.findById(data.vehicleId);
    if (!vehicle) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Vehicle not found');
  }
  if (data.driverId) {
    const driver = await Driver.findById(data.driverId);
    if (!driver) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Driver not found');
  }
  const updated = await Trip.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  return updated;
};

// dispatch trip
export const dispatchTrip = async (tripId) => {

  const trip = await Trip.findById(tripId);
  if (!trip) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Trip not found');
  if (trip.status !== 'draft') {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, `Cannot dispatch trip with status ${trip.status}`);
  }


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

  // use shared functions to update vehicle and driver statuses
  await updateVehicleStatus(vehicle._id, 'on_trip');
  await updateDriverStatus(driver._id, 'on_trip');

  await trip.populate('vehicleId driverId');
  return trip;
};

// complete trip
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
  await vehicle.save(); // odometer update, then change status via shared function
  await updateVehicleStatus(vehicle._id, 'available');

  // update driver status
  await updateDriverStatus(driver._id, 'available');

  await trip.populate('vehicleId driverId');
  return trip;
};

// cancel trip
export const cancelTrip = async (tripId) => {
  const trip = await Trip.findById(tripId);
  if (!trip) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Trip not found');
  if (trip.status === 'completed') {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Completed trips cannot be cancelled');
  }
  if (trip.status === 'cancelled') {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Trip is already cancelled');
  }


  if (trip.status === 'dispatched') {
    const vehicle = await Vehicle.findById(trip.vehicleId);
    const driver = await Driver.findById(trip.driverId);
    if (vehicle && vehicle.status === 'on_trip') {
      await updateVehicleStatus(vehicle._id, 'available');
    }
    if (driver && driver.status === 'on_trip') {
      await updateDriverStatus(driver._id, 'available');
    }
  }

  trip.status = 'cancelled';
  trip.cancelledAt = new Date();
  await trip.save();

  await trip.populate('vehicleId driverId');
  return trip;
};

// delete trip
export const deleteTrip = async (tripId) => {
  const trip = await Trip.findById(tripId);
  if (!trip) throw new AppError(HTTP_STATUS.NOT_FOUND, 'Trip not found');
  if (trip.status !== 'draft') {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Only draft trips can be deleted');
  }
  await Trip.findByIdAndDelete(tripId);
};