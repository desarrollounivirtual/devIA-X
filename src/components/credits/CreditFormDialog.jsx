import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

export const CreditFormDialog = ({ isOpen, onOpenChange, addCredit, clients, products }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    clientId: '',
    productId: '',
    installments: '',
    startDate: '',
    monto: 0
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const resetForm = () => {
    setFormData({
      clientId: '',
      productId: '',
      installments: '',
      startDate: '',
      monto: 0
    });
    onOpenChange(false);
  };

  // Calcula monto automáticamente cuando se selecciona un producto
  useEffect(() => {
    const selectedProduct = products.find(p => p.id === formData.productId);
    if (selectedProduct) {
      setFormData(prev => ({ ...prev, monto: selectedProduct.value }));
    }
  }, [formData.productId, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { installments, startDate, monto, clientId, productId } = formData;
    const monthlyAmount = monto / installments;

    const paymentPlan = Array.from({ length: installments }, (_, i) => {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);
      return {
        installmentNumber: i + 1,
        amount: parseFloat(monthlyAmount.toFixed(2)),
        dueDate: dueDate.toISOString(),
        paidAmount: 0
      };
    });

    const creditData = {
      clientId,
      productId,
      amount: monto,
      startDate,
      paymentPlan,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase.from('creditos').insert([creditData]);

    if (error) {
      toast({
        title: "Error al crear el crédito",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Crédito creado",
      description: "El crédito ha sido registrado correctamente.",
    });

    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Crédito</DialogTitle>
          <DialogDescription className="text-gray-400">
            Completa la información para crear un nuevo crédito
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientId">Cliente</Label>
            <Select value={formData.clientId} onValueChange={(value) => setFormData({...formData, clientId: value})}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} - {client.cedula}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="productId">Producto</Label>
            <Select value={formData.productId} onValueChange={(value) => setFormData({...formData, productId: value})}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Seleccionar producto" />
              </SelectTrigger>
              <SelectContent>
                {products.map(product => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - {formatCurrency(product.value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.monto > 0 && (
            <div className="space-y-2">
              <Label>Monto del crédito</Label>
              <div className="bg-white/5 border border-white/10 rounded px-3 py-2 text-white">
                {formatCurrency(formData.monto)}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="installments">Número de Cuotas</Label>
              <Input
                id="installments"
                type="number"
                value={formData.installments}
                onChange={(e) => setFormData({...formData, installments: parseInt(e.target.value) || ''})}
                className="bg-white/5 border-white/10 text-white"
                placeholder="12"
                min="1"
                max="60"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de Inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="text-white border-white/20 hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            >
              Crear Crédito
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
