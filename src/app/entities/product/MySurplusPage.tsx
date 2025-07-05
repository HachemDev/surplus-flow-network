
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MySurplusPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Mes Surplus</h1>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un surplus
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion de vos surplus</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Fonctionnalité en cours de développement. Cette page permettra de gérer vos surplus publiés.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MySurplusPage;
