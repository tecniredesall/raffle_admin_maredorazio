import { useState, useCallback, useMemo } from 'react';
import { Transaction, TransactionStatus } from '../types';

// Mock Data
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    transactionNumber: 'GM16598',
    name: 'Carlos Mendoza',
    cedula: 'V-18264582',
    phone: '+58 414 1234567',
    email: 'carlos@example.com',
    reference: '00928391',
    seedCount: 5,
    totalAmount: '45 MXN',
    paymentMethod: 'Transferencia SPEI',
    status: 'pending',
    createdAt: '2024-05-12T10:30:00Z',
    paymentProofUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=600&h=800',
  },
  {
    id: '2',
    transactionNumber: 'GM16599',
    name: 'María Fernández',
    cedula: 'V-20155699',
    phone: '+58 424 9876543',
    email: 'maria.f@example.com',
    reference: 'REF-88221',
    seedCount: 2,
    totalAmount: '18 MXN',
    paymentMethod: 'Pago Móvil',
    status: 'confirmed',
    createdAt: '2024-05-12T09:15:00Z',
    confirmedAt: '2024-05-12T10:00:00Z',
    paymentProofUrl: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=600&h=800',
  },
  {
    id: '3',
    transactionNumber: 'GM16600',
    name: 'Luis Herrera',
    cedula: 'V-15888222',
    phone: '+58 412 5556677',
    email: 'luis.h@example.com',
    reference: 'TR-119933',
    seedCount: 10,
    totalAmount: '90 MXN',
    paymentMethod: 'Transferencia Bancaria',
    status: 'pending',
    createdAt: '2024-05-12T11:45:00Z',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600&h=800',
  },
  {
    id: '4',
    transactionNumber: 'GM16601',
    name: 'Ana Silva',
    cedula: 'E-84392011',
    phone: '+52 55 1234 5678',
    email: 'ana.silva@example.com',
    reference: 'SPEI-8843',
    seedCount: 1,
    totalAmount: '9 MXN',
    paymentMethod: 'Transferencia SPEI',
    status: 'rejected',
    createdAt: '2024-05-11T16:20:00Z',
    paymentProofUrl: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&q=80&w=600&h=800',
  },
  {
    id: '5',
    transactionNumber: 'GM16602',
    name: 'Jorge Ramos',
    cedula: 'V-22334455',
    phone: '+58 414 1112233',
    email: 'jramos@example.com',
    reference: '0029384',
    seedCount: 3,
    totalAmount: '27 MXN',
    paymentMethod: 'Pago Móvil',
    status: 'pending',
    createdAt: '2024-05-12T12:10:00Z',
    paymentProofUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=600&h=800',
  },
  {
    id: '6',
    transactionNumber: 'GM16603',
    name: 'Elena Gómez',
    cedula: 'V-19887766',
    phone: '+58 424 5554433',
    email: 'elena.g@example.com',
    reference: 'REF-112233',
    seedCount: 20,
    totalAmount: '180 MXN',
    paymentMethod: 'Zelle',
    status: 'confirmed',
    createdAt: '2024-05-10T08:30:00Z',
    confirmedAt: '2024-05-10T09:00:00Z',
    paymentProofUrl: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=600&h=800',
  },
  {
    id: '7',
    transactionNumber: 'GM16604',
    name: 'Diego Castro',
    cedula: 'V-25443322',
    phone: '+58 412 9998877',
    email: 'dcastro@example.com',
    reference: '445566',
    seedCount: 4,
    totalAmount: '36 MXN',
    paymentMethod: 'Transferencia Bancaria',
    status: 'pending',
    createdAt: '2024-05-12T13:05:00Z',
    paymentProofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600&h=800',
  },
  {
    id: '8',
    transactionNumber: 'GM16605',
    name: 'Valeria Rojas',
    cedula: 'E-88776655',
    phone: '+52 55 9876 5432',
    email: 'vrojas@example.com',
    reference: 'SPEI-9988',
    seedCount: 2,
    totalAmount: '18 MXN',
    paymentMethod: 'Transferencia SPEI',
    status: 'pending',
    createdAt: '2024-05-12T14:22:00Z',
    paymentProofUrl: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&q=80&w=600&h=800',
  }
];

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  const confirmTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.map(t => 
      t.id === id 
        ? { ...t, status: 'confirmed', confirmedAt: new Date().toISOString() } 
        : t
    ));
  }, []);

  const rejectTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.map(t => 
      t.id === id 
        ? { ...t, status: 'rejected' } 
        : t
    ));
  }, []);

  const getStats = useCallback(() => {
    return {
      total: transactions.length,
      pending: transactions.filter(t => t.status === 'pending').length,
      confirmed: transactions.filter(t => t.status === 'confirmed').length,
      rejected: transactions.filter(t => t.status === 'rejected').length,
    };
  }, [transactions]);

  return {
    transactions,
    confirmTransaction,
    rejectTransaction,
    stats: getStats(),
  };
}
