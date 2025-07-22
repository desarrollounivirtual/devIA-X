import React, { createContext, useContext, useState, useEffect } from 'react';
import { addDays, differenceInDays } from 'date-fns';
import { supabase } from '../supabaseClient';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData debe ser usado dentro de DataProvider');
  return context;
};

export const DataProvider = ({ children }) => {
  const [clientes, setClientes] = useState([]);
  const [products, setProducts] = useState([]);
  const [credits, setCredits] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const { data: clientesData, error: clientesError } = await supabase.from('clientes').select('*');
      const { data: productsData, error: productsError } = await supabase.from('products').select('*');
      const { data: creditsData, error: creditsError } = await supabase.from('credits').select('*');
      const { data: paymentsData, error: paymentsError } = await supabase.from('payments').select('*');

      if (clientesError) console.error('Error fetching clientes:', clientesError);
      if (productsError) console.error('Error fetching products:', productsError);
      if (creditsError) console.error('Error fetching credits:', creditsError);
      if (paymentsError) console.error('Error fetching payments:', paymentsError);

      setClientes(clientesData || []);
      setProducts(productsData || []);
      setCredits(creditsData || []);
      setPayments(paymentsData || []);

      // Verificación visual en consola
      console.log('Clientes:', clientesData);
      console.log('Productos:', productsData);
      console.log('Créditos:', creditsData);
      console.log('Pagos:', paymentsData);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const addCliente = async (clienteData) => {
    const { data, error } = await supabase.from('clientes').insert(clienteData).select();
    if (error) {
      console.error('Error al agregar cliente:', error.message);
      return null;
    }
    setClientes(prev => [...prev, ...data]);
    return data[0];
  };

  const updateCliente = async (id, clienteData) => {
    const { data, error } = await supabase.from('clientes').update(clienteData).eq('id', id).select();
    if (error) return console.error('Error actualizando cliente:', error.message);
    if (data) setClientes(prev => prev.map(c => c.id === id ? data[0] : c));
  };

  const deleteCliente = async (id) => {
    const { error } = await supabase.from('clientes').delete().eq('id', id);
    if (error) return console.error('Error eliminando cliente:', error.message);
    setClientes(prev => prev.filter(c => c.id !== id));
  };

  const addProduct = async (productData) => {
    const { data, error } = await supabase.from('products').insert(productData).select();
    if (error) {
      console.error('Error al agregar producto:', error.message);
      return null;
    }
    setProducts(prev => [...prev, ...data]);
    return data[0];
  };

  const updateProduct = async (id, productData) => {
    const { data, error } = await supabase.from('products').update(productData).eq('id', id).select();
    if (error) return console.error('Error actualizando producto:', error.message);
    if (data) setProducts(prev => prev.map(p => p.id === id ? data[0] : p));
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return console.error('Error eliminando producto:', error.message);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const generatePaymentPlan = (amount, installments, startDate) => {
    const monthlyPayment = amount / installments;
    return Array.from({ length: installments }).map((_, i) => ({
      installmentNumber: i + 1,
      amount: monthlyPayment,
      dueDate: addDays(new Date(startDate), i * 30).toISOString(),
      status: 'pending',
      paidAmount: 0,
      paidDate: null
    }));
  };

  const addCredit = async (creditData) => {
    const product = products.find(p => p.id === creditData.productId);
    if (!product) {
      console.error('Producto no encontrado para ID:', creditData.productId);
      return null;
    }

    const paymentPlan = generatePaymentPlan(
      product.value,
      creditData.installments,
      creditData.startDate
    );

    const newCredit = {
      ...creditData,
      amount: product.value,
      paymentPlan,
      status: 'active',
      createdDate: new Date().toISOString()
    };

    const { data, error } = await supabase.from('credits').insert(newCredit).select();
    if (error) {
      console.error('Error al agregar crédito:', error.message);
      return null;
    }

    setCredits(prev => [...prev, ...data]);
    return data[0];
  };

  const updateCredit = async (id, creditData) => {
    const { data, error } = await supabase.from('credits').update(creditData).eq('id', id).select();
    if (error) return console.error('Error actualizando crédito:', error.message);
    if (data) setCredits(prev => prev.map(c => c.id === id ? data[0] : c));
  };

  const addPayment = async (paymentData) => {
    const newPayment = { ...paymentData, date: new Date().toISOString() };

    const { data, error } = await supabase.from('payments').insert(newPayment).select();
    if (error) return console.error('Error agregando pago:', error.message);
    const payment = data[0];

    const credit = credits.find(c => c.id === payment.creditId);
    if (!credit) return console.error('Crédito no encontrado para el pago');

    const updatedPaymentPlan = credit.paymentPlan.map(inst => {
      if (inst.installmentNumber === payment.installmentNumber) {
        const newPaidAmount = inst.paidAmount + payment.amount;
        return {
          ...inst,
          paidAmount: newPaidAmount,
          status: newPaidAmount >= inst.amount ? 'paid' : 'partial',
          paidDate: newPaidAmount >= inst.amount ? new Date().toISOString() : inst.paidDate
        };
      }
      return inst;
    });

    await supabase.from('credits')
      .update({ paymentPlan: updatedPaymentPlan })
      .eq('id', credit.id);

    setCredits(prev => prev.map(c => c.id === credit.id ? { ...c, paymentPlan: updatedPaymentPlan } : c));
    setPayments(prev => [...prev, payment]);

    return payment;
  };

  const getStats = () => {
    const totalClientes = clientes.length;
    const activeCredits = credits.filter(c => c.status === 'active').length;

    const today = new Date();
    const overdueCredits = credits.filter(credit =>
      credit.paymentPlan.some(installment => {
        const overdue = differenceInDays(today, new Date(installment.dueDate));
        return installment.status === 'pending' && overdue > 3;
      })
    ).length;

    const totalPayments = payments.length;
    const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);

    const totalToCobrar = credits.reduce((sum, credit) =>
      sum + credit.paymentPlan.reduce((s, i) => s + (i.amount - i.paidAmount), 0), 0
    );

    return {
      totalClientes,
      activeCredits,
      overdueCredits,
      totalPayments,
      totalIncome,
      totalToCobrar
    };
  };

  const value = {
    clientes,
    productos,
    creditos,
    pagos,
    addCliente,
    updateCliente,
    deleteCliente,
    addProducto,
    updateProducto,
    deleteProducto,
    addCredito,
    updateCredito,
    addPago,
    getStats
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
