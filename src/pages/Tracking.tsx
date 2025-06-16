
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { mockTransactions, mockLogistics } from '@/data/mockData';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Calendar,
  Search,
  Filter,
  Download,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Tracking = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Filtrer les transactions de l'utilisateur
  const userTransactions = mockTransactions.filter(t => 
    t.sellerId === currentUser?.companyId || 
    t.buyerId === currentUser?.companyId ||
    t.requesterId === currentUser?.companyId
  );

  const filteredTransactions = userTransactions.filter(transaction => {
    const matchesSearch = transaction.product?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && transaction.status === 'PENDING';
    if (activeTab === 'in-progress') return matchesSearch && (transaction.status === 'ACCEPTED' || transaction.status === 'IN_TRANSIT');
    if (activeTab === 'completed') return matchesSearch && transaction.status === 'COMPLETED';
    
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED': return 'bg-blue-100 text-blue-800';
      case 'IN_TRANSIT': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'En attente';
      case 'ACCEPTED': return 'Acceptée';
      case 'IN_TRANSIT': return 'En transit';
      case 'COMPLETED': return 'Terminée';
      case 'CANCELLED': return 'Annulée';
      default: return status;
    }
  };

  const getLogisticsForTransaction = (transactionId: string) => {
    return mockLogistics.find(l => l.transactionId === transactionId);
  };

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
            Toutes ({userTransactions.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            En attente ({userTransactions.filter(t => t.status === 'PENDING').length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            En cours ({userTransactions.filter(t => t.status === 'ACCEPTED' || t.status === 'IN_TRANSIT').length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Terminées ({userTransactions.filter(t => t.status === 'COMPLETED').length})
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
              const isUserSeller = transaction.sellerId === currentUser?.companyId;
              const isUserBuyer = transaction.buyerId === currentUser?.companyId;
              
              return (
                <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-lg">{transaction.product?.title}</CardTitle>
                          <Badge className={getStatusColor(transaction.status)}>
                            {getStatusLabel(transaction.status)}
                          </Badge>
                        </div>
                        <CardDescription>
                          Transaction #{transaction.id} • {transaction.type === 'DONATION' ? 'Don' : 'Vente'} • 
                          {transaction.price === 0 ? ' Gratuit' : ` ${transaction.price}€`}
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Informations de la transaction */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          Informations produit
                        </h4>
                        <div className="text-sm space-y-1">
                          <p><span className="font-medium">Quantité:</span> {transaction.quantity} {transaction.product?.unit}</p>
                          <p><span className="font-medium">Catégorie:</span> {transaction.product?.category}</p>
                          <p><span className="font-medium">Lieu:</span> {transaction.product?.location}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Dates importantes
                        </h4>
                        <div className="text-sm space-y-1">
                          <p>
                            <span className="font-medium">Demande:</span>{' '}
                            {format(transaction.createdAt, 'dd MMM yyyy', { locale: fr })}
                          </p>
                          {transaction.acceptedAt && (
                            <p>
                              <span className="font-medium">Acceptée:</span>{' '}
                              {format(transaction.acceptedAt, 'dd MMM yyyy', { locale: fr })}
                            </p>
                          )}
                          {transaction.completedAt && (
                            <p>
                              <span className="font-medium">Terminée:</span>{' '}
                              {format(transaction.completedAt, 'dd MMM yyyy', { locale: fr })}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Informations des parties */}
                    <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <h4 className="font-medium mb-2">
                          {isUserSeller ? 'Destinataire' : 'Fournisseur'}
                        </h4>
                        <div className="text-sm">
                          <p className="font-medium">
                            {isUserSeller ? transaction.buyer?.name : transaction.seller?.name}
                          </p>
                          <p className="text-muted-foreground">
                            {isUserSeller ? transaction.buyer?.type : transaction.seller?.type}
                          </p>
                        </div>
                      </div>

                      {transaction.message && (
                        <div>
                          <h4 className="font-medium mb-2">Message</h4>
                          <p className="text-sm text-muted-foreground">{transaction.message}</p>
                        </div>
                      )}
                    </div>

                    {/* Suivi logistique */}
                    {logistics && (
                      <div className="pt-4 border-t space-y-3">
                        <h4 className="font-medium flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          Suivi logistique
                        </h4>
                        
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Transporteur</p>
                            <p className="text-muted-foreground">{logistics.carrierName}</p>
                            <p className="text-muted-foreground">#{logistics.trackingNumber}</p>
                          </div>
                          
                          <div>
                            <p className="font-medium">Enlèvement</p>
                            <p className="text-muted-foreground">
                              {format(logistics.pickupDate, 'dd MMM yyyy', { locale: fr })}
                            </p>
                          </div>
                          
                          <div>
                            <p className="font-medium">Livraison prévue</p>
                            <p className="text-muted-foreground">
                              {format(logistics.estimatedDelivery, 'dd MMM yyyy', { locale: fr })}
                            </p>
                          </div>
                        </div>

                        {/* Historique de suivi */}
                        {logistics.trackingHistory && (
                          <div className="space-y-2">
                            <p className="font-medium">Historique de suivi</p>
                            <div className="space-y-2">
                              {logistics.trackingHistory.map((event, index) => (
                                <div key={event.id} className="flex items-start gap-3">
                                  <div className="flex-shrink-0 mt-1">
                                    {event.status === 'DELIVERED' ? (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : event.status === 'IN_TRANSIT' ? (
                                      <Truck className="h-4 w-4 text-blue-600" />
                                    ) : (
                                      <Clock className="h-4 w-4 text-yellow-600" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">{event.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {event.location}
                                      </span>
                                      <span>
                                        {format(event.timestamp, 'dd MMM yyyy à HH:mm', { locale: fr })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Contact */}
                        {logistics.contactPerson && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4" />
                            <span>Contact: {logistics.contactPerson} - {logistics.contactPhone}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    {transaction.status === 'PENDING' && isUserSeller && (
                      <div className="flex gap-2 pt-4 border-t">
                        <Button size="sm" className="flex-1">
                          Accepter
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Refuser
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tracking;
