
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

const ProductDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Package className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Détails du Surplus</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Surplus ID: {id}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Fonctionnalité en cours de développement. Cette page affichera les détails complets d'un surplus.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetailPage;
