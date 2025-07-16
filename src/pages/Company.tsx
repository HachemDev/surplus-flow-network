
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { getCompanyStats } from '@/types';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Award,
  TrendingUp,
  Package,
  Heart,
  DollarSign,
  Edit3,
  Save,
  X,
  Camera
} from 'lucide-react';
import { toast } from 'sonner';

const Company = () => {
  const { currentCompany, currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentCompany?.name || '',
    description: currentCompany?.description || '',
    website: currentCompany?.website || '',
    phone: currentCompany?.phone || '',
    address: currentCompany?.address || '',
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profil entreprise mis à jour');
  };

  const handleCancel = () => {
    setFormData({
      name: currentCompany?.name || '',
      description: currentCompany?.description || '',
      website: currentCompany?.website || '',
      phone: currentCompany?.phone || '',
      address: currentCompany?.address || '',
    });
    setIsEditing(false);
  };

  if (!currentCompany) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Aucune entreprise associée</CardTitle>
            <CardDescription>
              Votre compte n'est pas associé à une entreprise
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profil Entreprise</h1>
          <p className="text-muted-foreground">
            Gérez les informations de votre entreprise et suivez vos performances
          </p>
        </div>
        
        {(currentUser?.role === 'COMPANY' || currentUser?.role === 'ADMIN') && (
          !isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            </div>
          )
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Company Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={currentCompany.logo} alt={currentCompany.name} />
                    <AvatarFallback className="text-lg">
                      {currentCompany.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{currentCompany.name}</h2>
                    {currentCompany.verified && (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        <Award className="h-3 w-3 mr-1" />
                        Certifié
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground mb-3">{currentCompany.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {currentCompany.industry}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {currentCompany.location}
                    </div>
                    {currentCompany.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        <a href={currentCompany.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                          Site web
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {currentCompany.rseScore}
                  </div>
                  <div className="text-sm text-muted-foreground">Score RSE</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Surplus Total</p>
                    <p className="text-2xl font-bold">{getCompanyStats(currentCompany.stats).totalSurplus}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Dons Réalisés</p>
                    <p className="text-2xl font-bold">{getCompanyStats(currentCompany.stats).totalDonations}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">CO₂ Économisé</p>
                    <p className="text-2xl font-bold">{getCompanyStats(currentCompany.stats).co2Saved}kg</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Déchets Réduits</p>
                    <p className="text-2xl font-bold">{Math.round(getCompanyStats(currentCompany.stats).wasteReduced / 1000)}t</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'entreprise</CardTitle>
              <CardDescription>
                Gérez les informations publiques de votre entreprise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l'entreprise</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="https://"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Décrivez votre entreprise..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Surplus publiés ce mois</span>
                    <span className="font-bold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dons réalisés</span>
                    <span className="font-bold">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ventes réalisées</span>
                    <span className="font-bold">4</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Impact environnemental</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>CO₂ économisé ce mois</span>
                    <span className="font-bold text-green-600">245kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Déchets évités</span>
                    <span className="font-bold text-blue-600">1.2t</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Associations aidées</span>
                    <span className="font-bold text-purple-600">5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Certifications et labels</CardTitle>
              <CardDescription>
                Vos certifications reconnues améliorent votre score RSE
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(currentCompany.certifications || '').split(',').filter(cert => cert.trim()).map((cert, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Award className="h-6 w-6 text-primary" />
                    <span className="font-medium">{cert}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Company;
