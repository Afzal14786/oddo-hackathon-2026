import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { maintenanceApi, vehiclesApi } from "../../api";
import StatusBadge from "../../components/StatusBadge";
import ConfirmDialog from "../../components/ConfirmDialog";
import MaintenanceForm from "./MaintenanceForm";

const MaintenanceList = () => {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    vehicleId: "",
    closed: "",
    type: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [closingId, setClosingId] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.vehicleId) params.vehicleId = filters.vehicleId;
      if (filters.closed !== "") params.closed = filters.closed === "true";
      if (filters.type) params.type = filters.type;
      if (search) params.search = search;

      const res = await maintenanceApi.getMaintenance(params);
      setLogs(res.data.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch maintenance logs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await vehiclesApi.getVehicles();
      setVehicles(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchVehicles();
  }, [filters]);

  const handleCreate = async (data) => {
    await maintenanceApi.createMaintenance(data);
    fetchLogs();
  };

  const handleUpdate = async (data) => {
    await maintenanceApi.updateMaintenance(editingLog._id, data);
    fetchLogs();
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await maintenanceApi.deleteMaintenance(deletingId);
      fetchLogs();
      setDeletingId(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleClose = async () => {
    if (!closingId) return;
    try {
      await maintenanceApi.closeMaintenance(closingId);
      fetchLogs();
      setClosingId(null);
    } catch (err) {
      alert(err.message || "Failed to close maintenance record");
    }
  };

  const handleSearch = () => {
    fetchLogs();
  };

  const clearFilters = () => {
    setFilters({ vehicleId: "", closed: "", type: "" });
    setSearch("");
  };

  const hasActiveFilters =
    search || filters.vehicleId || filters.closed !== "" || filters.type;

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance</h1>
          <p className="text-sm text-gray-500">
            Manage vehicle maintenance logs
          </p>
        </div>
        <button
          onClick={() => {
            setEditingLog(null);
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm font-medium whitespace-nowrap"
        >
          <Plus size={18} /> Add Maintenance
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-3">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by description..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
            <div className="flex-1 min-w-[130px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Vehicle
              </label>
              <select
                value={filters.vehicleId}
                onChange={(e) =>
                  setFilters({ ...filters, vehicleId: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="">All Vehicles</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.registrationNumber} - {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.closed}
                onChange={(e) =>
                  setFilters({ ...filters, closed: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="">All</option>
                <option value="false">Active</option>
                <option value="true">Closed</option>
              </select>
            </div>

            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              >
                <option value="">All Types</option>
                <option value="oil_change">Oil Change</option>
                <option value="tyre_replacement">Tyre Replacement</option>
                <option value="brake_service">Brake Service</option>
                <option value="engine_repair">Engine Repair</option>
                <option value="general_service">General Service</option>
                <option value="other">Other</option>
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
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No maintenance records found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Vehicle
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cost
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {log.vehicleId?.registrationNumber || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize whitespace-nowrap">
                      {log.type.replace("_", " ")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                      {log.description || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      ₹{log.cost.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {log.closed ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Closed
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit – only if not closed */}
                        {!log.closed && (
                          <>
                            <button
                              onClick={() => {
                                setEditingLog(log);
                                setShowForm(true);
                              }}
                              className="p-1 text-gray-400 hover:text-indigo-600 transition"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => setClosingId(log._id)}
                              className="p-1 text-green-600 hover:text-green-800 transition"
                              title="Close"
                            >
                              <CheckCircle size={16} />
                            </button>
                          </>
                        )}

                        {/* Delete – only if not closed */}
                        {!log.closed && (
                          <button
                            onClick={() => setDeletingId(log._id)}
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

      {/* Forms and Dialogs */}
      <MaintenanceForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingLog(null);
        }}
        onSubmit={editingLog ? handleUpdate : handleCreate}
        initialData={editingLog}
        title={editingLog ? "Edit Maintenance Log" : "Add Maintenance Log"}
        vehicles={vehicles}
      />

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Maintenance Log"
        message="Are you sure you want to delete this maintenance log? This action cannot be undone."
      />

      <ConfirmDialog
        isOpen={!!closingId}
        onClose={() => setClosingId(null)}
        onConfirm={handleClose}
        title="Close Maintenance Log"
        message="Closing this maintenance log will restore the vehicle to 'Available' status (unless retired)."
        confirmText="Close"
      />
    </div>
  );
};

export default MaintenanceList;
