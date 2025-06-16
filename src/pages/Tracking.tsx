
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import LogisticsTracker from '@/components/LogisticsTracker';
import { 
  Search, 
  Package, 
  Truck, 
  MapPin, 
  Clock,
  Filter,
  Eye,
  Download,
  MessageSquare
} from 'lucide-react';
import { Transaction, TransactionStatus, TransactionType } from '@/types/surplus';

const Tracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  // Données simulées des transactions
  const transactions: Transaction[] = [
    {
      id: 'TR001',
      type: TransactionType.DONATION,
      productId: 'PR001',
      sellerId: 'COMP001',
      buyerId: 'ASSO001',
      price: 0,
      status: TransactionStatus.IN_TRANSIT,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      product: {
        id: 'PR001',
        title: 'Ordinateurs portables Dell',
        description: 'Lot de 15 ordinateurs portables',
        category: 'OFFICE_EQUIPMENT' as any,
        quantity: 15,
        unit: 'pièces',
        estimatedValue: 0,
        location: 'Paris, France',
        status: 'RESERVED' as any,
        companyId: 'COMP001',
        createdAt: new Date()
      }
    },
    {
      id: 'TR002',
      type: TransactionType.SALE,
      productId: 'PR002',
      sellerId: 'COMP002',
      buyerId: 'STARTUP001',
      price: 1200,
      status: TransactionStatus.COMPLETED,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      product: {
        id: 'PR002',
        title: 'Mobilier de bureau',
        description: 'Ensemble de bureaux et chaises',
        category: 'FURNITURE' as any,
        quantity: 20,
        unit: 'pièces',
        estimatedValue: 1200,
        location: 'Lyon, France',
        status: 'COMPLETED' as any,
        companyId: 'COMP002',
        createdAt: new Date()
      }
    }
  ];

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PENDING:
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case TransactionStatus.IN_TRANSIT:
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case TransactionStatus.COMPLETED:
        return 'bg-green-500/10 text-green-700 border-green-200';
      case TransactionStatus.CANCELLED:
        return 'bg-red-500/10 text-red-700 border-red-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.PENDING:
        return 'En attente';
      case TransactionStatus.IN_TRANSIT:
        return 'En transit';
      case TransactionStatus.COMPLETED:
        return 'Complété';
      case TransactionStatus.CANCELLED:
        return 'Annulé';
      default:
        return 'Inconnu';
    }
  };

  const getTransactionTypeText = (type: TransactionType) => {
    switch (type) {
      case TransactionType.DONATION:
        return 'Don';
      case TransactionType.SALE:
        return 'Vente';
      case TransactionType.RECYCLING:
        return 'Recyclage';
      default:
        return 'Inconnu';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.product?.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Suivi des Transactions</h1>
            <p className="text-muted-foreground">
              Suivez vos transactions et livraisons en temps réel
            </p>
          </div>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Transactions Actives</TabsTrigger>
            <TabsTrigger value="completed">Historique</TabsTrigger>
            <TabsTrigger value="tracking">Suivi Détaillé</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {/* Filtres */}
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par ID ou nom de produit..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Liste des transactions */}
            <div className="grid gap-6">
              {filteredTransactions.map((transaction) => (
                <Card key={transaction.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{transaction.product?.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Transaction #{transaction.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {getTransactionTypeText(transaction.type)}
                        </Badge>
                        <Badge className={getStatusColor(transaction.status)}>
                          {getStatusText(transaction.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {transaction.product?.quantity} {transaction.product?.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{transaction.product?.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {transaction.createdAt.toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    {transaction.price > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Montant:</span>
                        <span className="font-semibold text-primary">
                          {formatPrice(transaction.price)}
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedTransaction(transaction.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir détails
                      </Button>
                      {transaction.status === TransactionStatus.IN_TRANSIT && (
                        <Button variant="outline" size="sm">
                          <Truck className="h-4 w-4 mr-2" />
                          Suivre livraison
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contacter
                      </Button>
                      {transaction.status === TransactionStatus.COMPLETED && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Certificat
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Transactions Complétées</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Historique de toutes vos transactions complétées...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking">
            {selectedTransaction ? (
              <LogisticsTracker 
                transactionId={selectedTransaction}
                onStatusUpdate={(status) => console.log('Status updated:', status)}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Suivi Détaillé</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Sélectionnez une transaction pour voir le suivi détaillé...
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Tracking;
