
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { ProductStatus } from '@/types';

interface SurplusFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

const SurplusFilters: React.FC<SurplusFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange
}) => {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un surplus..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filtrer par statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value={ProductStatus.AVAILABLE}>Disponible</SelectItem>
          <SelectItem value={ProductStatus.RESERVED}>Réservé</SelectItem>
          <SelectItem value={ProductStatus.COMPLETED}>Vendu</SelectItem>
          <SelectItem value={ProductStatus.IN_PROGRESS}>En cours</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SurplusFilters;
