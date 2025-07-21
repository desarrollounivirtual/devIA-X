import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

export const PaymentFormDialog = ({ isOpen, onOpenChange }) => {
  const { credits, users } = useData();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    creditId: '',
    installmentNumber: '',
    amount: '',
    paymentType: 'full'
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getAvailableInstallments = (creditId) => {
    const credit = credits.find(c => c.id === creditId);
    if (!credit) return [];
    return credit.paymentPlan.filter(installment =>
      installment.status === 'pending' || installment.status === 'partial'
    );
  };

  const resetForm = () => {
    setFormData({
      creditId: '',
      installmentNumber: '',
      amount: '',
      paymentType: 'full'
    });
    onOpenChange(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      toast({
        title: "Sesión inválida",
        description: "Debes iniciar sesión para registrar un pago.",
        variant: "destructive"
      });
      return;
    }

    const paymentData = {
      credit_id: formData.creditId,
      installment_number: parseInt(formData.installmentNumber),
      amount: parseFloat(formData.amount),
      payment_type: formData.paymentType,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('pagos').insert([paymentData]);

    if (error) {
      toast({
        title: "Error al registrar el pago",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Pago registrado",
      description: "El pago ha sido registrado correctamente.",
    });

    resetForm();
  };

  const handleCreditChange = (creditId) => {
    setFormData({
      ...formData,
      creditId,
      installmentNumber: '',
      amount: ''
    });
  };

  const handleInstallmentChange = (installmentNumber) => {
    const credit = credits.find(c => c.id === formData.creditId);
    const installment = credit?.paymentPlan.find(i => i.installmentNumber === parseInt(installmentNumber));

    if (installment) {
      const remainingAmount = installment.amount - installment.paidAmount;
      setFormData({
        ...formData,
        installmentNumber,
        amount: formData.paymentType === 'full' ? remainingAmount.toString() : ''
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Pago</DialogTitle>
          <DialogDescription className="text-gray-400">
            Registra un pago o abono para un crédito específico
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="creditId">Crédito</Label>
            <Select value={formData.creditId} onValueChange={handleCreditChange}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Seleccionar crédito" />
              </SelectTrigger>
              <SelectContent>
                {credits.map(credit => {
                  const client = users.find(u => u.id === credit.clientId);
                  return (
                    <SelectItem key={credit.id} value={credit.id}>
                      Crédito #{credit.id} - {client?.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {formData.creditId && (
            <div className="space-y-2">
              <Label htmlFor="installmentNumber">Cuota</Label>
              <Select value={formData.installmentNumber} onValueChange={handleInstallmentChange}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Seleccionar cuota" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableInstallments(formData.creditId).map(installment => (
                    <SelectItem key={installment.installmentNumber} value={installment.installmentNumber.toString()}>
                      Cuota #{installment.installmentNumber} - {formatCurrency(installment.amount - installment.paidAmount)} pendiente
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="paymentType">Tipo de Pago</Label>
            <Select
              value={formData.paymentType}
              onValueChange={(value) => setFormData({ ...formData, paymentType: value })}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Pago Completo</SelectItem>
                <SelectItem value="partial">Abono Parcial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              placeholder="0"
              min="1"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600">
              Registrar Pago
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
