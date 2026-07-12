import React from 'react';
import { Truck, Plus, CheckCircle, AlertTriangle } from 'lucide-react';

const VehicleList = () => {
  const vehicles = [
    { id: 'V-101', name: 'Heavy Duty Hauler', type: 'Semi-Truck', status: 'Active', fuel: '84%' },
    { id: 'V-102', name: 'City Delivery Van', type: 'EV Van', status: 'Maintenance', fuel: '22%' },
    { id: 'V-103', name: 'Express Carrier', type: 'Box Truck', status: 'Active', fuel: '95%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Vehicle Inventory</h1>
          <p className="text-xs text-slate-500">Manage and monitor live fleet configurations.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition">
          <Plus size={16} /> Register Vehicle
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
              <th className="p-4">ID</th>
              <th className="p-4">Asset Detail</th>
              <th className="p-4">Classification</th>
              <th className="p-4">Energy / Fuel</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50/50 transition">
                <td className="p-4 font-mono font-bold text-indigo-600">{v.id}</td>
                <td className="p-4 font-semibold text-slate-900">{v.name}</td>
                <td className="p-4">{v.type}</td>
                <td className="p-4">{v.fuel}</td>
                <td className="p-4 text-right">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wide ${
                    v.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {v.status === 'Active' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                    {v.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VehicleList;