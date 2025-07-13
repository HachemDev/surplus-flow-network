
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ProductCard from '@/components/ProductCard';
import { mockProducts } from '@/data/mockData';
import { Product, ProductCategory, ProductStatus, TransactionType } from '@/types';
import { Search, Filter, MapPin, Package, Calendar, Building, Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestType, setRequestType] = useState<TransactionType>(TransactionType.SALE);

  // Filtrer les produits disponibles
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || product.location.includes(selectedLocation);
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'free' && product.salePrice === 0) ||
                        (priceFilter === 'paid' && product.salePrice > 0);
    const isAvailable = product.status === ProductStatus.AVAILABLE;

    return matchesSearch && matchesCategory && matchesLocation && matchesPrice && isAvailable;
  });

  const handleProductRequest = () => {
    if (!selectedProduct) return;

    // Simuler une demande
    toast.success(
      requestType === TransactionType.DONATION 
        ? 'Demande de don envoyée avec succès !' 
        : 'Demande d\'achat envoyée avec succès !'
    );
    
    setSelectedProduct(null);
    setRequestMessage('');
  };

  const categories = [
    { value: 'all', label: 'Toutes catégories' },
    { value: ProductCategory.ELECTRONICS, label: 'Électronique' },
    { value: ProductCategory.FURNITURE, label: 'Mobilier' },
    { value: ProductCategory.TEXTILE, label: 'Textile' },
    { value: ProductCategory.OFFICE_EQUIPMENT, label: 'Équipement bureau' },
    { value: ProductCategory.CONSTRUCTION_MATERIALS, label: 'Matériaux construction' },
    { value: ProductCategory.FOOD, label: 'Alimentaire' },
  ];

  const locations = [
    { value: 'all', label: 'Toutes localisations' },
    { value: 'Paris', label: 'Paris' },
    { value: 'Lyon', label: 'Lyon' },
    { value: 'Marseille', label: 'Marseille' },
    { value: 'Toulouse', label: 'Toulouse' },
    { value: 'Lille', label: 'Lille' },
    { value: 'Bordeaux', label: 'Bordeaux' },
    { value: 'Nantes', label: 'Nantes' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground">
            Découvrez les surplus disponibles et faites vos demandes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres de recherche
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Recherche textuelle */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtres par critères */}
          <div className="grid md:grid-cols-4 gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Localisation" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Prix" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les prix</SelectItem>
                <SelectItem value="free">Gratuit (don)</SelectItem>
                <SelectItem value="paid">Payant</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedLocation('all');
                setPriceFilter('all');
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des produits */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun produit trouvé</h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos critères de recherche.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={product.images[0] || '/placeholder.svg'}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant={product.salePrice === 0 ? 'default' : 'secondary'}>
                    {product.salePrice === 0 ? 'Don' : `${product.salePrice}€`}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {product.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Informations produit */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{product.quantity} {product.unit}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="text-muted-foreground">{product.category}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{product.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{product.company.name}</span>
                  </div>

                  {product.expirationDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Expire le {new Date(product.expirationDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {product.salePrice === 0 ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="flex-1" 
                          onClick={() => {
                            setSelectedProduct(product);
                            setRequestType(TransactionType.DONATION);
                          }}
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Demander le don
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="flex-1"
                          onClick={() => {
                            setSelectedProduct(product);
                            setRequestType(TransactionType.SALE);
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Acheter
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  )}
                  
                  <Button variant="outline" size="sm">
                    Voir détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de demande */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {requestType === TransactionType.DONATION ? 'Demande de don' : 'Demande d\'achat'}
            </DialogTitle>
            <DialogDescription>
              Envoyez votre demande pour {selectedProduct?.title}
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              {/* Résumé du produit */}
              <div className="flex gap-4 p-4 border rounded-lg">
                <img
                  src={selectedProduct.images[0] || '/placeholder.svg'}
                  alt={selectedProduct.title}
                  className="w-20 h-20 rounded object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{selectedProduct.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedProduct.quantity} {selectedProduct.unit} • {selectedProduct.location}
                  </p>
                  <p className="text-sm font-medium text-primary">
                    {selectedProduct.salePrice === 0 ? 'Gratuit' : `${selectedProduct.salePrice}€`}
                  </p>
                </div>
              </div>

              {/* Type de demande */}
              <div>
                <Label>Type de demande</Label>
                <Tabs value={requestType} onValueChange={(value) => setRequestType(value as TransactionType)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value={TransactionType.DONATION} disabled={selectedProduct.salePrice > 0}>
                      Don (gratuit)
                    </TabsTrigger>
                    <TabsTrigger value={TransactionType.SALE}>
                      Achat ({selectedProduct.salePrice}€)
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message">Message à l'entreprise</Label>
                <Textarea
                  id="message"
                  placeholder="Expliquez brièvement pourquoi vous souhaitez ce produit et comment vous comptez l'utiliser..."
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Informations de livraison */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Informations de récupération</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedProduct.pickupInstructions || 'Contactez l\'entreprise pour organiser la récupération.'}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProduct(null)}>
              Annuler
            </Button>
            <Button onClick={handleProductRequest} disabled={!requestMessage.trim()}>
              Envoyer la demande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marketplace;
