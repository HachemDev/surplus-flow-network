
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Calendar,
  MapPin,
  Phone,
  Truck,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';

interface TransactionCardProps {
  transaction: any;
  logistics?: any;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ 
  transaction, 
  logistics, 
  onAccept, 
  onReject 
}) => {
  const { currentUser } = useAuth();

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

  const isUserSeller = transaction.sellerId === currentUser?.companyId;

  return (
    <Card className="hover:shadow-md transition-shadow">
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
          </div>
        )}

        {/* Actions */}
        {transaction.status === 'PENDING' && isUserSeller && onAccept && onReject && (
          <div className="flex gap-2 pt-4 border-t">
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onAccept(transaction.id)}
            >
              Accepter
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => onReject(transaction.id)}
            >
              Refuser
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
