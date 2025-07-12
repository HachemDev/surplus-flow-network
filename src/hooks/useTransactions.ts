
import { useState, useEffect } from 'react';
import { mockTransactions } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

export const useTransactions = () => {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const userTransactions = mockTransactions.filter(t => 
        t.sellerId === String(currentUser?.companyId) || 
        t.buyerId === String(currentUser?.companyId) ||
        t.requesterId === String(currentUser?.companyId)
      );
      setTransactions(userTransactions);
      setLoading(false);
    }, 500);
  }, [currentUser]);

  const acceptTransaction = (transactionId: string) => {
    setTransactions(prev =>
      prev.map(t =>
        t.id === transactionId
          ? { ...t, status: 'ACCEPTED', acceptedAt: new Date() }
          : t
      )
    );
  };

  const rejectTransaction = (transactionId: string) => {
    setTransactions(prev =>
      prev.map(t =>
        t.id === transactionId
          ? { ...t, status: 'CANCELLED' }
          : t
      )
    );
  };

  return {
    transactions,
    loading,
    acceptTransaction,
    rejectTransaction
  };
};
