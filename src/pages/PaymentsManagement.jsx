import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Layout from '@/components/Layout';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  DollarSign, 
  Plus, 
  Search,
  Calendar,
  CheckCircle,
  TrendingUp,
  FileText
} from 'lucide-react';
import { PaymentFormDialog } from '@/components/payments/PaymentFormDialog';

const PaymentsManagement = () => {
  const { payments, credits, users } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredPayments = payments.filter(payment => {
    const credit = credits.find(c => c.id === payment.creditId);
    const client = users.find(u => u.id === credit?.clientId);

    const matchesSearch = client?.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client?.cedula?.includes(searchTerm) ||
                          payment.credito_id?.includes(searchTerm) ||
                          payment.estado_pago?.toString().includes(searchTerm);

    const matchesDate = !filterDate || payment.date?.startsWith(filterDate);

    return matchesSearch && matchesDate;
  });

  const handleExport = () => {
    toast({
      title: "🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀"
    });
  };

  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const todayPayments = payments.filter(p =>
    new Date(p.date).toDateString() === new Date().toDateString()
  ).length;
  const thisMonthAmount = payments.filter(p => {
    const paymentDate = new Date(p.date);
    const now = new Date();
    return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
  }).reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <>
      <Helmet>
        <title>Gestión de Pagos - Sistema de Gestión de Crédito</title>
        <meta name="description" content="Administra pagos y registra abonos del sistema de crédito" />
      </Helmet>
      
      <Layout title="Gestión de Pagos">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por cliente o crédito..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-40 bg-white/5 border-white/10 text-white"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleExport} variant="outline" className="border-white/20 hover:bg-white/10">
                Exportar
              </Button>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Pago
              </Button>
              <PaymentFormDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="glass-card border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Pagos</p>
                      <p className="text-3xl font-bold text-white">{totalPayments}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="glass-card border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Monto Total</p>
                      <p className="text-2xl font-bold text-green-400">{formatCurrency(totalAmount)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="glass-card border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Pagos Hoy</p>
                      <p className="text-3xl font-bold text-white">{todayPayments}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="glass-card border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Este Mes</p>
                      <p className="text-2xl font-bold text-orange-400">{formatCurrency(thisMonthAmount)}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Historial de Pagos</CardTitle>
                <CardDescription className="text-gray-400">
                  Registro completo de todos los pagos realizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPayments.slice().reverse().map((payment) => {
                    const credit = credits.find(c => c.id === payment.creditId);
                    const client = users.find(u => u.id === credit?.clientId);

                    return (
                      <div key={payment.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-400" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">
                              Pago Crédito #{payment.creditId}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>Cliente: {client?.name ?? 'Desconocido'}</span>
                              <span>Cuota #{payment.installmentNumber}</span>
                              <span>{new Date(payment.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-400">
                            {formatCurrency(payment.amount)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(payment.date).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  
                  {filteredPayments.length === 0 && (
                    <div className="text-center py-12">
                      <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">
                        No se encontraron pagos
                      </h3>
                      <p className="text-gray-400">
                        {searchTerm || filterDate 
                          ? 'Intenta ajustar los filtros de búsqueda'
                          : 'Los pagos registrados aparecerán aquí'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Layout>
    </>
  );
};

export default PaymentsManagement;
