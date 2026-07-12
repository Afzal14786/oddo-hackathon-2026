import {createMaintenance, closeMaintenance, getMaintenance, getMaintenanceById, updateMaintenance, deleteMaintenance} from './maintenance.service.js';
import { ApiResponse } from '../../shared/utils/api-response.js';
import { HTTP_STATUS } from '../../shared/constant/http-codes.js';

export const create = async (req, res, next) => {
  try {
    const log = await createMaintenance(req.body);
    new ApiResponse(res, HTTP_STATUS.CREATED, 'Maintenance record created', log).send();
  } catch (error) {
    next(error);
  }
};

export const close = async (req, res, next) => {
  try {
    const log = await closeMaintenance(req.params.id);
    new ApiResponse(res, HTTP_STATUS.OK, 'Maintenance record closed', log).send();
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const { vehicleId, closed, type, fromDate, toDate, limit, skip, sort } = req.query;
    const logs = await getMaintenance(
      { vehicleId, closed, type, fromDate, toDate },
      { limit, skip, sort }
    );
    new ApiResponse(res, HTTP_STATUS.OK, 'Maintenance records fetched', logs).send();
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const log = await getMaintenanceById(req.params.id);
    new ApiResponse(res, HTTP_STATUS.OK, 'Maintenance record fetched', log).send();
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const log = await updateMaintenance(req.params.id, req.body);
    new ApiResponse(res, HTTP_STATUS.OK, 'Maintenance record updated', log).send();
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deleteMaintenance(req.params.id);
    new ApiResponse(res, HTTP_STATUS.NO_CONTENT, 'Maintenance record deleted', null).send();
  } catch (error) {
    next(error);
  }
};