import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/layout/Layout';
import Complaints from './pages/Complaints';
import ComplaintDetail from './pages/ComplaintDetail';
import Applications from './pages/Applications';
import Citizens from './pages/Citizens';
import Kiosks from './pages/Kiosks';
import UtilityData from './pages/UtilityData';
import Infrastructure from './pages/Infrastructure';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ContentManagement from './pages/ContentManagement';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="complaints/:id" element={<ComplaintDetail />} />
          <Route path="applications" element={<Applications />} />
          <Route path="citizens" element={<Citizens />} />
          <Route path="kiosks" element={<Kiosks />} />
          <Route path="utility-data" element={<UtilityData />} />
          <Route path="infrastructure" element={<Infrastructure />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="*" element={<div className="p-8">Page not found</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
