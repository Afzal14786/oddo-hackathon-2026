import React from 'react';
import { Truck, Users, AlertTriangle, TrendingUp, DollarSign, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
  // Mock Hackathon Operations Dataset
  const stats = [
    { title: 'Active Fleet Assets', value: '42 / 50', change: '+4 deployment', icon: <Truck className="text-indigo-600" size={24} />, bg: 'bg-indigo-50' },
    { title: 'Active Operators', value: '38', change: '2 on standby', icon: <Users className="text-emerald-600" size={24} />, bg: 'bg-emerald-50' },
    { title: 'Pending Maintenance', value: '3', change: '1 critical hazard', icon: <AlertTriangle className="text-amber-600" size={24} />, bg: 'bg-amber-50' },
    { title: 'Gross Revenue (MTD)', value: '$14,280', change: '+18.4% vs last wk', icon: <DollarSign className="text-blue-600" size={24} />, bg: 'bg-blue-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Upper Welcome Header banner */}
      <div className="flex justify-between items-center bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-2xl border border-slate-800 text-white shadow-sm shadow-indigo-950/20">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fleet Command Center</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time telematics manifest monitoring routing matrix systems active.</p>
        </div>
        <div className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-mono text-xs rounded-lg uppercase tracking-wider animate-pulse">
          Live Telemetry Stream
        </div>
      </div>

      {/* Grid Allocation Blocks for KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-start justify-between hover:shadow-md transition">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.title}</span>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <TrendingUp size={12} className="text-emerald-500" /> {stat.change}
              </span>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Main Content Panel Grid layout blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Active Exceptions Feed</h3>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5">
              Review Board <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-rose-50/50 border border-rose-100/60 rounded-xl text-xs">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></div>
                <span className="font-bold text-rose-900">Asset VAN-05:</span>
                <span className="text-slate-600 font-medium">Brake sensor failure flag warning triggered near Node Alpha.</span>
              </div>
              <span className="font-mono text-slate-400 font-medium">2 mins ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50/50 border border-amber-100/60 rounded-xl text-xs">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                <span className="font-bold text-amber-900">Driver Assignment:</span>
                <span className="text-slate-600 font-medium">Unscheduled rest milestone exceeded on Route Ticket #892.</span>
              </div>
              <span className="font-mono text-slate-400 font-medium">14 mins ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Hackathon Sandbox Metrics</h3>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">API Gateway Connection:</span>
              <span className="font-bold text-emerald-600">Online (Mock)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Database Node Latency:</span>
              <span className="font-mono font-bold text-slate-700">14ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Authentication Shield:</span>
              <span className="font-bold text-indigo-600">Active Context</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;