
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockLogistics } from '@/data/mockData';
import { useTransactions } from '@/hooks/useTransactions';
import TransactionCard from '@/components/tracking/TransactionCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { 
  Package, 
  Search,
  Filter,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

const Tracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const { transactions, loading, acceptTransaction, rejectTransaction } = useTransactions();

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.product?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && transaction.status === 'PENDING';
    if (activeTab === 'in-progress') return matchesSearch && (transaction.status === 'ACCEPTED' || transaction.status === 'IN_TRANSIT');
    if (activeTab === 'completed') return matchesSearch && transaction.status === 'COMPLETED';
    
    return matchesSearch;
  });

  const getLogisticsForTransaction = (transactionId: string) => {
    return mockLogistics.find(l => l.transactionId === transactionId);
  };

  const handleAcceptTransaction = (transactionId: string) => {
    acceptTransaction(transactionId);
    toast.success('Transaction acceptée');
  };

  const handleRejectTransaction = (transactionId: string) => {
    rejectTransaction(transactionId);
    toast.success('Transaction refusée');
  };

  if (loading) {
    return <LoadingSpinner message="Chargement des transactions..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Suivi des transactions</h1>
          <p className="text-muted-foreground">
            Gérez et suivez vos demandes, ventes et dons
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </div>
      </div>

      {/* Recherche */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par ID de transaction ou nom de produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            Toutes ({transactions.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            En attente ({transactions.filter(t => t.status === 'PENDING').length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            En cours ({transactions.filter(t => t.status === 'ACCEPTED' || t.status === 'IN_TRANSIT').length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Terminées ({transactions.filter(t => t.status === 'COMPLETED').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune transaction trouvée</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Aucune transaction ne correspond à votre recherche.' : 'Vous n\'avez pas encore de transactions.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTransactions.map((transaction) => {
              const logistics = getLogisticsForTransaction(transaction.id);
              
              return (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  logistics={logistics}
                  onAccept={handleAcceptTransaction}
                  onReject={handleRejectTransaction}
                />
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tracking;
