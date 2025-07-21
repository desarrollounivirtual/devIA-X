
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const user = login(email, password);
      setIsLoading(false);
      if (user) {
        toast({
          title: "¡Bienvenido de nuevo!",
          description: "Has iniciado sesión correctamente.",
        });
        navigate(user.role === 'admin' ? '/admin' : '/client');
      } else {
        toast({
          title: "Error de autenticación",
          description: "Correo o contraseña incorrectos.",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión | Gestor de Crédito</title>
        <meta name="description" content="Inicia sesión para acceder a tu panel de gestión de créditos." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg dark:bg-gray-800"
        >
          <div className="text-center">
            <motion.h1 
              className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Bienvenido
            </motion.h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Ingresa a tu cuenta para continuar</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Correo Electrónico</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Correo Electrónico (admin@crediapp.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Contraseña (admin123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Cliente: cliente@crediapp.com / cliente123
            </p>
            <div>
              <Button type="submit" className="group relative w-full" disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LogIn className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                  </span>
                  Iniciar Sesión
                </>}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
  