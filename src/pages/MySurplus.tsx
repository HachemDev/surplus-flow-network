
import { useState } from 'react';
import { Product } from '@/types';
import { toast } from 'sonner';
import { useProducts } from '@/hooks/useProducts';
import SurplusStats from '@/components/surplus/SurplusStats';
import AddSurplusDialog from '@/components/surplus/AddSurplusDialog';
import SurplusFilters from '@/components/surplus/SurplusFilters';
import SurplusCard from '@/components/surplus/SurplusCard';
import EmptyState from '@/components/surplus/EmptyState';

const MySurplus = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddProduct = (data: any) => {
    addProduct(data);
    toast.success('Produit ajouté avec succès !');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    console.log('Editing product:', product);
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
    toast.success('Produit supprimé avec succès !');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de vos surplus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <SurplusStats products={products} />

      {/* Header principal */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes surplus</h1>
          <p className="text-muted-foreground">
            Gérez vos surplus et suivez leurs performances
          </p>
        </div>
        <AddSurplusDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={handleAddProduct}
        />
      </div>

      {/* Filtres */}
      <SurplusFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Liste des produits */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          searchTerm={searchTerm}
          onAddClick={() => setIsAddDialogOpen(true)}
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <SurplusCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MySurplus;
