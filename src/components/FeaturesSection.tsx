
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Gift, 
  Recycle, 
  FileText, 
  TrendingUp, 
  Truck,
  Target,
  Users,
  BarChart3
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: ShoppingCart,
      title: 'Marketplace B2B',
      description: 'Plateforme dédiée pour acheter et vendre des surplus entre professionnels',
      badge: 'Core',
      color: 'bg-blue-500/10 text-blue-600'
    },
    {
      icon: Gift,
      title: 'Gestion des Dons',
      description: 'Système de donation avec génération automatique de certificats fiscaux',
      badge: 'Fiscal',
      color: 'bg-green-500/10 text-green-600'
    },
    {
      icon: Recycle,
      title: 'Économie Circulaire',
      description: 'Réduisez vos déchets et optimisez vos ressources grâce au recyclage intelligent',
      badge: 'Eco',
      color: 'bg-emerald-500/10 text-emerald-600'
    },
    {
      icon: FileText,
      title: 'Avantages Fiscaux',
      description: 'Bénéficiez de réductions fiscales et documentez vos actions RSE automatiquement',
      badge: 'Legal',
      color: 'bg-purple-500/10 text-purple-600'
    },
    {
      icon: TrendingUp,
      title: 'Score RSE',
      description: 'Suivez et améliorez votre impact environnemental et social en temps réel',
      badge: 'Analytics',
      color: 'bg-orange-500/10 text-orange-600'
    },
    {
      icon: Truck,
      title: 'Logistique Intégrée',
      description: 'Gestion complète des livraisons avec suivi en temps réel et optimisation des coûts',
      badge: 'Logistics',
      color: 'bg-cyan-500/10 text-cyan-600'
    },
    {
      icon: Target,
      title: 'Matching Intelligent',
      description: 'Algorithme de mise en relation automatique entre offres et besoins',
      badge: 'AI',
      color: 'bg-rose-500/10 text-rose-600'
    },
    {
      icon: Users,
      title: 'Multi-Parties',
      description: 'Connecte entreprises, associations et jeunes entrepreneurs efficacement',
      badge: 'Network',
      color: 'bg-indigo-500/10 text-indigo-600'
    },
    {
      icon: BarChart3,
      title: 'Reporting Avancé',
      description: 'Tableaux de bord détaillés pour mesurer votre impact et vos économies',
      badge: 'Reports',
      color: 'bg-amber-500/10 text-amber-600'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="px-4 py-2">
            🚀 Fonctionnalités
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Une plateforme complète pour vos{' '}
            <span className="text-gradient">surplus</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez toutes les fonctionnalités qui font de Surplus360 
            la solution de référence pour l'économie circulaire B2B.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="card-hover border-0 shadow-sm bg-card/50 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/10">
          <h3 className="text-2xl font-bold mb-4">
            Prêt à optimiser vos surplus ?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Rejoignez notre plateforme et commencez à transformer vos excédents en opportunités dès aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Créer un compte
            </button>
            <button className="px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors">
              Demander une démo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
