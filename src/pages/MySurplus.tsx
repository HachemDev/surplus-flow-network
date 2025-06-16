
import { useState } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Package,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Upload,
  MapPin,
  Calendar,
  TrendingUp,
  Users,
  Search
} from 'lucide-react';
import { mockProducts } from '@/data/mockData';
import { Product, ProductCategory, ProductStatus } from '@/types';
import { toast } from 'sonner';

const MySurplus = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Mock data pour l'utilisateur connecté
  const userProducts = mockProducts.filter(p => p.companyId === '1'); // EcoTech Solutions

  const filteredProducts = userProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const handleAddProduct = () => {
    // Logique d'ajout de produit
    toast.success('Produit ajouté avec succès !');
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDeleteProduct = (productId: string) => {
    // Logique de suppression
    toast.success('Produit supprimé avec succès !');
  };

  const categories = [
    { value: ProductCategory.ELECTRONICS, label: 'Électronique' },
    { value: ProductCategory.FURNITURE, label: 'Mobilier' },
    { value: ProductCategory.TEXTILE, label: 'Textile' },
    { value: ProductCategory.OFFICE_EQUIPMENT, label: 'Équipement bureau' },
    { value: ProductCategory.CONSTRUCTION_MATERIALS, label: 'Matériaux construction' },
    { value: ProductCategory.FOOD, label: 'Alimentaire' },
  ];

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total surplus</p>
                <p className="text-2xl font-bold">{userProducts.length}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Disponibles</p>
                <p className="text-2xl font-bold text-green-600">
                  {userProducts.filter(p => p.status === ProductStatus.AVAILABLE).length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vues totales</p>
                <p className="text-2xl font-bold">
                  {userProducts.reduce((acc, p) => acc + (p.views || 0), 0)}
                </p>
              </div>
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Intérêts</p>
                <p className="text-2xl font-bold text-blue-600">
                  {userProducts.reduce((acc, p) => acc + (p.interests || 0), 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header principal */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes surplus</h1>
          <p className="text-muted-foreground">
            Gérez vos surplus et suivez leurs performances
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un surplus
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* Filtres */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un surplus..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value={ProductStatus.AVAILABLE}>Disponible</SelectItem>
            <SelectItem value={ProductStatus.RESERVED}>Réservé</SelectItem>
            <SelectItem value={ProductStatus.COMPLETED}>Vendu</SelectItem>
            <SelectItem value={ProductStatus.IN_PROGRESS}>En cours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Liste des produits */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm ? 'Aucun surplus trouvé' : 'Aucun surplus publié'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Essayez de modifier vos critères de recherche.'
                : 'Commencez par publier votre premier surplus pour le partager avec la communauté.'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Publier mon premier surplus
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="card-hover border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={product.images[0] || '/placeholder.svg'}
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
                      <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Voir les détails
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteProduct(product.id)}
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
                {/* Informations produit */}
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

                {/* Statistiques */}
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

                {/* Localisation et date */}
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
          ))}
        </div>
      )}

      {/* Dialog d'ajout de produit */}
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau surplus</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour publier votre surplus
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Titre */}
          <div>
            <Label htmlFor="title">Titre du surplus *</Label>
            <Input id="title" placeholder="Ex: Ordinateurs portables Dell reconditionnés" />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea 
              id="description" 
              placeholder="Décrivez en détail votre surplus, son état, ses caractéristiques..."
              rows={4}
            />
          </div>

          {/* Catégorie et quantité */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Catégorie *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="quantity">Quantité *</Label>
              <div className="flex gap-2">
                <Input id="quantity" type="number" placeholder="10" />
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Unité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pieces">pièces</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="m2">m²</SelectItem>
                    <SelectItem value="litres">litres</SelectItem>
                    <SelectItem value="cartons">cartons</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Prix */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimatedValue">Valeur estimée (€)</Label>
              <Input id="estimatedValue" type="number" placeholder="5000" />
            </div>
            <div>
              <Label htmlFor="salePrice">Prix de vente (€)</Label>
              <Input id="salePrice" type="number" placeholder="0 pour un don" />
            </div>
          </div>

          {/* Localisation */}
          <div>
            <Label htmlFor="location">Localisation *</Label>
            <Input id="location" placeholder="Ex: Paris, France" />
          </div>

          {/* Date d'expiration */}
          <div>
            <Label htmlFor="expiration">Date d'expiration (optionnel)</Label>
            <Input id="expiration" type="date" />
          </div>

          {/* Instructions de récupération */}
          <div>
            <Label htmlFor="pickup">Instructions de récupération</Label>
            <Textarea 
              id="pickup" 
              placeholder="Indiquez les modalités de récupération (horaires, accès, équipe nécessaire...)"
              rows={3}
            />
          </div>

          {/* Images */}
          <div>
            <Label>Images du produit</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Cliquez pour ajouter des images ou glissez-déposez
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG jusqu'à 10MB (max 5 images)
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleAddProduct}>
            Publier le surplus
          </Button>
        </DialogFooter>
      </DialogContent>
    </div>
  );
};

export default MySurplus;
