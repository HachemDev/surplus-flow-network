
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  Package, 
  Heart, 
  ShoppingCart, 
  Truck, 
  AlertTriangle,
  CheckCircle,
  X,
  Mail
} from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'surplus_match' | 'transaction_update' | 'delivery_update' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Simulation de notifications en temps réel
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'surplus_match',
        title: 'Nouveau surplus correspondant',
        message: 'Un nouveau surplus correspond à vos critères de recherche: Ordinateurs portables Dell',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        priority: 'high'
      },
      {
        id: '2',
        type: 'transaction_update',
        title: 'Transaction acceptée',
        message: 'Votre demande pour "Mobilier de bureau" a été acceptée par Tech Solutions',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        priority: 'medium'
      },
      {
        id: '3',
        type: 'delivery_update',
        title: 'Livraison en cours',
        message: 'Votre colis SP360-ABC123 est en transit et arrivera demain',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        priority: 'medium'
      },
      {
        id: '4',
        type: 'system',
        title: 'Nouveau certificat fiscal',
        message: 'Votre certificat de don pour la transaction #TR001 est disponible',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        read: true,
        priority: 'low'
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);

    // Simulation de nouvelles notifications
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'surplus_match',
        title: 'Nouveau surplus disponible',
        message: `Un nouveau surplus vient d'être publié dans votre région`,
        timestamp: new Date(),
        read: false,
        priority: 'medium'
      };

      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Toast notification
      toast.success('Nouvelle notification reçue!', {
        description: newNotification.message
      });
    }, 30000); // Nouvelle notification toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'surplus_match':
        return Package;
      case 'transaction_update':
        return ShoppingCart;
      case 'delivery_update':
        return Truck;
      case 'system':
        return Bell;
      default:
        return Bell;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 px-1 min-w-[1.2rem] h-5 text-xs bg-red-500 hover:bg-red-500">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Notifications</DialogTitle>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs"
              >
                <Mail className="h-4 w-4 mr-1" />
                Tout marquer lu
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-96 px-6 pb-6">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Aucune notification</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                return (
                  <Card 
                    key={notification.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      !notification.read ? 'border-primary/50 bg-primary/5' : 'border-gray-200'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full bg-gray-100 ${getPriorityColor(notification.priority)}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium ${
                              !notification.read ? 'text-primary' : 'text-foreground'
                            }`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full" />
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.timestamp.toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationCenter;
