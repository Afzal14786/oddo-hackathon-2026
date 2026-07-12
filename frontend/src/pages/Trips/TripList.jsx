import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, RefreshCw, X, 
  Play, CheckCircle, XCircle, Eye 
} from 'lucide-react';
import { tripsApi, vehiclesApi, driversApi } from '../../api';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import TripForm from './TripForm';
import CompleteTripModal from './CompleteTripModal';

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', vehicleId: '', driverId: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [completingTrip, setCompletingTrip] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Fetch trips
  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (filters.status) params.status = filters.status;
      if (filters.vehicleId) params.vehicleId = filters.vehicleId;
      if (filters.driverId) params.driverId = filters.driverId;

      const res = await tripsApi.getTrips(params);
      setTrips(res.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch trips');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch vehicles and drivers for dropdowns
  const fetchOptions = async () => {
    try {
      const [vehiclesRes, driversRes] = await Promise.all([
        vehiclesApi.getVehicles({ status: 'available' }),
        driversApi.getDrivers({ status: 'available' }),
      ]);
      setVehicles(vehiclesRes.data.data || []);
      setDrivers(driversRes.data.data || []);
    } catch (err) {
      console.error('Failed to fetch options:', err);
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchOptions();
  }, [filters]);

  const handleCreate = async (data) => {
    await tripsApi.createTrip(data);
    fetchTrips();
  };

  const handleUpdate = async (data) => {
    await tripsApi.updateTrip(editingTrip._id, data);
    fetchTrips();
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await tripsApi.deleteTrip(deletingId);
      fetchTrips();
      setDeletingId(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleDispatch = async (id) => {
    if (!window.confirm('Dispatch this trip? This will set vehicle and driver to On Trip.')) return;
    try {
      await tripsApi.dispatchTrip(id);
      fetchTrips();
    } catch (err) {
      alert(err.message || 'Failed to dispatch trip');
    }
  };

  const handleComplete = async (data) => {
    try {
      await tripsApi.completeTrip(completingTrip._id, data);
      fetchTrips();
      setShowCompleteModal(false);
      setCompletingTrip(null);
    } catch (err) {
      alert(err.message || 'Failed to complete trip');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this trip? This will restore vehicle and driver statuses.')) return;
    try {
      await tripsApi.cancelTrip(id);
      fetchTrips();
    } catch (err) {
      alert(err.message || 'Failed to cancel trip');
    }
  };

  const handleSearch = () => {
    fetchTrips();
  };

  const clearFilters = () => {
    setFilters({ status: '', vehicleId: '', driverId: '' });
    setSearch('');
  };

  const hasActiveFilters = search || filters.status || filters.vehicleId || filters.driverId;

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trips</h1>
          <p className="text-sm text-gray-500">Manage dispatch and trips</p>
        </div>
        <button
          onClick={() => {
            setEditingTrip(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm font-medium whitespace-nowrap"
        >
          <Plus size={18} /> Create Trip
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
                placeholder="Search by source, destination..."
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
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="dispatched">Dispatched</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">Vehicle</label>
              <select
                value={filters.vehicleId}
                onChange={(e) => setFilters({ ...filters, vehicleId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="">All Vehicles</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>{v.registrationNumber}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">Driver</label>
              <select
                value={filters.driverId}
                onChange={(e) => setFilters({ ...filters, driverId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="">All Drivers</option>
                {drivers.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
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
        ) : trips.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No trips found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cargo (kg)</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Planned</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {trips.map((trip) => (
                  <tr key={trip._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{trip.source}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{trip.destination}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{trip.cargoWeight}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {trip.vehicleId?.registrationNumber || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {trip.driverId?.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={trip.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{trip.plannedDistance} km</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit – only draft */}
                        {trip.status === 'draft' && (
                          <button
                            onClick={() => {
                              setEditingTrip(trip);
                              setShowForm(true);
                            }}
                            className="p-1 text-gray-400 hover:text-indigo-600 transition"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}

                        {/* Dispatch – only draft */}
                        {trip.status === 'draft' && (
                          <button
                            onClick={() => handleDispatch(trip._id)}
                            className="p-1 text-green-600 hover:text-green-800 transition"
                            title="Dispatch"
                          >
                            <Play size={16} />
                          </button>
                        )}

                        {/* Complete – only dispatched */}
                        {trip.status === 'dispatched' && (
                          <button
                            onClick={() => {
                              setCompletingTrip(trip);
                              setShowCompleteModal(true);
                            }}
                            className="p-1 text-blue-600 hover:text-blue-800 transition"
                            title="Complete"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}

                        {/* Cancel – draft or dispatched */}
                        {(trip.status === 'draft' || trip.status === 'dispatched') && (
                          <button
                            onClick={() => handleCancel(trip._id)}
                            className="p-1 text-red-500 hover:text-red-700 transition"
                            title="Cancel"
                          >
                            <XCircle size={16} />
                          </button>
                        )}

                        {/* Delete – only draft */}
                        {trip.status === 'draft' && (
                          <button
                            onClick={() => setDeletingId(trip._id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Forms and Modals */}
      <TripForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingTrip(null);
        }}
        onSubmit={editingTrip ? handleUpdate : handleCreate}
        initialData={editingTrip}
        title={editingTrip ? 'Edit Trip' : 'Create Trip'}
        vehicles={vehicles}
        drivers={drivers}
      />

      <CompleteTripModal
        isOpen={showCompleteModal}
        onClose={() => {
          setShowCompleteModal(false);
          setCompletingTrip(null);
        }}
        onSubmit={handleComplete}
        trip={completingTrip}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Trip"
        message="Are you sure you want to delete this draft trip? This action cannot be undone."
      />
    </div>
  );
};

export default TripList;