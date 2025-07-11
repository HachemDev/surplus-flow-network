import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { authApi, userProfileApi } from '@/services/api';
import { LoginRequest, RegisterRequest, JhipsterUser, UserProfile } from '@/types/jhipster';

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await authApi.login(credentials);
      
      // Store the token based on rememberMe preference
      if (credentials.rememberMe) {
        localStorage.setItem('id_token', response.id_token);
        sessionStorage.removeItem('id_token');
      } else {
        sessionStorage.setItem('id_token', response.id_token);
        localStorage.removeItem('id_token');
      }

      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['auth', 'account'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile', 'me'] });
      
      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue !',
      });
      
      navigate('/dashboard');
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      toast({
        title: 'Erreur de connexion',
        description: error.response?.data?.message || 'Identifiants incorrects',
        variant: 'destructive',
      });
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userInfo: RegisterRequest) => authApi.register(userInfo),
    onSuccess: () => {
      toast({
        title: 'Inscription réussie',
        description: 'Votre compte a été créé. Vous pouvez maintenant vous connecter.',
      });
      navigate('/login');
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
      toast({
        title: 'Erreur d\'inscription',
        description: error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription',
        variant: 'destructive',
      });
    },
  });
}

export function useAccount() {
  return useQuery({
    queryKey: ['auth', 'account'],
    queryFn: () => authApi.getAccount(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile', 'me'],
    queryFn: () => userProfileApi.getMyProfile(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Clear tokens
      localStorage.removeItem('id_token');
      sessionStorage.removeItem('id_token');
      
      // Clear all cached data
      queryClient.clear();
    },
    onSuccess: () => {
      toast({
        title: 'Déconnexion',
        description: 'Vous avez été déconnecté avec succès',
      });
      navigate('/login');
    },
  });
}

export function useAuthStatus() {
  const { data: account, isLoading: accountLoading, error: accountError } = useAccount();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  const isAuthenticated = !!account && !accountError;
  const isLoading = accountLoading || (isAuthenticated && profileLoading);

  const hasRole = (role: string): boolean => {
    return account?.authorities?.includes(role) || false;
  };

  const hasAnyAuthority = (authorities: string[]): boolean => {
    return authorities.some(authority => hasRole(authority));
  };

  const isAdmin = () => hasRole('ROLE_ADMIN');
  const isUser = () => hasRole('ROLE_USER');

  return {
    account,
    profile,
    isAuthenticated,
    isLoading,
    hasRole,
    hasAnyAuthority,
    isAdmin,
    isUser,
    currentUser: account,
  };
}

export function useActivateAccount() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (key: string) => authApi.activateAccount(key),
    onSuccess: () => {
      toast({
        title: 'Compte activé',
        description: 'Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.',
      });
      navigate('/login');
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur d\'activation',
        description: error.response?.data?.message || 'Le lien d\'activation est invalide ou expiré',
        variant: 'destructive',
      });
    },
  });
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => authApi.requestPasswordReset(email),
    onSuccess: () => {
      toast({
        title: 'Email envoyé',
        description: 'Un email de réinitialisation a été envoyé à votre adresse.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ key, newPassword }: { key: string; newPassword: string }) =>
      authApi.resetPassword(key, newPassword),
    onSuccess: () => {
      toast({
        title: 'Mot de passe réinitialisé',
        description: 'Votre mot de passe a été réinitialisé avec succès.',
      });
      navigate('/login');
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.response?.data?.message || 'Le lien de réinitialisation est invalide ou expiré',
        variant: 'destructive',
      });
    },
  });
}