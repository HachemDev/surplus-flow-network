
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLogin } from '@/hooks/api/useAuth';
import { Recycle } from 'lucide-react';
import { toast } from 'sonner';
import LoginForm from '@/components/auth/LoginForm';
import DemoAccounts from '@/components/auth/DemoAccounts';
import AuthBranding from '@/components/auth/AuthBranding';

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await loginMutation.mutateAsync({
        username: email,
        password,
        rememberMe: false
      });
      toast.success('Connexion réussie !');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setActiveTab('login');
    toast.success('Compte démo sélectionné ! Cliquez sur "Se connecter"');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <AuthBranding />

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
                    <LoginForm
                      email={email}
                      password={password}
                      onEmailChange={setEmail}
                      onPasswordChange={setPassword}
                      onSubmit={handleLogin}
                      isLoading={isLoading}
                      error={error}
                    />
                  </TabsContent>
                  
                  <TabsContent value="demo" className="space-y-4">
                    <DemoAccounts onAccountSelect={fillDemoAccount} />
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
