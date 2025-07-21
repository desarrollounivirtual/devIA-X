import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User, FileText, Download } from 'lucide-react';
import Layout from '@/components/Layout';

const ClientDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast({
            title: "Sesión cerrada",
            description: "Has cerrado sesión correctamente.",
        });
    };

    const handleNotImplemented = () => {
        toast({
            title: "🚧 ¡Función en construcción!",
            description: "Esta característica aún no está implementada. ¡Puedes solicitarla en tu próximo mensaje! 🚀",
        });
    };
    
    return (
        <>
            <Helmet>
                <title>Portal Cliente | Gestor de Crédito</title>
                <meta name="description" content="Portal del cliente para ver estado de cuenta y créditos." />
            </Helmet>
            <Layout title="Portal del Cliente">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass-card p-8 rounded-lg"
                >
                    <div className="flex items-center space-x-4 mb-6">
                        <User className="h-12 w-12 text-indigo-400" />
                        <div>
                            <h2 className="text-3xl font-bold text-white">Bienvenido, Cliente</h2>
                            <p className="text-gray-400">Aquí puedes consultar la información de tus créditos.</p>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                        <h3 className="text-xl font-semibold mb-4 flex items-center text-white">
                            <FileText className="mr-2 h-5 w-5" />
                            Tu Estado de Cuenta
                        </h3>
                        <div className="bg-white/5 p-6 rounded-md">
                            <p className="text-lg text-gray-200">Tu estado de cuenta está listo para ser descargado.</p>
                            <p className="text-sm text-gray-400 mb-4">Haz clic en el botón para obtener una copia en PDF o Excel.</p>
                            <div className="flex space-x-4">
                                <Button onClick={handleNotImplemented} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                    <Download className="mr-2 h-4 w-4" /> Descargar PDF
                                </Button>
                                <Button onClick={handleNotImplemented} variant="outline" className="text-white border-white/20 hover:bg-white/10">
                                    <Download className="mr-2 h-4 w-4" /> Descargar Excel
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </Layout>
        </>
    );
};

export default ClientDashboard;