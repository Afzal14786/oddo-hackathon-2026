import { Driver } from './driver.model.js';
import { AppError } from '../../shared/utils/app-error.js';
import { HTTP_STATUS } from '../../shared/constant/http-codes.js';

export const createDriver = async (data) => {
  // check licenseNumber
  const existing = await Driver.findOne({ licenseNumber: data.licenseNumber });
  if (existing) {
    throw new AppError(HTTP_STATUS.CONFLICT, 'License number already exists');
  }
  return await Driver.create(data);
};


export const getDrivers = async (filters = {}, options = {}) => {
  const query = {};

  if (filters.status) query.status = filters.status;
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { licenseNumber: { $regex: filters.search, $options: 'i' } },
    ];
  }

  // filter for licenses expiring within 30 days
  if (filters.licenseExpirySoon) {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    query.licenseExpiryDate = { $lte: thirtyDaysFromNow };
  }

  const limit = options.limit ? parseInt(options.limit) : 100;
  const skip = options.skip ? parseInt(options.skip) : 0;
  const sort = options.sort || { createdAt: -1 };

  return await Driver.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

export const getDriverById = async (id) => {
  const driver = await Driver.findById(id);
  if (!driver) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Driver not found');
  }
  return driver;
};

export const updateDriver = async (id, data) => {
  const driver = await Driver.findById(id);
  if (!driver) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Driver not found');
  }

  // prevent updating licenseNumber to a duplicate
  if (data.licenseNumber && data.licenseNumber !== driver.licenseNumber) {
    const existing = await Driver.findOne({ licenseNumber: data.licenseNumber });
    if (existing) {
      throw new AppError(HTTP_STATUS.CONFLICT, 'License number already exists');
    }
  }
  // prevent manual status updates via this generic update
  delete data.status;

  // Update and return
  const updated = await Driver.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return updated;
};


export const deleteDriver = async (id) => {
  const driver = await Driver.findById(id);
  if (!driver) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Driver not found');
  }
  await Driver.findByIdAndDelete(id);
};

export const updateDriverStatus = async (id, newStatus, session = null) => {
  const driver = await Driver.findById(id);
  if (!driver) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, 'Driver not found');
  }
  driver.status = newStatus;
  if (session) {
    await driver.save({ session });
  } else {
    await driver.save();
  }
  return driver;
};