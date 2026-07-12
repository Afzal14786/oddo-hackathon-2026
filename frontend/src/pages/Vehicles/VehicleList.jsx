// src/pages/Vehicles/VehicleList.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, RefreshCw, X } from 'lucide-react';
import { vehiclesApi } from '../../api';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import VehicleForm from './VehicleForm';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ type: '', status: '', region: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      if (filters.region) params.region = filters.region;

      const res = await vehiclesApi.getVehicles(params);
      setVehicles(res.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch vehicles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  const handleCreate = async (data) => {
    await vehiclesApi.createVehicle(data);
    fetchVehicles();
  };

  const handleUpdate = async (data) => {
    await vehiclesApi.updateVehicle(editingVehicle._id, data);
    fetchVehicles();
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await vehiclesApi.deleteVehicle(deletingId);
      fetchVehicles();
      setDeletingId(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSearch = () => {
    fetchVehicles();
  };

  const clearFilters = () => {
    setFilters({ type: '', status: '', region: '' });
    setSearch('');
  };

  const hasActiveFilters = search || filters.type || filters.status || filters.region;

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-sm text-gray-500">Manage your fleet vehicles</p>
        </div>
        <button
          onClick={() => {
            setEditingVehicle(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm font-medium whitespace-nowrap"
        >
          <Plus size={18} /> Add Vehicle
        </button>
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
                placeholder="Search by name, reg, model..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                <Search size={18} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3 flex-1">
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
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

            <div className="flex-1 min-w-[120px]">
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

            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">Region</label>
              <input
                type="text"
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                placeholder="Region"
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw size={24} className="animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No vehicles found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reg No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {vehicle.registrationNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{vehicle.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{vehicle.model}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize whitespace-nowrap">{vehicle.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{vehicle.maxLoadCapacity}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={vehicle.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{vehicle.region || '-'}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingVehicle(vehicle);
                            setShowForm(true);
                          }}
                          className="p-1 text-gray-400 hover:text-indigo-600 transition"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeletingId(vehicle._id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Forms and Dialogs */}
      <VehicleForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingVehicle(null);
        }}
        onSubmit={editingVehicle ? handleUpdate : handleCreate}
        initialData={editingVehicle}
        title={editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle? This action cannot be undone."
      />
    </div>
  );
};

export default VehicleList;