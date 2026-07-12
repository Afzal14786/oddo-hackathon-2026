import React from 'react';
import { NavLink } from 'react-router-dom';
import { Truck, Users, Route, Wrench, BarChart2, LayoutDashboard, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, switchRole } = useAuth();

    const links = [
        { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { path: '/vehicles', label: 'Vehicles', icon: <Truck size={18} /> },
        { path: '/drivers', label: 'Drivers', icon: <Users size={18} /> },
        { path: '/trips', label: 'Trips & Dispatch', icon: <Route size={18} /> },
        { path: '/maintenance', label: 'Maintenance', icon: <Wrench size={18} /> },
        { path: '/finance', label: 'Finance & ROI', icon: <BarChart2 size={18} /> },
    ];

    return (
        <div className="w-64 bg-slate-900 text-slate-300 h-screen fixed left-0 top-0 flex flex-col justify-between border-r border-slate-800 shadow-xl z-50">
            <div>
                {/* Branding Block */}
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white">
                        <Truck size={20} />
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-lg tracking-tight">TransitOps</h2>
                        <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Fleet Core v1.0</span>
                    </div>
                </div>

                {/* Navigation Links Group */}
                <nav className="p-4 space-y-1.5 flex-1">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                                    isActive
                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                                        : 'hover:bg-slate-800/60 hover:text-white'
                                }`
                            }
                        >
                            {link.icon}
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Quick Hackathon Mock Identity Console Wrapper */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/40">
                <div className="flex items-center justify-between mb-3 px-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Shield size={14} className="text-indigo-400" />
                        <span>Active Role: <strong className="text-white">{user.role}</strong></span>
                    </div>
                </div>
                <button 
                    onClick={() => switchRole(user.role === 'Dispatcher' ? 'Admin' : 'Dispatcher')}
                    className="w-full text-center text-xs font-bold text-indigo-400 bg-indigo-950/40 border border-indigo-900/60 hover:bg-indigo-900/40 hover:text-indigo-300 py-2 rounded-lg transition"
                >
                    Toggle Simulation Role
                </button>
            </div>
        </div>
    );
};

export default Sidebar;