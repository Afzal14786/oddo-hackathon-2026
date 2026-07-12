import express from 'express';
import { getDashboard, getAnalyticsReport, exportCSV } from './reports.controller.js';
import { dashboardFiltersValidation, analyticsFiltersValidation, exportCSVValidation} from './reports.validation.js';
import { authenticate, authorize } from '../../shared/middlewares/auth.middleware.js';
import { validate } from '../../shared/middlewares/validation.middleware.js';

const router = express.Router();

// all report routes require authentication
router.use(authenticate);

// dashboard -- accessible to all authenticated users
router.get('/dashboard', dashboardFiltersValidation, validate, getDashboard);

// analytics -- accessible to fleet_manager and financial_analyst only
router.use(authorize(['fleet_manager', 'financial_analyst']));
router.get('/analytics', analyticsFiltersValidation, validate, getAnalyticsReport);
router.get('/export/csv', exportCSVValidation, validate, exportCSV);

export default router;