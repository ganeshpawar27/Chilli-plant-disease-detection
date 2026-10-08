import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// Layouts
import FarmerLayout from './layouts/FarmerLayout';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import AdminLoginPage from './pages/public/AdminLoginPage';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerProfile from './pages/farmer/FarmerProfile';
import PredictDisease from './pages/farmer/PredictDisease';
import PredictionResult from './pages/farmer/PredictionResult';
import PredictionHistory from './pages/farmer/PredictionHistory';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import FarmersManagement from './pages/admin/FarmersManagement';
import DiseaseAnalytics from './pages/admin/DiseaseAnalytics';
import AdminProfile from './pages/admin/AdminProfile';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const { loadFromStorage } = useAuthStore();
  
  useEffect(() => {
    loadFromStorage();
  }, []);
  
  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Route>
        
        {/* Farmer Routes */}
        <Route 
          path="/farmer" 
          element={
            <ProtectedRoute role="ROLE_FARMER">
              <FarmerLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<FarmerDashboard />} />
          <Route path="profile" element={<FarmerProfile />} />
          <Route path="predict" element={<PredictDisease />} />
          <Route path="result" element={<PredictionResult />} />
          <Route path="history" element={<PredictionHistory />} />
        </Route>
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="farmers" element={<FarmersManagement />} />
          <Route path="analytics" element={<DiseaseAnalytics />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;