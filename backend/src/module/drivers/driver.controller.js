import { createDriver, getDrivers, getDriverById, updateDriver, deleteDriver} from './driver.service.js';
import { ApiResponse } from '../../shared/utils/api-response.js';
import { HTTP_STATUS } from '../../shared/constant/http-codes.js';

export const create = async (req, res, next) => {
  try {
    const driver = await createDriver(req.body);
    new ApiResponse(res, HTTP_STATUS.CREATED, 'Driver created successfully', driver).send();
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const { status, licenseExpirySoon, search, limit, skip, sort } = req.query;
    const drivers = await getDrivers(
      { status, licenseExpirySoon, search },
      { limit, skip, sort }
    );
    new ApiResponse(res, HTTP_STATUS.OK, 'Drivers fetched successfully', drivers).send();
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const driver = await getDriverById(req.params.id);
    new ApiResponse(res, HTTP_STATUS.OK, 'Driver fetched successfully', driver).send();
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const driver = await updateDriver(req.params.id, req.body);
    new ApiResponse(res, HTTP_STATUS.OK, 'Driver updated successfully', driver).send();
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deleteDriver(req.params.id);
    new ApiResponse(res, HTTP_STATUS.NO_CONTENT, 'Driver deleted successfully', null).send();
  } catch (error) {
    next(error);
  }
};