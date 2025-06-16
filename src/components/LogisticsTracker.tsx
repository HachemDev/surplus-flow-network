
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Truck, 
  Package, 
  Clock, 
  Phone, 
  Mail,
  Navigation,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Map as MapIcon
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TransactionStatus } from '@/types/surplus';

interface TrackingData {
  id: string;
  trackingNumber: string;
  status: TransactionStatus;
  currentLocation: string;
  estimatedDelivery: Date;
  progress: number;
  carrierName: string;
  carrierPhone: string;
  timeline: {
    timestamp: Date;
    location: string;
    status: string;
    description: string;
  }[];
}

interface LogisticsTrackerProps {
  transactionId: string;
  onStatusUpdate?: (status: TransactionStatus) => void;
}

const LogisticsTracker = ({ transactionId, onStatusUpdate }: LogisticsTrackerProps) => {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);

  // Simulation des données de tracking en temps réel
  useEffect(() => {
    const mockTrackingData: TrackingData = {
      id: transactionId,
      trackingNumber: `SP360-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: TransactionStatus.IN_TRANSIT,
      currentLocation: "Centre de tri Paris - Roissy",
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      progress: 65,
      carrierName: "DHL Express",
      carrierPhone: "+33 1 55 95 85 85",
      timeline: [
        {
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          location: "Entrepôt Paris Sud",
          status: "PICKED_UP",
          description: "Colis récupéré chez l'expéditeur"
        },
        {
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          location: "Centre de tri Paris",
          status: "IN_TRANSIT",
          description: "Colis en cours de traitement"
        },
        {
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          location: "Centre de tri Paris - Roissy",
          status: "IN_TRANSIT",
          description: "Colis en transit vers le destinataire"
        }
      ]
    };
    
    setTrackingData(mockTrackingData);
    
    // Simulation de mise à jour en temps réel
    const interval = setInterval(() => {
      setTrackingData(prev => {
        if (!prev) return prev;
        const newProgress = Math.min(prev.progress + Math.random() * 5, 100);
        return {
          ...prev,
          progress: newProgress,
          status: newProgress >= 100 ? TransactionStatus.COMPLETED : prev.status
        };
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [transactionId]);

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
        return 'Livré';
      case TransactionStatus.CANCELLED:
        return 'Annulé';
      default:
        return 'Inconnu';
    }
  };

  const refreshTracking = async () => {
    setIsLoading(true);
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const openMap = () => {
    setIsMapOpen(true);
  };

  if (!trackingData) {
    return <div>Chargement des informations de suivi...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header avec informations principales */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-blue-600" />
              Suivi de livraison
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshTracking}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openMap}
              >
                <MapIcon className="h-4 w-4 mr-2" />
                Voir sur la carte
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Numéro de suivi</p>
              <p className="font-mono text-sm bg-white/80 p-2 rounded border">
                {trackingData.trackingNumber}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Statut</p>
              <Badge className={getStatusColor(trackingData.status)}>
                {getStatusText(trackingData.status)}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Position actuelle</p>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="text-sm">{trackingData.currentLocation}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Livraison estimée</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm">
                  {trackingData.estimatedDelivery.toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Progression</span>
              <span className="text-sm text-muted-foreground">{Math.round(trackingData.progress)}%</span>
            </div>
            <Progress value={trackingData.progress} className="h-2" />
          </div>

          {/* Informations transporteur */}
          <div className="bg-white/80 p-4 rounded-lg border">
            <h4 className="font-medium mb-2">Transporteur</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">{trackingData.carrierName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{trackingData.carrierPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@dhl.fr</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline des événements */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-green-600" />
            Historique de livraison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trackingData.timeline.map((event, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  {index < trackingData.timeline.length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{event.description}</p>
                    <span className="text-xs text-muted-foreground">
                      {event.timestamp.toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de carte */}
      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Suivi sur carte</DialogTitle>
          </DialogHeader>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapIcon className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">
                Carte interactive avec suivi en temps réel
              </p>
              <p className="text-sm text-muted-foreground">
                Position actuelle: {trackingData.currentLocation}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LogisticsTracker;
