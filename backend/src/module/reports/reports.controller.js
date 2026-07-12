import { getDashboardKPIs, getAnalytics, generateAnalyticsCSV } from './reports.service.js';
import { ApiResponse } from '../../shared/utils/api-response.js';
import { HTTP_STATUS } from '../../shared/constant/http-codes.js';

export const getDashboard = async (req, res, next) => {
  try {
    const { type, status, region } = req.query;
    const kpis = await getDashboardKPIs({ type, status, region });
    new ApiResponse(res, HTTP_STATUS.OK, 'Dashboard KPIs fetched', kpis).send();
  } catch (error) {
    next(error);
  }
};

export const getAnalyticsReport = async (req, res, next) => {
  try {
    const { vehicleId, fromDate, toDate } = req.query;
    const analytics = await getAnalytics({ vehicleId, fromDate, toDate });
    new ApiResponse(res, HTTP_STATUS.OK, 'Analytics fetched', analytics).send();
  } catch (error) {
    next(error);
  }
};

export const exportCSV = async (req, res, next) => {
  try {
    const { vehicleId, fromDate, toDate } = req.query;
    const csv = await generateAnalyticsCSV({ vehicleId, fromDate, toDate });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=analytics.csv');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};