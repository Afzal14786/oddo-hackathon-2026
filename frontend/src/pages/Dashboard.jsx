// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Truck, Users, AlertTriangle, TrendingUp, DollarSign, 
  Activity, Clock, RefreshCw, Filter, X 
} from 'lucide-react';
import { reportsApi } from '../api';

const Dashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ type: '', status: '', region: '' });
  const [showFilters, setShowFilters] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      if (filters.region) params.region = filters.region;

      const res = await reportsApi.getDashboard(params);
      setKpis(res.data.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [filters]);

  const clearFilters = () => {
    setFilters({ type: '', status: '', region: '' });
  };

  const hasActiveFilters = filters.type || filters.status || filters.region;

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString('en-IN');
  };

  // Build KPI cards from real data
  const kpiCards = kpis ? [
    {
      title: 'Active Vehicles',
      value: formatNumber(kpis.activeVehicles),
      change: `${formatNumber(kpis.activeVehicles)} operational`,
      icon: <Truck className="text-indigo-600" size={24} />,
      bg: 'bg-indigo-50',
    },
    {
      title: 'Available Vehicles',
      value: formatNumber(kpis.availableVehicles),
      change: 'Ready for dispatch',
      icon: <Activity className="text-emerald-600" size={24} />,
      bg: 'bg-emerald-50',
    },
    {
      title: 'In Maintenance',
      value: formatNumber(kpis.inMaintenance),
      change: 'Under service',
      icon: <AlertTriangle className="text-amber-600" size={24} />,
      bg: 'bg-amber-50',
    },
    {
      title: 'Active Trips',
      value: formatNumber(kpis.activeTrips),
      change: `${formatNumber(kpis.activeTrips)} in progress`,
      icon: <TrendingUp className="text-blue-600" size={24} />,
      bg: 'bg-blue-50',
    },
    {
      title: 'Pending Trips',
      value: formatNumber(kpis.pendingTrips),
      change: 'Awaiting dispatch',
      icon: <Clock className="text-purple-600" size={24} />,
      bg: 'bg-purple-50',
    },
    {
      title: 'Drivers On Duty',
      value: formatNumber(kpis.driversOnDuty),
      change: 'Available or on trip',
      icon: <Users className="text-cyan-600" size={24} />,
      bg: 'bg-cyan-50',
    },
    {
      title: 'Fleet Utilization',
      value: `${kpis.fleetUtilization || 0}%`,
      change: 'Of active fleet',
      icon: <DollarSign className="text-rose-600" size={24} />,
      bg: 'bg-rose-50',
    },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Real-time fleet operations overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            <Filter size={16} /> Filters {hasActiveFilters && <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>}
          </button>
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">Vehicle Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="">All Types</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
                <option value="bus">Bus</option>
                <option value="car">Car</option>
                <option value="motorcycle">Motorcycle</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="on_trip">On Trip</option>
                <option value="in_shop">In Shop</option>
                <option value="retired">Retired</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">Region</label>
              <input
                type="text"
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                placeholder="e.g., North"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition whitespace-nowrap"
              >
                <X size={14} /> Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* KPIs Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw size={32} className="animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl border border-red-200 p-6">
          <p>{error}</p>
          <button
            onClick={fetchDashboard}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      ) : kpis ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {kpiCards.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex items-start justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {stat.title}
                </span>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                  {stat.value}
                </h3>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <TrendingUp size={12} className="text-emerald-500" />
                  {stat.change}
                </span>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">No data available</div>
      )}

      {/* Additional Widgets */}
      {kpis && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Recent Activity</h3>
              <span className="text-xs text-gray-400">Last 7 days</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• {kpis.activeTrips} trips currently in progress</p>
              <p>• {kpis.pendingTrips} trips awaiting dispatch</p>
              <p>• Fleet utilization: {kpis.fleetUtilization}%</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Summary</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Active Fleet:</span>
                <span className="font-medium">{kpis.activeVehicles}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Drivers On Duty:</span>
                <span className="font-medium">{kpis.driversOnDuty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">In Maintenance:</span>
                <span className="font-medium">{kpis.inMaintenance}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;