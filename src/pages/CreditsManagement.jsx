import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Layout from '@/components/Layout';
import { useData } from '@/contexts/DataContext';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import {
  CreditCard, Plus, Search, DollarSign, AlertTriangle, CheckCircle, Eye
} from 'lucide-react';
import { CreditFormDialog } from '@/components/credits/CreditFormDialog';
import { CreditDetailDialog } from '@/components/credits/CreditDetailDialog';
import { getCreditStatus } from '@/lib/creditUtils';

const CreditsManagement = () => {
  const { credits, users, products, addCredit } = useData(); // <- Supabase-powered context
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredCredits = credits.filter(credit => {
  const client = users.find(u => u.id === credit.clientId);
  const product = products.find(p => p.id === credit.productId);
  const creditStatus = getCreditStatus(credit);

  const matchesSearch =
    (client?.nombre_completo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client?.cedula || '').includes(searchTerm) ||
    (product?.nombre_completo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (credit.id || '').includes(searchTerm);

  const matchesStatus =
    filterStatus === 'all' || creditStatus.status === filterStatus;

  return matchesSearch && matchesStatus;
});

const handleViewDetails = (credit) => {
  setSelectedCredit(credit);
  setIsDetailDialogOpen(true);
};


  const handleExport = () => {
    toast({
      title: "🚧 Esta funcionalidad no está implementada aún—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo prompt! 🚀"
    });
  };

  const activeCredits = credits.filter(c => getCreditStatus(c).status === 'active').length;
  const overdueCredits = credits.filter(c => getCreditStatus(c).status === 'overdue').length;
  const completedCredits = credits.filter(c => getCreditStatus(c).status === 'completed').length;
  const totalAmount = credits.reduce((sum, credit) => sum + credit.amount, 0);

  return (
    <>
      <Helmet>
        <title>Gestión de Créditos - Sistema de Gestión de Crédito</title>
        <meta name="description" content="Administra créditos y planes de pago del sistema" />
      </Helmet>

      <Layout title="Gestión de Créditos">
        <div className="space-y-6">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por cliente, producto o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="overdue">Morosos</SelectItem>
                  <SelectItem value="completed">Completados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleExport}
                variant="outline"
                className="border-white/20 hover:bg-white/10 text-white"
              >
                Exportar
              </Button>
              <Button
                onClick={() => setIsFormDialogOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Crédito
              </Button>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="glass-card border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Créditos Activos</p>
                      <p className="text-3xl font-bold text-blue-400">{activeCredits}</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="glass-card border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Créditos Morosos</p>
                      <p className="text-3xl font-bold text-red-400">{overdueCredits}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="glass-card border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Completados</p>
                      <p className="text-3xl font-bold text-green-400">{completedCredits}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="glass-card border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Monto Total</p>
                      <p className="text-2xl font-bold text-white">{formatCurrency(totalAmount)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Lista de créditos */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Lista de Créditos</CardTitle>
                <CardDescription className="text-gray-400">Gestiona todos los créditos del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCredits.map((credit) => {
                    const client = users.find(u => u.id === credit.clientId);
                    const product = products.find(p => p.id === credit.productId);
                    const creditStatus = getCreditStatus(credit);
                    const paidInstallments = credit.paymentPlan.filter(i => i.status === 'paid').length;

                    return (
                      <div key={credit.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${creditStatus.bgColor} ${creditStatus.borderColor} border`}>
                            <CreditCard className={`h-6 w-6 ${creditStatus.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium text-white">Crédito #{credit.id}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${creditStatus.bgColor} ${creditStatus.color} ${creditStatus.borderColor} border`}>
                                {creditStatus.label}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                              <div>
                                <span className="block text-xs text-gray-500">Cliente</span>
                                <span className="text-white">{client?.name}</span>
                              </div>
                              <div>
                                <span className="block text-xs text-gray-500">Producto</span>
                                <span className="text-white">{product?.name}</span>
                              </div>
                              <div>
                                <span className="block text-xs text-gray-500">Monto</span>
                                <span className="text-white">{formatCurrency(credit.amount)}</span>
                              </div>
                              <div>
                                <span className="block text-xs text-gray-500">Progreso</span>
                                <span className="text-white">{paidInstallments}/{credit.installments} cuotas</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(credit)}
                            className="border-white/20 hover:bg-white/10 text-white"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {filteredCredits.length === 0 && (
                    <div className="text-center py-12">
                      <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No se encontraron créditos</h3>
                      <p className="text-gray-400">
                        {searchTerm || filterStatus !== 'all'
                          ? 'Intenta ajustar los filtros de búsqueda'
                          : 'Comienza creando tu primer crédito'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Diálogos */}
          <CreditFormDialog
            isOpen={isFormDialogOpen}
            onOpenChange={setIsFormDialogOpen}
            addCredit={addCredit}
            clients={users.filter(user => user.role === 'client')}
            products={products}
          />
          <CreditDetailDialog
            isOpen={isDetailDialogOpen}
            onOpenChange={setIsDetailDialogOpen}
            credit={selectedCredit}
            users={users}
            products={products}
          />
        </div>
      </Layout>
    </>
  );
};

export default CreditsManagement;
