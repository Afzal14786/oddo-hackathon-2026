import React, { useState } from 'react';

const CompleteTripModal = ({ isOpen, onClose, onSubmit, trip }) => {
  const [formData, setFormData] = useState({
    actualDistance: '',
    fuelConsumed: '',
    revenue: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!isOpen || !trip) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.actualDistance || formData.actualDistance <= 0) {
      newErrors.actualDistance = 'Actual distance must be positive';
    }
    if (!formData.fuelConsumed || formData.fuelConsumed <= 0) {
      newErrors.fuelConsumed = 'Fuel consumed must be positive';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to complete trip' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Complete Trip</h3>
        <p className="text-sm text-gray-600 mb-4">
          Trip: {trip.source} → {trip.destination}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Actual Distance (km) *
            </label>
            <input
              type="number"
              name="actualDistance"
              value={formData.actualDistance}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="115"
              min="0"
              step="0.01"
            />
            {errors.actualDistance && <p className="text-red-500 text-xs mt-1">{errors.actualDistance}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Consumed (liters) *
            </label>
            <input
              type="number"
              name="fuelConsumed"
              value={formData.fuelConsumed}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="18"
              min="0"
              step="0.01"
            />
            {errors.fuelConsumed && <p className="text-red-500 text-xs mt-1">{errors.fuelConsumed}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Revenue (optional)
            </label>
            <input
              type="number"
              name="revenue"
              value={formData.revenue}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="520"
              min="0"
              step="0.01"
            />
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Completing...' : 'Complete Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteTripModal;