import client from './client';

export const getDashboard = (params) => client.get('/reports/dashboard', { params });
export const getAnalytics = (params) => client.get('/reports/analytics', { params });
export const exportAnalyticsCSV = (params) =>
  client.get('/reports/export/csv', { params, responseType: 'blob' });