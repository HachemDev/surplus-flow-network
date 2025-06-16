
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Users, 
  Leaf, 
  Euro,
  Plus,
  Gift,
  ShoppingCart,
  Recycle,
  Calendar,
  ArrowUpRight
} from 'lucide-react';
import { mockProducts, mockTransactions } from '@/data/mockData';
import { ProductStatus, TransactionType } from '@/types/surplus';

const Dashboard = () => {
  // Calculate stats from mock data
  const totalProducts = mockProducts.length;
  const availableProducts = mockProducts.filter(p => p.status === ProductStatus.AVAILABLE).length;
  const totalValue = mockProducts.reduce((sum, p) => sum + p.estimatedValue, 0);
  const totalDonations = mockTransactions.filter(t => t.type === TransactionType.DONATION).length;
  const totalSales = mockTransactions.filter(t => t.type === TransactionType.SALE).length;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const stats = [
    {
      title: 'Total Surplus',
      value: totalProducts,
      description: `${availableProducts} disponibles`,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      trend: '+12%'
    },
    {
      title: 'Valeur Totale',
      value: formatPrice(totalValue),
      description: 'Estimée marketplace',
      icon: Euro,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
      trend: '+8%'
    },
    {
      title: 'Transactions',
      value: mockTransactions.length,
      description: `${totalDonations} dons, ${totalSales} ventes`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
      trend: '+24%'
    },
    {
      title: 'Impact RSE',
      value: '2.8T',
      description: 'CO2 économisé',
      icon: Leaf,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
      trend: '+15%'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'donation',
      title: 'Don de mobilier de bureau',
      company: 'Association Solidaire',
      amount: '0€',
      date: '2024-12-15',
      status: 'completed'
    },
    {
      id: 2,
      type: 'sale',
      title: 'Vente ordinateurs portables',
      company: 'GreenStart Initiative',
      amount: '6,000€',
      date: '2024-12-14',
      status: 'in_progress'
    },
    {
      id: 3,
      type: 'donation',
      title: 'Don équipements cuisine',
      company: 'Resto du Cœur',
      amount: '0€',
      date: '2024-12-13',
      status: 'pending'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard RSE</h1>
            <p className="text-muted-foreground">
              Suivez vos surplus et votre impact environnemental en temps réel
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un surplus
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {stat.trend}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts and Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Impact Chart */}
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Impact Environnemental
                </CardTitle>
                <CardDescription>
                  Évolution de votre impact RSE ce mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>CO2 économisé</span>
                      <span className="font-medium">2.8T / 5T</span>
                    </div>
                    <Progress value={56} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Déchets évités</span>
                      <span className="font-medium">1.2T / 2T</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Organisations aidées</span>
                      <span className="font-medium">8 / 15</span>
                    </div>
                    <Progress value={53} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
                <CardDescription>
                  Gérez vos surplus en quelques clics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Gift className="h-6 w-6 text-green-600" />
                    <span className="text-sm">Faire un don</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                    <span className="text-sm">Vente solidaire</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Recycle className="h-6 w-6 text-emerald-600" />
                    <span className="text-sm">Recyclage</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Activities */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Activités Récentes
                  <Button variant="ghost" size="sm">
                    Voir tout
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border bg-background/50">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'donation' 
                          ? 'bg-green-500/10 text-green-600' 
                          : 'bg-blue-500/10 text-blue-600'
                      }`}>
                        {activity.type === 'donation' ? (
                          <Gift className="h-4 w-4" />
                        ) : (
                          <ShoppingCart className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.company}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-semibold">
                            {activity.amount}
                          </span>
                          <Badge 
                            variant={
                              activity.status === 'completed' ? 'default' :
                              activity.status === 'in_progress' ? 'secondary' : 'outline'
                            }
                            className="text-xs"
                          >
                            {activity.status === 'completed' ? 'Terminé' :
                             activity.status === 'in_progress' ? 'En cours' : 'En attente'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* RSE Score */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Score RSE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-primary">85/100</div>
                  <p className="text-sm text-muted-foreground">
                    Excellent impact environnemental et social
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Impact environnemental</span>
                      <span>90%</span>
                    </div>
                    <Progress value={90} className="h-1" />
                    <div className="flex justify-between text-xs">
                      <span>Impact social</span>
                      <span>80%</span>
                    </div>
                    <Progress value={80} className="h-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
