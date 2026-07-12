import { Maintenance } from './maintenance.model.js';
import { Vehicle } from '../vehicles/vehicle.model.js';
import { AppError } from '../../shared/utils/app-error.js';
import { HTTP_STATUS } from '../../shared/constant/http-codes.js';

/**
 * create a new maintenance record.
 * automatically sets vehicle status to 'in_shop' (unless already retired).
 * { vehicleId, type, description, date?, cost }
 * created maintenance log
 */
export const createMaintenance = async (data) => {
  const vehicle = await Vehicle.findById(data.vehicleId);
  if (!vehicle) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Vehicle not found');
  }

  // if vehicle is retired, we allow maintenance but status stays retired
  if (vehicle.status === 'retired') {
    // still create log, but don't change status
    const maintenance = await Maintenance.create(data);
    return maintenance;
  }

  // check if there is already an active maintenance for this vehicle
  const active = await Maintenance.findOne({ vehicleId: vehicle._id, closed: false });
  if (active) {
    throw new AppError(
      HTTP_STATUS.CONFLICT,
      'This vehicle already has an active maintenance record. Please close it first.'
    );
  }

  // create maintenance
  const maintenance = await Maintenance.create(data);

  // change vehicle status to 'in_shop'
  vehicle.status = 'in_shop';
  await vehicle.save();

  return maintenance;
};

/**
 * close a maintenance record.
 * restores vehicle status to 'available' unless the vehicle is retired.
 * updated maintenance log
 */
export const closeMaintenance = async (maintenanceId) => {
  const maintenance = await Maintenance.findById(maintenanceId);
  if (!maintenance) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Maintenance record not found');
  }
  if (maintenance.closed) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Maintenance record is already closed');
  }

  const vehicle = await Vehicle.findById(maintenance.vehicleId);
  if (!vehicle) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Vehicle not found');
  }

  // close the record
  maintenance.closed = true;
  maintenance.closedAt = new Date();
  await maintenance.save();

  // restore vehicle status to 'available' unless retired
  if (vehicle.status === 'in_shop' && vehicle.status !== 'retired') {
    // we must ensure no other active maintenance exists (but we already prevent creation of multiple active, so safe)
    vehicle.status = 'available';
    await vehicle.save();
  }

  return maintenance;
};

/**
 * get maintenance logs with filters.
 * { vehicleId, closed, fromDate, toDate, type }
 * { limit, skip, sort }
 * Maintenance logs
 */
export const getMaintenance = async (filters = {}, options = {}) => {
  const query = {};

  if (filters.vehicleId) query.vehicleId = filters.vehicleId;
  if (filters.closed !== undefined) query.closed = filters.closed === 'true';
  if (filters.type) query.type = filters.type;
  if (filters.fromDate || filters.toDate) {
    query.date = {};
    if (filters.fromDate) query.date.$gte = new Date(filters.fromDate);
    if (filters.toDate) query.date.$lte = new Date(filters.toDate);
  }

  const limit = options.limit ? parseInt(options.limit) : 100;
  const skip = options.skip ? parseInt(options.skip) : 0;
  const sort = options.sort || { date: -1 };

  return await Maintenance.find(query)
    .populate('vehicleId', 'registrationNumber name model type status')
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

/**
 * get a single maintenance log by ID.
 */
export const getMaintenanceById = async (id) => {
  const log = await Maintenance.findById(id).populate('vehicleId');
  if (!log) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Maintenance record not found');
  }
  return log;
};

/**
 * Update a maintenance log (only before it's closed).
 * id
 * fields to update
 * updated log
 */
export const updateMaintenance = async (id, data) => {
  const log = await Maintenance.findById(id);
  if (!log) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Maintenance record not found');
  }
  if (log.closed) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Cannot update a closed maintenance record');
  }
  // prevent changing vehicleId
  delete data.vehicleId;

  const updated = await Maintenance.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return updated;
};

/**
 * delete a maintenance log
 * for simplicity, we'll allow deletion only if it's not closed, and we must restore vehicle status if it was in_shop due to this log.
 * however, since we enforce only one active log, we can restore status.
 */
export const deleteMaintenance = async (id) => {
  const log = await Maintenance.findById(id);
  if (!log) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Maintenance record not found');
  }
  if (log.closed) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Cannot delete a closed maintenance record');
  }

  const vehicle = await Vehicle.findById(log.vehicleId);
  if (vehicle && vehicle.status === 'in_shop') {
    // only restore if the vehicle is in shop, and no other active maintenance exists (which is guaranteed by our rule)
    // but just to be safe, we can check if any other active maintenance exists for this vehicle.
    const otherActive = await Maintenance.findOne({
      vehicleId: vehicle._id,
      closed: false,
      _id: { $ne: log._id },
    });
    if (!otherActive) {
      vehicle.status = 'available';
      await vehicle.save();
    }
  }

  await Maintenance.findByIdAndDelete(id);
};