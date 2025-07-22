import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';

import Login from '@/pages/Login';
import AdminDashboard from '@/pages/AdminDashboard';
import ClientDashboard from '@/pages/ClientDashboard';
import UsersManagement from '@/pages/UsersManagement';
import ProductsManagement from '@/pages/ProductsManagement';
import CreditsManagement from '@/pages/CreditsManagement';
import PaymentsManagement from '@/pages/PaymentsManagement';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/admin" replace />
            : <Login />
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <UsersManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/products"
        element={
          <ProtectedRoute>
            <ProductsManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/credits"
        element={
          <ProtectedRoute>
            <CreditsManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/payments"
        element={
          <ProtectedRoute>
            <PaymentsManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/client"
        element={
          <ProtectedRoute>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? "/admin" : "/login"} replace />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <Helmet>
        <title>Sistema de Gestión de Crédito y Cartera</title>
        <meta name="description" content="Sistema completo para la gestión de créditos, cartera y pagos con dashboard administrativo y portal de clientes" />
      </Helmet>

      <AuthProvider>
        <DataProvider>
          <div className="min-h-screen">
            <AppRoutes />
            <Toaster />
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
