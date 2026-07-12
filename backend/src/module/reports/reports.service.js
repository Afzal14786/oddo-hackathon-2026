import { Vehicle } from '../vehicles/vehicle.model.js';
import { Driver } from '../drivers/driver.model.js';
import { Trip } from '../trips/trip.model.js';
import { FuelLog } from '../fuel-expenses/fuel.model.js';
import { Expense } from '../fuel-expenses/expense.model.js';
import { Maintenance } from '../maintenance/maintenance.model.js';
import { AppError } from '../../shared/utils/app-error.js';
import { HTTP_STATUS } from '../../shared/constant/http-codes.js';

/**
 * get dashboard KPIs with optional filters
 * { type, status, region }
 * Dashboard data
 */
export const getDashboardKPIs = async (filters = {}) => {
  const vehicleQuery = {};
  if (filters.type) vehicleQuery.type = filters.type;
  if (filters.status) vehicleQuery.status = filters.status;
  if (filters.region) vehicleQuery.region = filters.region;

  // count vehicles by status 
  const vehicles = await Vehicle.find(vehicleQuery);
  const activeVehicles = vehicles.filter(v => v.status !== 'retired').length;
  const availableVehicles = vehicles.filter(v => v.status === 'available').length;
  const inMaintenance = vehicles.filter(v => v.status === 'in_shop').length;

  // active trips 
  const activeTrips = await Trip.countDocuments({ status: 'dispatched' });
  const pendingTrips = await Trip.countDocuments({ status: 'draft' });

  // drivers on duty (available or on_trip)
  const driversOnDuty = await Driver.countDocuments({
    status: { $in: ['available', 'on_trip'] },
  });

  // fleet utilization: (on_trip vehicles / total active vehicles) * 100
  const onTripVehicles = vehicles.filter(v => v.status === 'on_trip').length;
  const fleetUtilization = activeVehicles > 0 ? (onTripVehicles / activeVehicles) * 100 : 0;

  // additional counts for active, available, in maintenance already done above

  return {
    activeVehicles,
    availableVehicles,
    inMaintenance,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    fleetUtilization: Math.round(fleetUtilization * 100) / 100, // round to 2 decimals
  };
};

/**
 * get analytics: fuel efficiency, operational cost, ROI
 * { vehicleId, fromDate, toDate }
 * analytics data
 */
export const getAnalytics = async (filters = {}) => {
  const vehicleId = filters.vehicleId;
  const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
  const toDate = filters.toDate ? new Date(filters.toDate) : null;

  // build date filter for trips, fuel, expenses, maintenance
  const dateFilter = {};
  if (fromDate) dateFilter.$gte = fromDate;
  if (toDate) dateFilter.$lte = toDate;

  const tripMatch = { status: 'completed' };
  if (vehicleId) tripMatch.vehicleId = vehicleId;
  if (Object.keys(dateFilter).length) {
    tripMatch.completedAt = dateFilter;
  }

  // get completed trips to compute total distance and revenue
  const trips = await Trip.find(tripMatch)
    .populate('vehicleId', 'registrationNumber name maxLoadCapacity acquisitionCost')
    .populate('driverId', 'name');

  // fuel logs match
  const fuelMatch = {};
  if (vehicleId) fuelMatch.vehicleId = vehicleId;
  if (Object.keys(dateFilter).length) fuelMatch.date = dateFilter;

  // expenses match
  const expenseMatch = {};
  if (vehicleId) expenseMatch.vehicleId = vehicleId;
  if (Object.keys(dateFilter).length) expenseMatch.date = dateFilter;

  // maintenance logs match
  const maintMatch = { closed: true };
  if (vehicleId) maintMatch.vehicleId = vehicleId;
  if (Object.keys(dateFilter).length) maintMatch.date = dateFilter;

  // fetch aggregates
  const [fuelLogs, expenses, maintenances] = await Promise.all([
    FuelLog.find(fuelMatch),
    Expense.find(expenseMatch),
    Maintenance.find(maintMatch),
  ]);

  // compute totals
  const totalDistance = trips.reduce((sum, t) => sum + (t.actualDistance || 0), 0);
  const totalRevenue = trips.reduce((sum, t) => sum + (t.revenue || 0), 0);
  const totalFuelCost = fuelLogs.reduce((sum, f) => sum + f.cost, 0);
  const totalFuelLiters = fuelLogs.reduce((sum, f) => sum + f.liters, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalMaintenance = maintenances.reduce((sum, m) => sum + m.cost, 0);
  const totalOperationalCost = totalFuelCost + totalExpense + totalMaintenance;

  // fuel efficiency (km per liter)
  const fuelEfficiency = totalFuelLiters > 0 ? totalDistance / totalFuelLiters : 0;

  // ROI per vehicle (if vehicleId provided)
  let vehicleROI = null;
  if (vehicleId) {
    const vehicle = await Vehicle.findById(vehicleId);
    if (vehicle) {
      const roi = (totalRevenue - totalOperationalCost) / vehicle.acquisitionCost;
      vehicleROI = Math.round(roi * 100) / 100;
    }
  } else {
    // overall ROI: average across all vehicles? We'll compute per vehicle and average.
    // for simplicity, we compute overall ROI using total revenue and total operational cost across all vehicles and sum acquisition costs.
    const allVehicles = await Vehicle.find({});
    const totalAcquisitionCost = allVehicles.reduce((sum, v) => sum + v.acquisitionCost, 0);
    vehicleROI = totalAcquisitionCost > 0 ? (totalRevenue - totalOperationalCost) / totalAcquisitionCost : 0;
  }

  return {
    totalDistance,
    totalFuelLiters,
    fuelEfficiency: Math.round(fuelEfficiency * 100) / 100,
    totalRevenue,
    totalOperationalCost: Math.round(totalOperationalCost * 100) / 100,
    vehicleROI: Math.round(vehicleROI * 100) / 100,
    // breakdown
    totalFuelCost,
    totalExpense,
    totalMaintenance,
  };
};

/**
 * export analytics as CSV
 * same as getAnalytics
 * CSV string
 */
export const generateAnalyticsCSV = async (filters = {}) => {
  const analytics = await getAnalytics(filters);

  // build CSV rows – we can also include per-vehicle breakdown if needed
  const rows = [
    ['Metric', 'Value'],
    ['Total Distance (km)', analytics.totalDistance],
    ['Total Fuel (liters)', analytics.totalFuelLiters],
    ['Fuel Efficiency (km/l)', analytics.fuelEfficiency],
    ['Total Revenue', analytics.totalRevenue],
    ['Total Operational Cost', analytics.totalOperationalCost],
    ['Fuel Cost', analytics.totalFuelCost],
    ['Expenses', analytics.totalExpense],
    ['Maintenance Cost', analytics.totalMaintenance],
    ['Vehicle ROI', analytics.vehicleROI],
  ];

  // convert to CSV string
  const csvContent = rows.map(row => row.join(',')).join('\n');
  return csvContent;
};