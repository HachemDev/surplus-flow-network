
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Building2, Heart, Rocket } from 'lucide-react';

interface DemoAccount {
  role: string;
  email: string;
  password: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

interface DemoAccountsProps {
  onAccountSelect: (email: string, password: string) => void;
}

const DemoAccounts: React.FC<DemoAccountsProps> = ({ onAccountSelect }) => {
  const demoAccounts: DemoAccount[] = [
    {
      role: 'Administrateur',
      email: 'admin@surplus360.com',
      password: 'admin123',
      icon: Shield,
      color: 'text-purple-600',
      description: 'Accès complet à la plateforme'
    },
    {
      role: 'Entreprise',
      email: 'entreprise@ecotech.fr',
      password: 'entreprise123',
      icon: Building2,
      color: 'text-blue-600',
      description: 'EcoTech Solutions - Publier des surplus'
    },
    {
      role: 'Association',
      email: 'association@solidarite.org',
      password: 'asso123',
      icon: Heart,
      color: 'text-red-600',
      description: 'Association Solidarité - Recevoir des dons'
    },
    {
      role: 'Entrepreneur',
      email: 'entrepreneur@startup.co',
      password: 'startup123',
      icon: Rocket,
      color: 'text-green-600',
      description: 'GreenStart - Acheter à prix réduit'
    }
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center mb-4">
        Testez l'application avec ces comptes de démonstration
      </p>
      
      <div className="space-y-3">
        {demoAccounts.map((account) => {
          const Icon = account.icon;
          return (
            <Card
              key={account.email}
              className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
              onClick={() => onAccountSelect(account.email, account.password)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ${account.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{account.role}</div>
                    <div className="text-sm text-muted-foreground">{account.description}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {account.email}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="text-center mt-4">
        <p className="text-xs text-muted-foreground">
          Cliquez sur un compte pour le sélectionner automatiquement
        </p>
      </div>
    </div>
  );
};

export default DemoAccounts;
