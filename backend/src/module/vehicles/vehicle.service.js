import { Vehicle } from './vehicle.model.js';
import { AppError } from '../../shared/utils/app-error.js';
import { HTTP_STATUS } from '../../shared/constant/http-codes.js';

export const createVehicle = async (data) => {
  // check unique registrationNumber
  const existing = await Vehicle.findOne({ registrationNumber: data.registrationNumber });
  if (existing) {
    throw new AppError(HTTP_STATUS.CONFLICT, 'Registration number already exists');
  }
  return await Vehicle.create(data);
};


export const getVehicles = async (filters = {}, options = {}) => {
  const query = {};

  if (filters.type) query.type = filters.type;
  if (filters.status) query.status = filters.status;
  if (filters.region) query.region = filters.region;
  if (filters.search) {
    query.$or = [
      { registrationNumber: { $regex: filters.search, $options: 'i' } },
      { name: { $regex: filters.search, $options: 'i' } },
      { model: { $regex: filters.search, $options: 'i' } },
    ];
  }

  const limit = options.limit ? parseInt(options.limit) : 100;
  const skip = options.skip ? parseInt(options.skip) : 0;
  const sort = options.sort || { createdAt: -1 };

  return await Vehicle.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

export const getVehicleById = async (id) => {
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Vehicle not found');
  }
  return vehicle;
};

export const updateVehicle = async (id, data) => {
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Vehicle not found');
  }

  // Prevent updating registrationNumber to a duplicate
  if (data.registrationNumber && data.registrationNumber !== vehicle.registrationNumber) {
    const existing = await Vehicle.findOne({ registrationNumber: data.registrationNumber });
    if (existing) {
      throw new AppError(HTTP_STATUS.CONFLICT, 'Registration number already exists');
    }
  }

  delete data.status;

  // Update and return the updated document
  const updated = await Vehicle.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return updated;
};

export const deleteVehicle = async (id) => {
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Vehicle not found');
  }

  await Vehicle.findByIdAndDelete(id);
};


export const updateVehicleStatus = async (id, newStatus, session = null) => {
  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Vehicle not found');
  }

  vehicle.status = newStatus;
  if (session) {
    await vehicle.save({ session });
  } else {
    await vehicle.save();
  }
  return vehicle;
};