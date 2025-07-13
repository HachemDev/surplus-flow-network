
import { useState, useEffect } from 'react';
import { mockProducts } from '@/data/mockData';
import { Product, ProductStatus, ProductCondition } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export const useProducts = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const userProducts = mockProducts.filter(p => p.company?.id === String(currentUser?.companyId));
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
      imageBlob: '/placeholder.svg',
      status: ProductStatus.AVAILABLE,
      owner: {
        id: String(currentUser?.id || '1'),
        login: currentUser?.login || 'user',
        email: currentUser?.email || 'user@example.com',
        activated: true,
        createdDate: new Date(),
        authorities: ['ROLE_USER']
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      expirationDate: productData.expiration ? new Date(productData.expiration) : undefined,
      pickupInstructions: productData.pickup,
      views: 0,
      interests: 0,
      tags: '',
      condition: ProductCondition.GOOD,
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
