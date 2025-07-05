
import React from 'react';
import { Recycle, Building2, Heart, Rocket } from 'lucide-react';

const AuthBranding = () => {
  return (
    <div className="hidden lg:block space-y-8">
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
          <div className="relative">
            <Recycle className="h-12 w-12 text-primary" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Surplus360
          </h1>
        </div>
        <p className="text-xl text-muted-foreground mb-8">
          La plateforme B2B qui révolutionne la gestion des surplus d'entreprise
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Pour les Entreprises</h3>
            <p className="text-muted-foreground">Valorisez vos surplus, obtenez des avantages fiscaux et améliorez votre score RSE</p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
            <Heart className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Pour les Associations</h3>
            <p className="text-muted-foreground">Accédez gratuitement aux dons d'équipements pour vos missions sociales</p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
            <Rocket className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Pour les Entrepreneurs</h3>
            <p className="text-muted-foreground">Démarrez votre activité avec des équipements à prix réduit</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthBranding;
