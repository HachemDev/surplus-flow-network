
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';

interface EmptyStateProps {
  searchTerm: string;
  onAddClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ searchTerm, onAddClick }) => {
  return (
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
          <Button onClick={onAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            Publier mon premier surplus
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
