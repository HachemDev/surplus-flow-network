
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, Eye, MoreHorizontal, MapPin, Calendar } from 'lucide-react';
import { Product, ProductStatus } from '@/types';

interface SurplusCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const SurplusCard: React.FC<SurplusCardProps> = ({ product, onEdit, onDelete }) => {
  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.AVAILABLE:
        return 'bg-green-100 text-green-800';
      case ProductStatus.RESERVED:
        return 'bg-yellow-100 text-yellow-800';
      case ProductStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      case ProductStatus.IN_PROGRESS:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.AVAILABLE:
        return 'Disponible';
      case ProductStatus.RESERVED:
        return 'Réservé';
      case ProductStatus.COMPLETED:
        return 'Vendu';
      case ProductStatus.IN_PROGRESS:
        return 'En cours';
      default:
        return status;
    }
  };

  return (
    <Card className="card-hover border-0 shadow-sm bg-card/50 backdrop-blur-sm">
      <div className="relative aspect-video overflow-hidden rounded-t-lg">
        <img
          src={product.imageBlob || '/placeholder.svg'}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge className={getStatusColor(product.status)}>
            {getStatusLabel(product.status)}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                Voir les détails
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(product.id)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-medium">Quantité:</span>
            <span>{product.quantity} {product.unit}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Prix:</span>
            <span className="font-bold text-primary">
              {product.salePrice === 0 ? 'Gratuit' : `${product.salePrice}€`}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Catégorie:</span>
            <span>{product.category}</span>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-blue-600">{product.views || 0}</div>
            <div className="text-muted-foreground">Vues</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-green-600">{product.interests || 0}</div>
            <div className="text-muted-foreground">Intérêts</div>
          </div>
        </div>

        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            <span>{product.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>Publié le {new Date(product.createdAt).toLocaleDateString()}</span>
          </div>
          {product.expirationDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>Expire le {new Date(product.expirationDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SurplusCard;
