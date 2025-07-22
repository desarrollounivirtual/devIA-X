import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Inicio de sesión exitoso',
        description: 'Has iniciado sesión correctamente.',
      });

      navigate('/dashboard');
    } else {
      toast({
        title: 'Error al iniciar sesión',
        description: result.error || 'Credenciales incorrectas.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión | Gestor de Crédito</title>
        <meta name="description" content="Inicia sesión en tu cuenta para gestionar tus créditos fácilmente." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 rounded-2xl bg-white/60 dark:bg-gray-900/70 shadow-xl backdrop-blur-md"
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Bienvenido de nuevo</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Inicia sesión para continuar</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="admin@crediapp.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="admin123"
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Cliente: cliente@crediapp.com / cliente123
            </div>
            <Button type="submit" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="h-5 w-5" /> Iniciar Sesión
                </span>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
