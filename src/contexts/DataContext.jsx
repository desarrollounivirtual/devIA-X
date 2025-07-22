import React, { createContext, useContext, useState, useEffect } from 'react';
import { addDays, differenceInDays } from 'date-fns';
import { supabase } from '../supabaseClient';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe ser usado dentro de DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [credits, setCredits] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    const { data: usersData } = await supabase.from('users').select('*');
    const { data: productsData } = await supabase.from('products').select('*');
    const { data: creditsData } = await supabase.from('credits').select('*');
    const { data: paymentsData } = await supabase.from('payments').select('*');

    setUsers(usersData || []);
    setProducts(productsData || []);
    setCredits(creditsData || []);
    setPayments(paymentsData || []);
  };

  const addUser = async (userData) => {
    const newUser = {
      ...userData,
      joinDate: new Date().toISOString()
    };
    const { data, error } = await supabase.from('users').insert(newUser).select();
    if (!error) setUsers(prev => [...prev, ...data]);
    return data?.[0];
  };

  const updateUser = async (id, userData) => {
    const { data } = await supabase.from('users').update(userData).eq('id', id).select();
    if (data) setUsers(prev => prev.map(u => u.id === id ? data[0] : u));
  };

  const deleteUser = async (id) => {
    await supabase.from('users').delete().eq('id', id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const addProduct = async (productData) => {
    const { data, error } = await supabase.from('products').insert(productData).select();
    if (!error) setProducts(prev => [...prev, ...data]);
    return data?.[0];
  };

  const updateProduct = async (id, productData) => {
    const { data } = await supabase.from('products').update(productData).eq('id', id).select();
    if (data) setProducts(prev => prev.map(p => p.id === id ? data[0] : p));
  };

  const deleteProduct = async (id) => {
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const generatePaymentPlan = (amount, installments, startDate) => {
    const monthlyPayment = amount / installments;
    return Array.from({ length: installments }).map((_, i) => ({
      installmentNumber: i + 1,
      amount: monthlyPayment,
      dueDate: addDays(new Date(startDate), (i + 1) * 30).toISOString(),
      status: 'pending',
      paidAmount: 0,
      paidDate: null
    }));
  };

  const addCredit = async (creditData) => {
    const product = products.find(p => p.id === creditData.productId);
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
    if (!error) setCredits(prev => [...prev, ...data]);
    return data?.[0];
  };

  const updateCredit = async (id, creditData) => {
    const { data } = await supabase.from('credits').update(creditData).eq('id', id).select();
    if (data) setCredits(prev => prev.map(c => c.id === id ? data[0] : c));
  };

  const addPayment = async (paymentData) => {
    const newPayment = {
      ...paymentData,
      date: new Date().toISOString()
    };

    const { data, error } = await supabase.from('payments').insert(newPayment).select();
    if (error) return null;
    const payment = data[0];

    const credit = credits.find(c => c.id === payment.creditId);
    if (!credit) return null;

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

    setCredits(prev =>
      prev.map(c => c.id === credit.id ? { ...c, paymentPlan: updatedPaymentPlan } : c)
    );
    setPayments(prev => [...prev, payment]);

    return payment;
  };

  const getStats = () => {
    const totalClients = users.length;
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
      sum + credit.paymentPlan.reduce((s, i) =>
        s + (i.amount - i.paidAmount), 0), 0
    );

    return {
      totalClients,
      activeCredits,
      overdueCredits,
      totalPayments,
      totalIncome,
      totalToCobrar
    };
  };

  const value = {
    users,
    products,
    credits,
    payments,
    addUser,
    updateUser,
    deleteUser,
    addProduct,
    updateProduct,
    deleteProduct,
    addCredit,
    updateCredit,
    addPayment,
    getStats
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
