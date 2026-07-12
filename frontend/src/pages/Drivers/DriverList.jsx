import React from 'react';
import { Users, UserPlus, ShieldCheck } from 'lucide-react';

const DriverList = () => {
  const drivers = [
    { id: 'D-401', name: 'Alex Mercer', license: 'Class A CDL', rating: '4.9', status: 'On Route' },
    { id: 'D-402', name: 'Sarah Connor', license: 'Class B CDL', rating: '4.8', status: 'Available' },
    { id: 'D-403', name: 'Marcus Wright', license: 'Class A CDL', rating: '4.7', status: 'Standby' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Operator Directory</h1>
          <p className="text-xs text-slate-500">Track credential checks and dynamic manifests.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition">
          <UserPlus size={16} /> Onboard Driver
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {drivers.map((d) => (
          <div key={d.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">{d.name}</h3>
                <p className="text-slate-400 font-mono text-[11px]">{d.id}</p>
              </div>
              <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-md ${
                d.status === 'On Route' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
              }`}>{d.status}</span>
            </div>
            <div className="pt-2 border-t border-slate-50 flex justify-between items-center text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-slate-400" /> {d.license}</span>
              <span className="font-bold text-amber-500">⭐ {d.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverList;