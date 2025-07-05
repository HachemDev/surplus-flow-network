
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Search } from 'lucide-react';

const ProductListPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Package className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Marché des Surplus</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Rechercher des surplus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Fonctionnalité en cours de développement. Cette page permettra de parcourir et rechercher tous les surplus disponibles.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductListPage;
