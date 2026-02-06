
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AttendanceProvider } from './context/AttendanceContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AttendanceHistory from './pages/AttendanceHistory';
import AdminDashboard from './pages/AdminDashboard';
import AdminEmployees from './pages/AdminEmployees';
import AdminReports from './pages/AdminReports';
import AdminApprovals from './pages/AdminApprovals';
import AdminHolidays from './pages/AdminHolidays';
import Holidays from './pages/Holidays';
import Notifications from './pages/Notifications';
import LeavesPermissions from './pages/LeavesPermissions';

const PrivateRoute: React.FC<{ children: React.ReactNode, adminOnly?: boolean }> = ({ children, adminOnly }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" />;
  
  return (
    <div className="flex bg-gray-50 min-h-screen relative">
      <Sidebar />
      <main className="flex-1 w-full lg:ml-64 pt-20 lg:pt-8 p-4 sm:p-6 md:p-8 lg:p-10 overflow-x-hidden">
        <div className="max-w-[1400px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AttendanceProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* User Routes */}
            <Route path="/" element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            } />
            <Route path="/history" element={
              <PrivateRoute>
                <AttendanceHistory />
              </PrivateRoute>
            } />
            <Route path="/leaves" element={
              <PrivateRoute>
                <LeavesPermissions />
              </PrivateRoute>
            } />
            <Route path="/holidays" element={
              <PrivateRoute>
                <Holidays />
              </PrivateRoute>
            } />
            <Route path="/notifications" element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin" element={
              <PrivateRoute adminOnly>
                <AdminDashboard />
              </PrivateRoute>
            } />
            <Route path="/admin/employees" element={
              <PrivateRoute adminOnly>
                <AdminEmployees />
              </PrivateRoute>
            } />
            <Route path="/admin/reports" element={
              <PrivateRoute adminOnly>
                <AdminReports />
              </PrivateRoute>
            } />
            <Route path="/admin/approvals" element={
              <PrivateRoute adminOnly>
                <AdminApprovals />
              </PrivateRoute>
            } />
            <Route path="/admin/holidays" element={
              <PrivateRoute adminOnly>
                <AdminHolidays />
              </PrivateRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AttendanceProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
