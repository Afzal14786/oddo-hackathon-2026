// src/pages/Finance/FinanceLogs.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, RefreshCw, X } from 'lucide-react';
import { fuelApi, vehiclesApi, tripsApi } from '../../api';
import ConfirmDialog from '../../components/ConfirmDialog';
import FuelLogForm from './FuelLogForm';
import ExpenseForm from './ExpenseForm';

const FinanceLogs = () => {
  const [activeTab, setActiveTab] = useState('fuel');
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ vehicleId: '', tripId: '', type: '' });
  const [showFuelForm, setShowFuelForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingFuel, setEditingFuel] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingType, setDeletingType] = useState(null);

  // Fetch functions
  const fetchFuelLogs = async () => {
    try {
      const params = {};
      if (filters.vehicleId) params.vehicleId = filters.vehicleId;
      if (filters.tripId) params.tripId = filters.tripId;
      if (search) params.search = search;
      const res = await fuelApi.getFuelLogs(params);
      setFuelLogs(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch fuel logs:', err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const params = {};
      if (filters.vehicleId) params.vehicleId = filters.vehicleId;
      if (filters.tripId) params.tripId = filters.tripId;
      if (filters.type) params.type = filters.type;
      if (search) params.search = search;
      const res = await fuelApi.getExpenses(params);
      setExpenses(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    }
  };

  const fetchOptions = async () => {
    try {
      const [vehiclesRes, tripsRes] = await Promise.all([
        vehiclesApi.getVehicles(),
        tripsApi.getTrips(),
      ]);
      setVehicles(vehiclesRes.data.data || []);
      setTrips(tripsRes.data.data || []);
    } catch (err) {
      console.error('Failed to fetch options:', err);
    }
  };

  const fetchAll = () => {
    setLoading(true);
    setError(null);
    Promise.all([fetchFuelLogs(), fetchExpenses()])
      .catch(err => setError(err.message || 'Failed to fetch data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
    fetchOptions();
  }, [filters]);

  // CRUD handlers
  const handleFuelCreate = async (data) => {
    await fuelApi.createFuelLog(data);
    fetchFuelLogs();
  };

  const handleFuelUpdate = async (data) => {
    await fuelApi.updateFuelLog(editingFuel._id, data);
    fetchFuelLogs();
  };

  const handleFuelDelete = async () => {
    if (!deletingId || deletingType !== 'fuel') return;
    try {
      await fuelApi.deleteFuelLog(deletingId);
      fetchFuelLogs();
      setDeletingId(null);
      setDeletingType(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleExpenseCreate = async (data) => {
    await fuelApi.createExpense(data);
    fetchExpenses();
  };

  const handleExpenseUpdate = async (data) => {
    await fuelApi.updateExpense(editingExpense._id, data);
    fetchExpenses();
  };

  const handleExpenseDelete = async () => {
    if (!deletingId || deletingType !== 'expense') return;
    try {
      await fuelApi.deleteExpense(deletingId);
      fetchExpenses();
      setDeletingId(null);
      setDeletingType(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const clearFilters = () => {
    setFilters({ vehicleId: '', tripId: '', type: '' });
    setSearch('');
  };

  const hasActiveFilters = search || filters.vehicleId || filters.tripId || filters.type;

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance & Operations</h1>
          <p className="text-sm text-gray-500">Track fuel logs and expenses</p>
        </div>
        <button
          onClick={() => {
            if (activeTab === 'fuel') {
              setEditingFuel(null);
              setShowFuelForm(true);
            } else {
              setEditingExpense(null);
              setShowExpenseForm(true);
            }
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm font-medium whitespace-nowrap"
        >
          <Plus size={18} /> Add {activeTab === 'fuel' ? 'Fuel Log' : 'Expense'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab('fuel')}
            className={`py-2 px-1 text-sm font-medium border-b-2 transition ${
              activeTab === 'fuel'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Fuel Logs
          </button>
          <button
            onClick={() => setActiveTab('expense')}
            className={`py-2 px-1 text-sm font-medium border-b-2 transition ${
              activeTab === 'expense'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Expenses
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-3">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                onKeyDown={(e) => e.key === 'Enter' && fetchAll()}
              />
              <button
                onClick={fetchAll}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                <Search size={18} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3 flex-1">
            <div className="flex-1 min-w-[130px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">Vehicle</label>
              <select
                value={filters.vehicleId}
                onChange={(e) => setFilters({ ...filters, vehicleId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="">All Vehicles</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.registrationNumber}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[130px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">Trip</label>
              <select
                value={filters.tripId}
                onChange={(e) => setFilters({ ...filters, tripId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="">All Trips</option>
                {trips.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.source} → {t.destination}
                  </option>
                ))}
              </select>
            </div>

            {activeTab === 'expense' && (
              <div className="flex-1 min-w-[120px]">
                <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                >
                  <option value="">All Types</option>
                  <option value="toll">Toll</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="repair">Repair</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}

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
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw size={24} className="animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <>
            {activeTab === 'fuel' && (
              <>
                {fuelLogs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">No fuel logs found</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trip</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liters</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost (₹)</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {fuelLogs.map((log) => (
                          <tr key={log._id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                              {log.vehicleId?.registrationNumber || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                              {log.tripId ? `${log.tripId.source} → ${log.tripId.destination}` : '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{log.liters}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                              ₹{log.cost.toLocaleString('en-IN')}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                              {new Date(log.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setEditingFuel(log);
                                  setShowFuelForm(true);
                                }}
                                className="p-1 text-gray-400 hover:text-indigo-600 transition"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setDeletingId(log._id);
                                  setDeletingType('fuel');
                                }}
                                className="p-1 text-gray-400 hover:text-red-600 transition ml-2"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {activeTab === 'expense' && (
              <>
                {expenses.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">No expenses found</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trip</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount (₹)</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {expenses.map((exp) => (
                          <tr key={exp._id} className="hover:bg-gray-50 transition">
                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                              {exp.vehicleId?.registrationNumber || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                              {exp.tripId ? `${exp.tripId.source} → ${exp.tripId.destination}` : '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 capitalize whitespace-nowrap">
                              {exp.type}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                              ₹{exp.amount.toLocaleString('en-IN')}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                              {exp.description || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                              {new Date(exp.date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setEditingExpense(exp);
                                  setShowExpenseForm(true);
                                }}
                                className="p-1 text-gray-400 hover:text-indigo-600 transition"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setDeletingId(exp._id);
                                  setDeletingType('expense');
                                }}
                                className="p-1 text-gray-400 hover:text-red-600 transition ml-2"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Forms and Dialogs */}
      <FuelLogForm
        isOpen={showFuelForm}
        onClose={() => {
          setShowFuelForm(false);
          setEditingFuel(null);
        }}
        onSubmit={editingFuel ? handleFuelUpdate : handleFuelCreate}
        initialData={editingFuel}
        title={editingFuel ? 'Edit Fuel Log' : 'Add Fuel Log'}
        vehicles={vehicles}
        trips={trips}
      />

      <ExpenseForm
        isOpen={showExpenseForm}
        onClose={() => {
          setShowExpenseForm(false);
          setEditingExpense(null);
        }}
        onSubmit={editingExpense ? handleExpenseUpdate : handleExpenseCreate}
        initialData={editingExpense}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
        vehicles={vehicles}
        trips={trips}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => {
          setDeletingId(null);
          setDeletingType(null);
        }}
        onConfirm={deletingType === 'fuel' ? handleFuelDelete : handleExpenseDelete}
        title={`Delete ${deletingType === 'fuel' ? 'Fuel Log' : 'Expense'}`}
        message={`Are you sure you want to delete this ${deletingType === 'fuel' ? 'fuel log' : 'expense'}? This action cannot be undone.`}
      />
    </div>
  );
};

export default FinanceLogs;