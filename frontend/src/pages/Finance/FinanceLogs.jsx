import React from 'react';
import { DollarSign, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const FinanceLogs = () => {
  const ledgers = [
    { description: 'Route Execution Fuel Fill #92', type: 'expense', amount: '-$124.50', timestamp: 'Today, 10:42 AM' },
    { description: 'Client Retainer Milestone Payment', type: 'income', amount: '+$3,400.00', timestamp: 'Yesterday' },
    { description: 'Fleet Parts Overhaul Allocation', type: 'expense', amount: '-$890.00', timestamp: 'Jul 10, 2026' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Financial Ledger</h1>
        <p className="text-xs text-slate-500">Real-time audit log tracking cash flow profiles.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm divide-y divide-slate-50 text-xs">
        {ledgers.map((item, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition font-medium">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {item.type === 'income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900">{item.description}</p>
                <p className="text-slate-400 font-mono text-[10px]">{item.timestamp}</p>
              </div>
            </div>
            <span className={`font-mono font-bold text-sm ${item.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
              {item.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinanceLogs;