
import React, { useState } from 'react';
import { Route, AlertCircle, CheckCircle2 } from 'lucide-react';

const TripForm = () => {
    // Mock records matching available fleet registry options
    const vehiclesList = [
        { id: 1, tag: 'VAN-05', max_load: 500 },
        { id: 2, tag: 'TRK-11', max_load: 12000 }
    ];

    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [cargoWeight, setCargoWeight] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const vehicleObj = vehiclesList.find(v => v.tag === selectedVehicle);
        
        if (!vehicleObj) {
            setError('Please assign a vehicle asset to this trip schedule.');
            return;
        }

        // Operational Constraint Validation Rule Check
        if (parseFloat(cargoWeight) > vehicleObj.max_load) {
            setError(`Overweight Hazard! Selected vehicle ${vehicleObj.tag} caps out at a maximum cargo volume of ${vehicleObj.max_load} kg.`);
            return;
        }

        setSuccess(`Dispatch Ticket Authorization Complete! Trip successfully committed for asset ${vehicleObj.tag}.`);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Dispatch Routing Log</h1>
                <p className="text-slate-500">Log automated route planning missions with smart weight threshold validation safeguards.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    {error && (
                        <div className="p-4 rounded-lg bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-700 text-sm font-medium animate-pulse">
                            <AlertCircle size={18} className="shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-emerald-700 text-sm font-medium">
                            <CheckCircle2 size={18} className="shrink-0" />
                            <p>{success}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assign Fleet Asset</label>
                        <select 
                            value={selectedVehicle} 
                            onChange={(e) => setSelectedVehicle(e.target.value)}
                            className="w-full border border-slate-200 p-2.5 rounded-lg text-sm bg-white"
                        >
                            <option value="">-- Choose Truck/Van Asset --</option>
                            {vehiclesList.map(v => (
                                <option key={v.id} value={v.tag}>{v.tag} (Limit: {v.max_load} kg)</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Cargo Weight Mass Load (kg)</label>
                        <input 
                            type="number" 
                            placeholder="e.g. 450" 
                            value={cargoWeight}
                            onChange={(e) => setCargoWeight(e.target.value)}
                            className="w-full border border-slate-200 p-2.5 rounded-lg text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Origin Node Address</label>
                            <input type="text" placeholder="Warehouse Hub A" className="w-full border border-slate-200 p-2.5 rounded-lg text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Destination Target Node</label>
                            <input type="text" placeholder="Distribution Point B" className="w-full border border-slate-200 p-2.5 rounded-lg text-sm" />
                        </div>
                    </div>

                    <button type="submit" className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-lg transition text-sm shadow-sm shadow-indigo-600/10">
                        <Route size={16} /> Authorize & Dispatch Manifest
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TripForm;