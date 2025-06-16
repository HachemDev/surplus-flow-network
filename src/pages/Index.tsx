
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Recycle, Building2, Heart, Rocket, Shield, ArrowRight, CheckCircle, Globe, TrendingUp } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Building2,
      title: 'Pour les Entreprises',
      description: 'Valorisez vos surplus, obtenez des avantages fiscaux et améliorez votre score RSE',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Heart,
      title: 'Pour les Associations',
      description: 'Accédez gratuitement aux dons d\'équipements pour vos missions sociales',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      icon: Rocket,
      title: 'Pour les Entrepreneurs',
      description: 'Démarrez votre activité avec des équipements à prix réduit',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ];

  const stats = [
    { label: 'Entreprises partenaires', value: '500+' },
    { label: 'Tonnes de déchets évités', value: '2,500' },
    { label: 'CO2 économisé', value: '15,000 kg' },
    { label: 'Associations aidées', value: '150+' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Recycle className="h-8 w-8 text-primary" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Surplus360
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                Se connecter
              </Button>
              <Button onClick={() => navigate('/auth')}>
                Commencer
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Transformez vos surplus en opportunités durables
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              La plateforme B2B qui révolutionne la gestion des surplus d'entreprise. 
              Connectez entreprises, associations et entrepreneurs pour une économie circulaire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8">
                Découvrir la plateforme
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
                Voir les comptes démo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Une solution pour chaque acteur
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className={`w-16 h-16 mx-auto rounded-full ${feature.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Notre impact en chiffres
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à rejoindre l'économie circulaire ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des centaines d'entreprises qui transforment leurs surplus en valeur
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/auth')}>
            Commencer maintenant
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Surplus360. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
