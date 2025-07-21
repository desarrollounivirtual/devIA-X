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

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/admin'} replace />;
  }
  
  return children;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? 
            <Navigate to={user.role === 'admin' ? '/admin' : '/admin'} replace /> : 
            <Login />
        } 
      />
      
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UsersManagement />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/products" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ProductsManagement />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/credits" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CreditsManagement />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin/payments" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PaymentsManagement />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/client" 
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/" 
        element={
          <Navigate to={
            isAuthenticated ? 
              (user.role === 'admin' ? '/admin' : '/client') : 
              '/login'
          } replace />
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
