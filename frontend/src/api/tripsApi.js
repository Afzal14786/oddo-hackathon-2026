import client from './client';

export const getTrips = (params) => client.get('/trips', { params });
export const getTrip = (id) => client.get(`/trips/${id}`);
export const createTrip = (data) => client.post('/trips', data);
export const updateTrip = (id, data) => client.patch(`/trips/${id}`, data);
export const deleteTrip = (id) => client.delete(`/trips/${id}`);

export const dispatchTrip = (id) => client.post(`/trips/${id}/dispatch`);
export const completeTrip = (id, data) => client.post(`/trips/${id}/complete`, data);
export const cancelTrip = (id) => client.post(`/trips/${id}/cancel`);