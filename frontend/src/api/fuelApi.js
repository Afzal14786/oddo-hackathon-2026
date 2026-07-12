import client from './client';

// Fuel Logs
export const getFuelLogs = (params) => client.get('/fuel-expenses/fuel', { params });
export const getFuelLog = (id) => client.get(`/fuel-expenses/fuel/${id}`);
export const createFuelLog = (data) => client.post('/fuel-expenses/fuel', data);
export const updateFuelLog = (id, data) => client.patch(`/fuel-expenses/fuel/${id}`, data);
export const deleteFuelLog = (id) => client.delete(`/fuel-expenses/fuel/${id}`);

// Expenses
export const getExpenses = (params) => client.get('/fuel-expenses/expenses', { params });
export const getExpense = (id) => client.get(`/fuel-expenses/expenses/${id}`);
export const createExpense = (data) => client.post('/fuel-expenses/expenses', data);
export const updateExpense = (id, data) => client.patch(`/fuel-expenses/expenses/${id}`, data);
export const deleteExpense = (id) => client.delete(`/fuel-expenses/expenses/${id}`);