import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import ProductCard from '@/components/ProductCard';
import { mockProducts } from '@/data/mockData';
import { Product, ProductCategory, ProductStatus, TransactionType } from '@/types/surplus';
import { Search, Filter, MapPin, Package, Calendar, Building, Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const categories = Object.values(ProductCategory);
  const statuses = Object.values(ProductStatus);
  const transactionTypes = Object.values(TransactionType);

  // Filter products based on search and filters
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.company?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, selectedCategory, selectedStatus, selectedTransactionType]);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleInterested = (product: Product) => {
    toast.success(`Intérêt exprimé pour "${product.title}"`);
    console.log('Interest expressed for product:', product);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-accent-50 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Marketplace Surplus</h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Découvrez les surplus disponibles et trouvez les opportunités parfaites pour votre entreprise ou association.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>{filteredProducts.length} surplus disponibles</span>
              <span>•</span>
              <span>Mis à jour en temps réel</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recherche</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Catégorie</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Statut</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {getStatusText(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Stats */}
                <div className="pt-4 border-t space-y-3">
                  <h4 className="font-medium">Statistiques rapides</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total surplus</span>
                      <Badge variant="secondary">{mockProducts.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Disponibles</span>
                      <Badge variant="secondary">
                        {mockProducts.filter(p => p.status === ProductStatus.AVAILABLE).length}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Valeur totale</span>
                      <Badge variant="secondary">
                        {formatPrice(mockProducts.reduce((sum, p) => sum + p.estimatedValue, 0))}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={handleViewDetails}
                    onInterested={handleInterested}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucun surplus trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  Aucun surplus ne correspond à vos critères de recherche.
                </p>
                <Button onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                }}>
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  {selectedProduct.title}
                  <Badge className={getStatusColor(selectedProduct.status)}>
                    {getStatusText(selectedProduct.status)}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Détails complets du surplus disponible
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image */}
                <div className="aspect-video overflow-hidden rounded-lg">
                  <img
                    src={selectedProduct.images[0] || '/placeholder.svg'}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">{selectedProduct.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-1">Quantité</h5>
                      <p className="text-sm text-muted-foreground">
                        {selectedProduct.quantity} {selectedProduct.unit}
                      </p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-1">Valeur estimée</h5>
                      <p className="text-sm font-semibold text-primary">
                        {formatPrice(selectedProduct.estimatedValue)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-1 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Entreprise
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      {selectedProduct.company?.name}
                    </p>
                  </div>

                  <div>
                    <h5 className="font-medium mb-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Localisation
                    </h5>
                    <p className="text-sm text-muted-foreground">{selectedProduct.location}</p>
                  </div>

                  {selectedProduct.expirationDate && (
                    <div>
                      <h5 className="font-medium mb-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date d'expiration
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedProduct.expirationDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  )}

                  <div className="pt-4 flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => handleInterested(selectedProduct)}
                      disabled={selectedProduct.status !== ProductStatus.AVAILABLE}
                    >
                      {selectedProduct.estimatedValue === 0 ? (
                        <>
                          <Heart className="w-4 h-4 mr-2" />
                          Demander ce don
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Acheter ce surplus
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marketplace;
