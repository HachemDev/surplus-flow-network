
import { useState, useEffect } from 'react';
import { mockProducts } from '@/data/mockData';
import { Product, ProductStatus } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export const useProducts = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const userProducts = mockProducts.filter(p => p.companyId === String(currentUser?.companyId));
      setProducts(userProducts);
      setLoading(false);
    }, 500);
  }, [currentUser]);

  const addProduct = (productData: any) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      title: productData.title,
      description: productData.description,
      category: productData.category,
      quantity: parseInt(productData.quantity),
      unit: productData.unit,
      estimatedValue: parseInt(productData.estimatedValue) || 0,
      salePrice: parseInt(productData.salePrice) || 0,
      location: productData.location,
      images: ['/placeholder.svg'],
      status: ProductStatus.AVAILABLE,
      companyId: String(currentUser?.companyId || '1'),
      createdAt: new Date(),
      updatedAt: new Date(),
      expirationDate: productData.expiration ? new Date(productData.expiration) : undefined,
      pickupInstructions: productData.pickup,
      views: 0,
      interests: 0,
      tags: [],
      condition: 'GOOD',
    };

    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, ...updates, updatedAt: new Date() }
          : product
      )
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
  };

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
