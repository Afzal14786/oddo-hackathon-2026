import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import VehicleList from './pages/Vehicles/VehicleList';
import DriverList from './pages/Drivers/DriverList';
import TripForm from './pages/Trips/TripForm';
import Maintenance from './pages/Maintenance/Maintenance';
import FinanceLogs from './pages/Finance/FinanceLogs';


// A simple layout wrapper to keep the Sidebar on every dashboard page
const AppLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      {/* Added pl-64 here to slide the content past the fixed 64-unit sidebar */}
      <main className="flex-1 pl-64 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main Dashboard Routing */}
          <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/vehicles" element={<AppLayout><VehicleList /></AppLayout>} />
          <Route path="/drivers" element={<AppLayout><DriverList /></AppLayout>} />
          <Route path="/trips" element={<AppLayout><TripForm /></AppLayout>} />
          <Route path="/maintenance" element={<AppLayout><Maintenance /></AppLayout>} />
          <Route path="/finance" element={<AppLayout><FinanceLogs /></AppLayout>} />
          
          {/* Catch-all redirect to Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;