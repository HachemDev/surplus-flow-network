
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Recycle, Users, TrendingUp, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const stats = [
    { icon: Recycle, label: 'Tonnes économisées', value: '2,847' },
    { icon: Users, label: 'Entreprises partenaires', value: '450+' },
    { icon: TrendingUp, label: 'Transactions réalisées', value: '12,394' },
    { icon: Leaf, label: 'CO2 évité (tonnes)', value: '1,268' }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-8">
          {/* Badge */}
          <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-primary/20 bg-primary/5">
            🌱 Plateforme B2B pour l'économie circulaire
          </Badge>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Transformez vos{' '}
              <span className="text-gradient">surplus</span>
              <br />
              en opportunités
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Surplus360 connecte les entreprises, associations et entrepreneurs pour optimiser 
              la gestion des excédents tout en favorisant l'économie circulaire et l'impact RSE.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="px-8 py-3 text-lg" asChild>
              <Link to="/marketplace">
                Explorer le Marketplace
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg" asChild>
              <Link to="/dashboard">
                Publier un surplus
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8">
            <p className="text-sm text-muted-foreground mb-6">
              Rejoignez plus de 450 entreprises qui nous font confiance
            </p>
            
            {/* Company Logos Placeholder */}
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="h-8 w-24 bg-muted rounded"></div>
              <div className="h-8 w-24 bg-muted rounded"></div>
              <div className="h-8 w-24 bg-muted rounded"></div>
              <div className="h-8 w-24 bg-muted rounded"></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center space-y-3 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
    </section>
  );
};

export default HeroSection;
