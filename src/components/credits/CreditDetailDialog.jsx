import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { getInstallmentStatus } from '@/lib/creditUtils';
import { supabase } from '@/lib/supabaseClient';

export const CreditDetailDialog = ({ isOpen, onOpenChange, creditId }) => {
  const [credit, setCredit] = useState(null);
  const [client, setClient] = useState(null);
  const [product, setProduct] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Fetch credit + client + product from Supabase
  useEffect(() => {
    const fetchCreditDetails = async () => {
      if (!creditId) return;

      const { data: creditData, error: creditError } = await supabase
        .from('credits')
        .select('*')
        .eq('id', creditId)
        .single();

      if (creditError) {
        console.error('Error loading credit:', creditError);
        return;
      }

      setCredit(creditData);

      // Get client
      const { data: clientData } = await supabase
        .from('users')
        .select('name')
        .eq('id', creditData.clientId)
        .single();
      setClient(clientData);

      // Get product
      const { data: productData } = await supabase
        .from('products')
        .select('name')
        .eq('id', creditData.productId)
        .single();
      setProduct(productData);
    };

    if (isOpen) fetchCreditDetails();
  }, [isOpen, creditId]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-white/10 text-white max-w-4xl">
        <DialogHeader>
          <DialogTitle>Detalles del Crédito #{credit?.id}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Información completa del crédito y plan de pagos
          </DialogDescription>
        </DialogHeader>

        {credit && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-400">Cliente</p>
                <p className="text-white font-medium">{client?.name || '...'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Producto</p>
                <p className="text-white font-medium">{product?.name || '...'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Monto</p>
                <p className="text-white font-medium">{formatCurrency(credit.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Fecha de Inicio</p>
                <p className="text-white font-medium">{new Date(credit.startDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Plan de Pagos</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {credit.paymentPlan?.map((installment) => {
                  const statusInfo = getInstallmentStatus(installment);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div
                      key={installment.installmentNumber}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
                        <div>
                          <p className="text-sm text-white">Cuota #{installment.installmentNumber}</p>
                          <p className="text-xs text-gray-400">Vence: {new Date(installment.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">{formatCurrency(installment.amount)}</p>
                        <p className={`text-xs ${statusInfo.color}`}>{statusInfo.label}</p>
                        {installment.paidAmount > 0 && (
                          <p className="text-xs text-green-400">
                            Pagado: {formatCurrency(installment.paidAmount)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-white border-white/20 hover:bg-white/10"
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
