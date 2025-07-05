
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

const RequestListPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Demandes</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des demandes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Fonctionnalité en cours de développement. Cette page permettra de gérer les demandes d'achat et de don.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestListPage;
