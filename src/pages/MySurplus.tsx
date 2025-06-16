
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import { 
  Plus, 
  Package, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Calendar,
  Building,
  Filter,
  Search
} from 'lucide-react';
import { mockProducts } from '@/data/mockData';
import { Product, ProductCategory, ProductStatus } from '@/types/surplus';
import { toast } from 'sonner';

const MySurplus = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    category: '',
    quantity: '',
    unit: '',
    estimatedValue: '',
    location: '',
    expirationDate: ''
  });

  // Filter user's products (for demo, showing all mock products)
  const userProducts = mockProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const handleAddProduct = () => {
    // Basic validation
    if (!newProduct.title || !newProduct.category || !newProduct.quantity) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    console.log('Adding new product:', newProduct);
    toast.success('Surplus ajouté avec succès !');
    setIsAddModalOpen(false);
    setNewProduct({
      title: '',
      description: '',
      category: '',
      quantity: '',
      unit: '',
      estimatedValue: '',
      location: '',
      expirationDate: ''
    });
  };

  const handleDeleteProduct = (productId: string) => {
    console.log('Deleting product:', productId);
    toast.success('Surplus supprimé');
  };

  const handleEditProduct = (productId: string) => {
    console.log('Editing product:', productId);
    toast.info('Fonction d\'édition en développement');
  };

  const stats = [
    {
      title: 'Total Surplus',
      value: userProducts.length,
      description: 'Surplus publiés',
      color: 'text-blue-600'
    },
    {
      title: 'Disponibles',
      value: userProducts.filter(p => p.status === ProductStatus.AVAILABLE).length,
      description: 'Prêts à être récupérés',
      color: 'text-green-600'
    },
    {
      title: 'En cours',
      value: userProducts.filter(p => p.status === ProductStatus.IN_PROGRESS).length,
      description: 'Transactions actives',
      color: 'text-orange-600'
    },
    {
      title: 'Valeur totale',
      value: formatPrice(userProducts.reduce((sum, p) => sum + p.estimatedValue, 0)),
      description: 'Estimée',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes Surplus</h1>
            <p className="text-muted-foreground">
              Gérez vos surplus et suivez leur statut
            </p>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un surplus
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau surplus</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour publier votre surplus sur la marketplace
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Ordinateurs portables Dell..."
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({...newProduct, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <Select 
                    value={newProduct.category} 
                    onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ProductCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantité *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Ex: 15"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unité</Label>
                  <Input
                    id="unit"
                    placeholder="Ex: pièces, kg, lots..."
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedValue">Valeur estimée (€)</Label>
                  <Input
                    id="estimatedValue"
                    type="number"
                    placeholder="Ex: 1500"
                    value={newProduct.estimatedValue}
                    onChange={(e) => setNewProduct({...newProduct, estimatedValue: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    placeholder="Ex: Paris, France"
                    value={newProduct.location}
                    onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expirationDate">Date d'expiration</Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    value={newProduct.expirationDate}
                    onChange={(e) => setNewProduct({...newProduct, expirationDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez votre surplus en détail..."
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddProduct}>
                  Publier le surplus
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-6 border-0 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans mes surplus..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  {Object.values(ProductStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {getStatusText(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        {userProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProducts.map((product) => (
              <Card key={product.id} className="card-hover border-0 shadow-sm bg-card/50 backdrop-blur-sm">
                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={product.imageUrl || '/placeholder.svg'}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={getStatusColor(product.status)}>
                      {getStatusText(product.status)}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Quantité</span>
                    <span className="font-medium">{product.quantity} {product.unit}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Valeur estimée</span>
                    <span className="font-semibold text-primary">
                      {formatPrice(product.estimatedValue)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{product.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Publié le {new Date(product.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Voir
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditProduct(product.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun surplus trouvé</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Aucun surplus ne correspond à vos critères de recherche.'
                : 'Vous n\'avez pas encore publié de surplus.'
              }
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}>
              {searchTerm || statusFilter !== 'all' ? 'Réinitialiser les filtres' : 'Ajouter votre premier surplus'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySurplus;
