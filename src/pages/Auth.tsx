
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Recycle, Eye, EyeOff, Building2, Heart, Rocket, Shield } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login(email, password);
      toast.success('Connexion réussie !');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
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

  const fillDemoAccount = (email: string, password: string) => {
    const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
    const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
    
    if (emailInput && passwordInput) {
      emailInput.value = email;
      passwordInput.value = password;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
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

          {/* Right side - Auth Form */}
          <div className="w-full max-w-md mx-auto">
            <Card className="shadow-2xl">
              <CardHeader className="text-center">
                <div className="flex justify-center lg:hidden mb-4">
                  <div className="flex items-center gap-2">
                    <Recycle className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold text-gradient">Surplus360</span>
                  </div>
                </div>
                <CardTitle className="text-2xl">Se connecter</CardTitle>
                <CardDescription>
                  Connectez-vous pour accéder à votre espace Surplus360
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Connexion</TabsTrigger>
                    <TabsTrigger value="demo">Comptes Démo</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="space-y-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="votre@email.com"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                      >
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="demo" className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Testez l'application avec ces comptes de démonstration
                    </p>
                    
                    <div className="space-y-3">
                      {demoAccounts.map((account) => {
                        const Icon = account.icon;
                        return (
                          <Card
                            key={account.email}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => {
                              fillDemoAccount(account.email, account.password);
                              setActiveTab('login');
                            }}
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
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
