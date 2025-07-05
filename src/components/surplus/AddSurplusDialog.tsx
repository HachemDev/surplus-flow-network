
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Upload } from 'lucide-react';
import { ProductCategory } from '@/types';
import { toast } from 'sonner';

interface AddSurplusDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: any) => void;
}

const AddSurplusDialog: React.FC<AddSurplusDialogProps> = ({ isOpen, onOpenChange, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    quantity: '',
    unit: 'pieces',
    estimatedValue: '',
    salePrice: '',
    location: '',
    expiration: '',
    pickup: ''
  });

  const categories = [
    { value: ProductCategory.ELECTRONICS, label: 'Électronique' },
    { value: ProductCategory.FURNITURE, label: 'Mobilier' },
    { value: ProductCategory.TEXTILE, label: 'Textile' },
    { value: ProductCategory.OFFICE_EQUIPMENT, label: 'Équipement bureau' },
    { value: ProductCategory.CONSTRUCTION_MATERIALS, label: 'Matériaux construction' },
    { value: ProductCategory.FOOD, label: 'Alimentaire' },
  ];

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.category || !formData.quantity || !formData.location) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    onAdd(formData);
    setFormData({
      title: '',
      description: '',
      category: '',
      quantity: '',
      unit: 'pieces',
      estimatedValue: '',
      salePrice: '',
      location: '',
      expiration: '',
      pickup: ''
    });
    onOpenChange(false);
    toast.success('Produit ajouté avec succès !');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un surplus
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau surplus</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour publier votre surplus
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Titre du surplus *</Label>
            <Input 
              id="title" 
              placeholder="Ex: Ordinateurs portables Dell reconditionnés"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea 
              id="description" 
              placeholder="Décrivez en détail votre surplus, son état, ses caractéristiques..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Catégorie *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="quantity">Quantité *</Label>
              <div className="flex gap-2">
                <Input 
                  id="quantity" 
                  type="number" 
                  placeholder="10"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                />
                <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Unité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pieces">pièces</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="m2">m²</SelectItem>
                    <SelectItem value="litres">litres</SelectItem>
                    <SelectItem value="cartons">cartons</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimatedValue">Valeur estimée (€)</Label>
              <Input 
                id="estimatedValue" 
                type="number" 
                placeholder="5000"
                value={formData.estimatedValue}
                onChange={(e) => setFormData({...formData, estimatedValue: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="salePrice">Prix de vente (€)</Label>
              <Input 
                id="salePrice" 
                type="number" 
                placeholder="0 pour un don"
                value={formData.salePrice}
                onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Localisation *</Label>
            <Input 
              id="location" 
              placeholder="Ex: Paris, France"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="expiration">Date d'expiration (optionnel)</Label>
            <Input 
              id="expiration" 
              type="date"
              value={formData.expiration}
              onChange={(e) => setFormData({...formData, expiration: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="pickup">Instructions de récupération</Label>
            <Textarea 
              id="pickup" 
              placeholder="Indiquez les modalités de récupération (horaires, accès, équipe nécessaire...)"
              rows={3}
              value={formData.pickup}
              onChange={(e) => setFormData({...formData, pickup: e.target.value})}
            />
          </div>

          <div>
            <Label>Images du produit</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Cliquez pour ajouter des images ou glissez-déposez
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG jusqu'à 10MB (max 5 images)
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Publier le surplus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSurplusDialog;
