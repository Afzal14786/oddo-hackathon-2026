import React from 'react';
import { Wrench, ShieldAlert, Clock } from 'lucide-react';

const Maintenance = () => {
  const tasks = [
    { target: 'V-102 (City Delivery Van)', issue: 'Brake Pad Replacement Needed', urgency: 'Critical', cost: '$320' },
    { target: 'V-101 (Heavy Duty Hauler)', issue: 'Routine 15k Mile Oil Matrix Update', urgency: 'Scheduled', cost: '$150' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Maintenance Diagnostics</h1>
        <p className="text-xs text-slate-500">Schedule mechanical overhauls and fault handling metrics.</p>
      </div>

      <div className="space-y-3">
        {tasks.map((task, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl shrink-0 ${task.urgency === 'Critical' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                <Wrench size={18} />
              </div>
              <div className="space-y-1">
                <span className="font-mono font-bold text-indigo-600 block">{task.target}</span>
                <p className="font-bold text-slate-900 text-sm">{task.issue}</p>
                <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                  <Clock size={12} /> Pending mechanical bay dispatch
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-6 sm:text-right font-medium">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Est Cost</span>
                <span className="text-slate-900 font-bold font-mono">{task.cost}</span>
              </div>
              <span className={`font-extrabold uppercase tracking-wider text-[10px] px-2.5 py-1 rounded-md ${
                task.urgency === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
              }`}>{task.urgency}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Maintenance;