import React, { useState } from 'react';
import { Truck, Plus, CheckCircle, AlertTriangle, X } from 'lucide-react';

const VehicleList = () => {
  // 1. Core State Hooks
  const [vehicles, setVehicles] = useState([
    { id: 'V-101', name: 'Heavy Duty Hauler', type: 'Semi-Truck', status: 'Active', fuel: '84%' },
    { id: 'V-102', name: 'City Delivery Van', type: 'EV Van', status: 'Maintenance', fuel: '22%' },
    { id: 'V-103', name: 'Express Carrier', type: 'Box Truck', status: 'Active', fuel: '95%' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    type: 'Semi-Truck',
    fuel: '',
    status: 'Active'
  });

  // 2. Event Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Quick validation checks
    if (!newVehicle.name || !newVehicle.fuel) return alert('Please fill in all layout fields.');

    // Generate a new dynamic sequential tracking ID
    const nextId = `V-${100 + vehicles.length + 1}`;
    
    const assetToAppend = {
      id: nextId,
      name: newVehicle.name,
      type: newVehicle.type,
      fuel: `${newVehicle.fuel.replace('%', '')}%`, // Ensure string formatting matches
      status: newVehicle.status
    };

    // Update state matrices
    setVehicles([...vehicles, assetToAppend]);
    
    // Clear registration context form & close panel
    setNewVehicle({ name: '', type: 'Semi-Truck', fuel: '', status: 'Active' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 relative">
      {/* Header Panel Node */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Vehicle Inventory</h1>
          <p className="text-xs text-slate-500">Manage and monitor live fleet configurations.</p>
        </div>
        
        {/* Wire click listener to open state window */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition cursor-pointer shadow-sm shadow-indigo-600/10"
        >
          <Plus size={16} /> Register Vehicle
        </button>
      </div>

      {/* Main Inventory Ledger Grid Card */}
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

      {/* Interactive Overlay Slide-Out Registration Panel */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-right duration-200 border-l border-slate-100">
            <div>
              {/* Form Heading Context */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
                    <Truck size={16} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Register Fleet Asset</h3>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Data Input Form Fields */}
              <form onSubmit={handleSubmit} id="assetForm" className="mt-6 space-y-4 text-xs font-semibold text-slate-700">
                <div className="space-y-1.5">
                  <label className="block text-slate-500">Asset Title / Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={newVehicle.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Long-haul Transporter" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-medium placeholder:text-slate-300 transition" 
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-500">Classification Type</label>
                  <select 
                    name="type"
                    value={newVehicle.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-medium bg-white cursor-pointer transition"
                  >
                    <option value="Semi-Truck">Semi-Truck</option>
                    <option value="EV Van">EV Van</option>
                    <option value="Box Truck">Box Truck</option>
                    <option value="Flatbed">Flatbed</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-500">Starting Energy / Fuel (%)</label>
                  <input 
                    type="number" 
                    name="fuel"
                    min="0"
                    max="100"
                    value={newVehicle.fuel}
                    onChange={handleInputChange}
                    placeholder="e.g. 90" 
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-medium placeholder:text-slate-300 transition" 
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-500">Operational Dispatch Status</label>
                  <select 
                    name="status"
                    value={newVehicle.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 font-medium bg-white cursor-pointer transition"
                  >
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </form>
            </div>

            {/* CTA Execution Group */}
            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-2 px-4 rounded-xl text-center cursor-pointer transition"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="assetForm"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl text-center cursor-pointer shadow-xs transition"
              >
                Save Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleList;