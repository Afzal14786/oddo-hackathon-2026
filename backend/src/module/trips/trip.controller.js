import { createTrip, getTrips, getTripById, updateTrip, dispatchTrip, completeTrip, cancelTrip, deleteTrip} from './trip.service.js';
import { ApiResponse } from '../../shared/utils/api-response.js';
import { HTTP_STATUS } from '../../shared/constant/http-codes.js';

export const create = async (req, res, next) => {
  try {
    const trip = await createTrip(req.body);
    new ApiResponse(res, HTTP_STATUS.CREATED, 'Trip created successfully (draft)', trip).send();
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const { status, vehicleId, driverId, fromDate, toDate, limit, skip, sort } = req.query;
    const trips = await getTrips(
      { status, vehicleId, driverId, fromDate, toDate },
      { limit, skip, sort }
    );
    new ApiResponse(res, HTTP_STATUS.OK, 'Trips fetched successfully', trips).send();
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const trip = await getTripById(req.params.id);
    new ApiResponse(res, HTTP_STATUS.OK, 'Trip fetched successfully', trip).send();
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const trip = await updateTrip(req.params.id, req.body);
    new ApiResponse(res, HTTP_STATUS.OK, 'Trip updated successfully', trip).send();
  } catch (error) {
    next(error);
  }
};

export const dispatch = async (req, res, next) => {
  try {
    const trip = await dispatchTrip(req.params.id);
    new ApiResponse(res, HTTP_STATUS.OK, 'Trip dispatched successfully', trip).send();
  } catch (error) {
    next(error);
  }
};

export const complete = async (req, res, next) => {
  try {
    const { actualDistance, fuelConsumed, revenue } = req.body;
    const trip = await completeTrip(req.params.id, { actualDistance, fuelConsumed, revenue });
    new ApiResponse(res, HTTP_STATUS.OK, 'Trip completed successfully', trip).send();
  } catch (error) {
    next(error);
  }
};

export const cancel = async (req, res, next) => {
  try {
    const trip = await cancelTrip(req.params.id);
    new ApiResponse(res, HTTP_STATUS.OK, 'Trip cancelled successfully', trip).send();
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deleteTrip(req.params.id);
    new ApiResponse(res, HTTP_STATUS.NO_CONTENT, 'Trip deleted successfully', null).send();
  } catch (error) {
    next(error);
  }
};