import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Truck, Users, Route, Wrench, BarChart2, LayoutDashboard, 
  LogOut, UserCircle, FileText 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const links = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/vehicles', label: 'Vehicles', icon: <Truck size={18} /> },
    { path: '/drivers', label: 'Drivers', icon: <Users size={18} /> },
    { path: '/trips', label: 'Trips & Dispatch', icon: <Route size={18} /> },
    { path: '/maintenance', label: 'Maintenance', icon: <Wrench size={18} /> },
    { path: '/finance', label: 'Finance & ROI', icon: <BarChart2 size={18} /> },
    { path: '/reports', label: 'Reports', icon: <FileText size={18} /> },
  ];

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout(); // logout() already redirects to /login
    }
  };

  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-screen fixed left-0 top-0 flex flex-col justify-between border-r border-slate-800 shadow-xl z-50">
      {/* Top section: Brand + Navigation */}
      <div>
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <Truck size={20} />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg tracking-tight">TransitOps</h2>
            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Fleet Core v1.0</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
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

      {/* Bottom section: User info + Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3 mb-3 px-2">
          <UserCircle size={36} className="text-indigo-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-slate-400 truncate capitalize">
              {user?.role ? user.role.replace('_', ' ') : ''}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-xs font-bold text-red-400 bg-red-950/40 border border-red-900/60 hover:bg-red-900/40 hover:text-red-300 py-2 rounded-lg transition"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;