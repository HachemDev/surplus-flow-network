
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Product, TransactionType, ProductStatus } from '@/types/surplus';
import { 
  MapPin, 
  Calendar, 
  Package, 
  Building, 
  Heart,
  ShoppingCart,
  Eye,
  AlertTriangle
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onInterested: (product: Product) => void;
}

const ProductCard = ({ product, onViewDetails, onInterested }: ProductCardProps) => {
  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.AVAILABLE:
        return 'bg-green-500/10 text-green-700 border-green-200';
      case ProductStatus.RESERVED:
        return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case ProductStatus.IN_PROGRESS:
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.AVAILABLE:
        return 'Disponible';
      case ProductStatus.RESERVED:
        return 'Réservé';
      case ProductStatus.IN_PROGRESS:
        return 'En cours';
      default:
        return 'Complété';
    }
  };

  const getCategoryIcon = (category: string) => {
    // Simple package icon for all categories in this example
    return Package;
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const isExpiringSoon = product.expirationDate && 
    new Date(product.expirationDate).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000; // 30 days

  const CategoryIcon = getCategoryIcon(product.category);

  return (
    <Card className="card-hover overflow-hidden group border-0 shadow-sm bg-card/50 backdrop-blur-sm">
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={product.imageUrl || '/placeholder.svg'}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1 sm:flex-row sm:gap-2">
          <Badge className={getStatusColor(product.status)}>
            {getStatusText(product.status)}
          </Badge>
          {isExpiringSoon && (
            <Badge variant="destructive" className="bg-red-500/10 text-red-700 border-red-200">
              <AlertTriangle className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Urgent</span>
            </Badge>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs">
            <CategoryIcon className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">{product.category.replace('_', ' ')}</span>
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-base sm:text-lg leading-tight line-clamp-2">
            {product.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {/* Company */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Building className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="font-medium truncate">{product.company?.name}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="truncate">{product.location}</span>
        </div>

        {/* Quantity & Value */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Package className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium">{product.quantity} {product.unit}</span>
          </div>
          <div className="text-right">
            <div className="font-semibold text-primary text-sm sm:text-base">
              {formatPrice(product.estimatedValue)}
            </div>
            <div className="text-xs text-muted-foreground">Valeur estimée</div>
          </div>
        </div>

        {/* Expiration Date */}
        {product.expirationDate && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">
              Expire le {new Date(product.expirationDate).toLocaleDateString('fr-FR')}
            </span>
          </div>
        )}

        {/* Posted Date */}
        <div className="text-xs text-muted-foreground">
          Publié le {new Date(product.createdAt).toLocaleDateString('fr-FR')}
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full sm:flex-1"
          onClick={() => onViewDetails(product)}
        >
          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          <span className="text-xs sm:text-sm">Détails</span>
        </Button>
        <Button 
          size="sm" 
          className="w-full sm:flex-1"
          onClick={() => onInterested(product)}
          disabled={product.status !== ProductStatus.AVAILABLE}
        >
          {product.estimatedValue === 0 ? (
            <>
              <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              <span className="text-xs sm:text-sm">Intéressé</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              <span className="text-xs sm:text-sm">Acheter</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
