import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  Users, 
  Package, 
  CreditCard, 
  DollarSign, 
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminMenuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Usuarios', path: '/admin/users' },
    { icon: Package, label: 'Productos', path: '/admin/products' },
    { icon: CreditCard, label: 'Créditos', path: '/admin/credits' },
    { icon: DollarSign, label: 'Pagos', path: '/admin/payments' }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-gray-200">
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="glass-card text-white"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {user.role === 'admin' && (
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -300 }}
          className="fixed left-0 top-0 h-full w-64 glass-card border-r border-white/10 z-40 lg:translate-x-0"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold gradient-text">Sistema de Crédito</h2>
          </div>
          
          <nav className="px-4 space-y-2">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                      : 'hover:bg-white/5 text-gray-300 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="absolute bottom-6 left-4 right-4">
            <div className="glass-card p-4 rounded-lg">
              <p className="text-sm text-gray-200 mb-2">{user.name}</p>
              <p className="text-xs text-gray-400 mb-3">{user.email}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full text-white border-white/20 hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </motion.aside>
      )}

      <main className={`${user.role === 'admin' ? 'lg:ml-64' : ''} min-h-screen`}>
        <header className="glass-card border-b border-white/10 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div className={user.role === 'admin' ? 'lg:ml-0 ml-12' : ''}>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
            </div>
            
            {user.role === 'client' && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-200">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            )}
          </div>
        </header>

        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;