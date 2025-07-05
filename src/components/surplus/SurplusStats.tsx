
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, TrendingUp, Eye, Users } from 'lucide-react';
import { Product, ProductStatus } from '@/types';

interface SurplusStatsProps {
  products: Product[];
}

const SurplusStats: React.FC<SurplusStatsProps> = ({ products }) => {
  const availableCount = products.filter(p => p.status === ProductStatus.AVAILABLE).length;
  const totalViews = products.reduce((acc, p) => acc + (p.views || 0), 0);
  const totalInterests = products.reduce((acc, p) => acc + (p.interests || 0), 0);

  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total surplus</p>
              <p className="text-2xl font-bold">{products.length}</p>
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
              <p className="text-2xl font-bold text-green-600">{availableCount}</p>
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
              <p className="text-2xl font-bold">{totalViews}</p>
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
              <p className="text-2xl font-bold text-blue-600">{totalInterests}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurplusStats;
