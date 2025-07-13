
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { mockProducts, mockTransactions, mockRSEImpacts } from '@/data/mockData';
import { 
  Package, 
  TrendingUp, 
  Users, 
  Leaf, 
  Building2, 
  Heart, 
  Rocket, 
  Plus,
  BarChart3,
  ArrowUpRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, currentCompany } = useAuth();
  const navigate = useNavigate();

  // Filtrer les données selon l'utilisateur connecté
  const userProducts = mockProducts.filter(p => p.company?.id === String(currentUser?.companyId));
  const userTransactions = mockTransactions.filter(t => 
    t.sellerId === String(currentUser?.companyId) || t.buyerId === String(currentUser?.companyId)
  );
  const userRSEImpact = mockRSEImpacts.find(r => r.companyId === String(currentUser?.companyId));

  const getWelcomeMessage = () => {
    switch (currentUser?.role) {
      case 'ADMIN':
        return {
          title: 'Administration Surplus360',
          subtitle: 'Vue d\'ensemble de la plateforme',
          icon: Building2
        };
      case 'COMPANY':
        return {
          title: `Bienvenue, ${currentCompany?.name}`,
          subtitle: 'Gérez vos surplus et suivez votre impact RSE',
          icon: Building2
        };
      case 'ASSOCIATION':
        return {
          title: `Bienvenue, ${currentCompany?.name}`,
          subtitle: 'Découvrez les opportunités de dons disponibles',
          icon: Heart
        };
      case 'ENTREPRENEUR':
        return {
          title: `Bienvenue, ${currentCompany?.name}`,
          subtitle: 'Trouvez des équipements à prix réduit pour votre entreprise',
          icon: Rocket
        };
      default:
        return {
          title: 'Bienvenue sur Surplus360',
          subtitle: 'Votre tableau de bord personnalisé',
          icon: Package
        };
    }
  };

  const welcome = getWelcomeMessage();
  const WelcomeIcon = welcome.icon;

  const quickActions = [
    {
      title: 'Parcourir le marketplace',
      description: 'Découvrez les surplus disponibles',
      action: () => navigate('/marketplace'),
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: currentUser?.role === 'COMPANY' ? 'Publier un surplus' : 'Mes demandes',
      description: currentUser?.role === 'COMPANY' ? 'Ajouter un nouveau surplus' : 'Gérer mes demandes',
      action: () => navigate(currentUser?.role === 'COMPANY' ? '/my-surplus' : '/tracking'),
      icon: Plus,
      color: 'bg-green-500'
    },
    {
      title: 'Suivi des transactions',
      description: 'Voir l\'état de vos transactions',
      action: () => navigate('/tracking'),
      icon: BarChart3,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header de bienvenue */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <WelcomeIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{welcome.title}</h1>
            <p className="text-muted-foreground">{welcome.subtitle}</p>
          </div>
        </div>
        <Badge variant="secondary" className="text-sm">
          {currentUser?.role === 'ADMIN' && 'Administrateur'}
          {currentUser?.role === 'COMPANY' && 'Entreprise'}
          {currentUser?.role === 'ASSOCIATION' && 'Association'}
          {currentUser?.role === 'ENTREPRENEUR' && 'Entrepreneur'}
        </Badge>
      </div>

      {/* Actions rapides */}
      <div className="grid md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => {
          const ActionIcon = action.icon;
          return (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={action.action}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center`}>
                    <ActionIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Statistiques */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Surplus actifs</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProducts.length}</div>
            <p className="text-xs text-muted-foreground">+2 ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userTransactions.length}</div>
            <p className="text-xs text-muted-foreground">+5 ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">CO2 économisé</CardTitle>
              <Leaf className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userRSEImpact?.co2Saved || 0} kg</div>
            <p className="text-xs text-muted-foreground">Impact environnemental</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Partenaires</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(userRSEImpact?.associationsHelped || 0) + (userRSEImpact?.entrepreneursHelped || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Organisations aidées</p>
          </CardContent>
        </Card>
      </div>

      {/* Activité récente */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Derniers surplus</CardTitle>
            <CardDescription>Vos surplus récemment publiés</CardDescription>
          </CardHeader>
          <CardContent>
            {userProducts.length > 0 ? (
              <div className="space-y-4">
                {userProducts.slice(0, 3).map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img 
                      src={product.imageBlob || '/placeholder.svg'} 
                      alt={product.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{product.title}</h4>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <Badge variant={product.status === 'AVAILABLE' ? 'default' : 'secondary'}>
                      {product.status}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" onClick={() => navigate('/my-surplus')} className="w-full">
                  Voir tous mes surplus
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun surplus publié</p>
                <Button variant="outline" onClick={() => navigate('/my-surplus')} className="mt-4">
                  Publier mon premier surplus
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transactions récentes</CardTitle>
            <CardDescription>Vos dernières activités</CardDescription>
          </CardHeader>
          <CardContent>
            {userTransactions.length > 0 ? (
              <div className="space-y-4">
                {userTransactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      {transaction.type === 'DONATION' ? (
                        <Heart className="h-6 w-6 text-red-500" />
                      ) : (
                        <Package className="h-6 w-6 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{transaction.product?.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {transaction.type === 'DONATION' ? 'Don' : 'Vente'} - {transaction.price === 0 ? 'Gratuit' : `${transaction.price}€`}
                      </p>
                    </div>
                    <Badge variant={
                      transaction.status === 'COMPLETED' ? 'default' : 
                      transaction.status === 'IN_TRANSIT' ? 'secondary' : 'outline'
                    }>
                      {transaction.status}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" onClick={() => navigate('/tracking')} className="w-full">
                  Voir toutes les transactions
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune transaction</p>
                <Button variant="outline" onClick={() => navigate('/marketplace')} className="mt-4">
                  Explorer le marketplace
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Score RSE pour les entreprises */}
      {currentUser?.role === 'COMPANY' && currentCompany && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Score RSE
            </CardTitle>
            <CardDescription>
              Votre impact environnemental et social
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Score global</span>
                <span className="text-2xl font-bold text-green-600">{currentCompany.rseScore}/100</span>
              </div>
              <Progress value={currentCompany.rseScore} className="h-2" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-lg font-bold">{userRSEImpact?.co2Saved || 0} kg</div>
                  <div className="text-xs text-muted-foreground">CO2 économisé</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{userRSEImpact?.wasteReducedKg || 0} kg</div>
                  <div className="text-xs text-muted-foreground">Déchets évités</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{userRSEImpact?.donationsMade || 0}</div>
                  <div className="text-xs text-muted-foreground">Dons effectués</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{userRSEImpact?.associationsHelped || 0}</div>
                  <div className="text-xs text-muted-foreground">Associations aidées</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
