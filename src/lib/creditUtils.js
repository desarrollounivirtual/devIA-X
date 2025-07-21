import { differenceInDays } from 'date-fns';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export const getCreditStatus = (credit) => {
  const today = new Date();
  const hasOverduePayments = credit.paymentPlan.some(installment => {
    if (installment.status === 'pending') {
      const daysDiff = differenceInDays(today, new Date(installment.dueDate));
      return daysDiff > 3;
    }
    return false;
  });

  if (hasOverduePayments) {
    return { status: 'overdue', label: 'Moroso', color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/30' };
  }
  
  const allPaid = credit.paymentPlan.every(installment => installment.status === 'paid');
  if (allPaid) {
    return { status: 'completed', label: 'Completado', color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30' };
  }
  
  return { status: 'active', label: 'Activo', color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30' };
};

export const getInstallmentStatus = (installment) => {
  const today = new Date();
  const dueDate = new Date(installment.dueDate);
  const daysDiff = differenceInDays(today, dueDate);

  if (installment.status === 'paid') {
    return { status: 'paid', label: 'Pagado', color: 'text-green-400', icon: CheckCircle };
  } else if (daysDiff > 3) {
    return { status: 'overdue', label: 'Moroso', color: 'text-red-400', icon: AlertTriangle };
  } else if (daysDiff > 0) {
    return { status: 'late', label: 'Vencido', color: 'text-orange-400', icon: AlertTriangle };
  } else {
    return { status: 'pending', label: 'Pendiente', color: 'text-yellow-400', icon: Clock };
  }
};