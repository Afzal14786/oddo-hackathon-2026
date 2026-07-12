import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, RefreshCw, X, AlertCircle } from 'lucide-react';
import { driversApi } from '../../api';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import DriverForm from './DriverForm';

const DriverList = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', licenseExpirySoon: false });
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchDrivers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (filters.status) params.status = filters.status;
      if (filters.licenseExpirySoon) params.licenseExpirySoon = true;

      const res = await driversApi.getDrivers(params);
      setDrivers(res.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch drivers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [filters]);

  const handleCreate = async (data) => {
    await driversApi.createDriver(data);
    fetchDrivers();
  };

  const handleUpdate = async (data) => {
    await driversApi.updateDriver(editingDriver._id, data);
    fetchDrivers();
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await driversApi.deleteDriver(deletingId);
      fetchDrivers();
      setDeletingId(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSearch = () => {
    fetchDrivers();
  };

  const clearFilters = () => {
    setFilters({ status: '', licenseExpirySoon: false });
    setSearch('');
  };

  const hasActiveFilters = search || filters.status || filters.licenseExpirySoon;

  const isLicenseExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 30 && diffDays > 0;
  };

  const isLicenseExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Drivers</h1>
          <p className="text-sm text-gray-500">Manage your drivers and licenses</p>
        </div>
        <button
          onClick={() => {
            setEditingDriver(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm font-medium whitespace-nowrap"
        >
          <Plus size={18} /> Add Driver
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
                placeholder="Search by name or license..."
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
                <option value="available">Available</option>
                <option value="on_trip">On Trip</option>
                <option value="off_duty">Off Duty</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">License</label>
              <select
                value={filters.licenseExpirySoon ? 'true' : ''}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  licenseExpirySoon: e.target.value === 'true' 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="">All Licenses</option>
                <option value="true">Expiring Soon (30 days)</option>
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
        ) : drivers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No drivers found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">License</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Safety Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {drivers.map((driver) => {
                  const expiringSoon = isLicenseExpiringSoon(driver.licenseExpiryDate);
                  const expired = isLicenseExpired(driver.licenseExpiryDate);
                  
                  return (
                    <tr key={driver._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {driver.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {driver.licenseNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {driver.licenseCategory}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-gray-600">
                            {new Date(driver.licenseExpiryDate).toLocaleDateString()}
                          </span>
                          {expired && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                              <AlertCircle size={12} /> Expired
                            </span>
                          )}
                          {!expired && expiringSoon && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                              <AlertCircle size={12} /> Expiring Soon
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {driver.contactNumber}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          driver.safetyScore >= 80 ? 'text-green-600' :
                          driver.safetyScore >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {driver.safetyScore}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <StatusBadge status={driver.status} />
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingDriver(driver);
                              setShowForm(true);
                            }}
                            className="p-1 text-gray-400 hover:text-indigo-600 transition"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => setDeletingId(driver._id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Forms and Dialogs */}
      <DriverForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingDriver(null);
        }}
        onSubmit={editingDriver ? handleUpdate : handleCreate}
        initialData={editingDriver}
        title={editingDriver ? 'Edit Driver' : 'Add Driver'}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Driver"
        message="Are you sure you want to delete this driver? This action cannot be undone."
      />
    </div>
  );
};

export default DriverList;