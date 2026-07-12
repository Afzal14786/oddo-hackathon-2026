import client from './client';

export const getMaintenance = (params) => client.get('/maintenance', { params });
export const getMaintenanceRecord = (id) => client.get(`/maintenance/${id}`);
export const createMaintenance = (data) => client.post('/maintenance', data);
export const updateMaintenance = (id, data) => client.patch(`/maintenance/${id}`, data);
export const deleteMaintenance = (id) => client.delete(`/maintenance/${id}`);
export const closeMaintenance = (id) => client.post(`/maintenance/${id}/close`);