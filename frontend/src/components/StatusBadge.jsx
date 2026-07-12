import React from 'react';

const statusColors = {
  // vehicle/driver statuses
  available: 'bg-green-100 text-green-800',
  on_trip: 'bg-blue-100 text-blue-800',
  in_shop: 'bg-yellow-100 text-yellow-800',
  retired: 'bg-gray-100 text-gray-800',
  off_duty: 'bg-gray-100 text-gray-800',
  suspended: 'bg-red-100 text-red-800',
  // trip statuses
  draft: 'bg-gray-100 text-gray-800',
  dispatched: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const StatusBadge = ({ status }) => {
  const color = statusColors[status] || 'bg-gray-100 text-gray-800';
  const label = status ? status.replace('_', ' ') : 'Unknown';
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
      {label}
    </span>
  );
};

export default StatusBadge;