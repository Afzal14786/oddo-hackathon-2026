import { createVehicle,getVehicles, getVehicleById, updateVehicle, deleteVehicle} from './vehicle.service.js';
import { ApiResponse } from '../../shared/utils/api-response.js';
import { HTTP_STATUS } from '../../shared/constant/http-codes.js';

export const create = async (req, res, next) => {
  try {
    const vehicle = await createVehicle(req.body);
    new ApiResponse(res, HTTP_STATUS.CREATED, 'Vehicle created successfully', vehicle).send();
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const { type, status, region, search, limit, skip, sort } = req.query;
    const vehicles = await getVehicles(
      { type, status, region, search },
      { limit, skip, sort }
    );
    new ApiResponse(res, HTTP_STATUS.OK, 'Vehicles fetched successfully', vehicles).send();
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const vehicle = await getVehicleById(req.params.id);
    new ApiResponse(res, HTTP_STATUS.OK, 'Vehicle fetched successfully', vehicle).send();
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const vehicle = await updateVehicle(req.params.id, req.body);
    new ApiResponse(res, HTTP_STATUS.OK, 'Vehicle updated successfully', vehicle).send();
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deleteVehicle(req.params.id);
    new ApiResponse(res, HTTP_STATUS.NO_CONTENT, 'Vehicle deleted successfully', null).send();
  } catch (error) {
    next(error);
  }
};