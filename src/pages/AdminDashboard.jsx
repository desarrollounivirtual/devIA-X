import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, CreditCard, AlertTriangle, FileText, DollarSign, BarChart } from 'lucide-react';
import Layout from '@/components/Layout';
import { useData } from '@/contexts/DataContext';
import { getCreditStatus } from '@/lib/creditUtils';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { users = [], credits = [], payments = [] } = useData();

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast({
            title: "Sesión cerrada",
            description: "Has cerrado sesión correctamente.",
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const totalClients = users.filter(u => u.role === 'client').length;
    const activeCredits = credits.length;
    const overdueCredits = credits.filter(c => getCreditStatus(c).status === 'overdue').length;
    const totalPayments = payments.length;
    const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalReceivable = credits.reduce((sum, c) => sum + (c.amount - (c.paidAmount || 0)), 0);

    const stats = [
        { icon: Users, label: 'Clientes Registrados', value: totalClients, color: 'text-blue-400' },
        { icon: CreditCard, label: 'Créditos Activos', value: activeCredits, color: 'text-green-400' },
        { icon: AlertTriangle, label: 'Créditos en Mora', value: overdueCredits, color: 'text-red-400' },
        { icon: FileText, label: 'Pagos Emitidos', value: totalPayments, color: 'text-yellow-400' },
        { icon: DollarSign, label: 'Dinero Ingresado', value: formatCurrency(totalIncome), color: 'text-teal-400' },
        { icon: BarChart, label: 'Monto por Cobrar', value: formatCurrency(totalReceivable), color: 'text-purple-400' },
    ];

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
            },
        }),
    };

    return (
        <>
            <Helmet>
                <title>Dashboard Administrador | Gestor de Crédito</title>
                <meta name="description" content="Panel de administración para la gestión de créditos." />
            </Helmet>
            <Layout title="Dashboard Principal" onLogout={handleLogout}>
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                    initial="hidden"
                    animate="visible"
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            className="glass-card border-white/10 p-6 rounded-lg flex items-center space-x-4"
                            variants={cardVariants}
                            custom={i}
                        >
                            <div className={`p-3 rounded-full bg-white/10`}>
                                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-gray-400">{stat.label}</p>
                                <p className="text-3xl font-bold text-white">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Button onClick={() => navigate('/admin/users')} className="w-full text-lg py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">Gestionar Clientes</Button>
                    <Button onClick={() => navigate('/admin/products')} className="w-full text-lg py-6 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white">Gestionar Productos</Button>
                    <Button onClick={() => navigate('/admin/credits')} className="w-full text-lg py-6 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white">Gestionar Créditos</Button>
                    <Button onClick={() => navigate('/admin/payments')} className="w-full text-lg py-6 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white">Gestionar Pagos</Button>
                </div>
            </Layout>
        </>
    );
};

export default AdminDashboard;
