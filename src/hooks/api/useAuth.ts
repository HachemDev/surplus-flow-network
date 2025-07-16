import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { authApi } from '@/services/api';
import { LoginRequest, RegisterRequest, User } from '@/types';

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (response) => {
      // Store the token
      if (credentials.rememberMe) {
        localStorage.setItem('auth_token', response.token);
      } else {
        sessionStorage.setItem('auth_token', response.token);
      }

      // Update the query cache with user data
      queryClient.setQueryData(['auth', 'current-user'], response.user);

      toast({
        title: 'Connexion réussie',
        description: `Bienvenue ${response.user.firstName || response.user.login}!`,
      });

      // Redirect to dashboard
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur de connexion',
        description: error.message || 'Identifiants invalides',
        variant: 'destructive',
      });
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userInfo: RegisterRequest) => authApi.register(userInfo),
    onSuccess: (user) => {
      toast({
        title: 'Inscription réussie',
        description: `Bienvenue ${user.firstName || user.login}! Vous pouvez maintenant vous connecter.`,
      });

      // Redirect to login page
      navigate('/login');
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur d\'inscription',
        description: error.message || 'Une erreur est survenue lors de l\'inscription',
        variant: 'destructive',
      });
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'current-user'],
    queryFn: () => authApi.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear tokens
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');

      // Clear all cached data
      queryClient.clear();

      toast({
        title: 'Déconnexion réussie',
        description: 'À bientôt!',
      });

      // Redirect to login page
      navigate('/login');
    },
    onError: (error: any) => {
      // Even if logout fails on server, clear local data
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      queryClient.clear();
      navigate('/login');

      toast({
        title: 'Déconnexion',
        description: 'Vous avez été déconnecté',
        variant: 'destructive',
      });
    },
  });
}

export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.refreshToken(),
    onSuccess: (response) => {
      // Update the stored token
      const isRemembered = localStorage.getItem('auth_token');
      if (isRemembered) {
        localStorage.setItem('auth_token', response.token);
      } else {
        sessionStorage.setItem('auth_token', response.token);
      }

      // Update the query cache with user data
      queryClient.setQueryData(['auth', 'current-user'], response.user);
    },
    onError: () => {
      // Clear tokens and redirect to login
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      queryClient.clear();
      window.location.href = '/login';
    },
  });
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => authApi.requestPasswordReset(email),
    onSuccess: () => {
      toast({
        title: 'Email envoyé',
        description: 'Un email de réinitialisation a été envoyé à votre adresse',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authApi.resetPassword(token, newPassword),
    onSuccess: () => {
      toast({
        title: 'Mot de passe réinitialisé',
        description: 'Votre mot de passe a été mis à jour avec succès',
      });

      // Redirect to login page
      navigate('/login');
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue lors de la réinitialisation',
        variant: 'destructive',
      });
    },
  });
}

// Helper hook to check if user is authenticated
export function useIsAuthenticated() {
  const { data: user, isLoading } = useCurrentUser();
  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
}

// Helper hook to check if user has a specific role
export function useHasRole(role: string) {
  const { data: user } = useCurrentUser();
  return user?.authorities?.includes(role) || false;
}

// Helper hook to check if user is admin
export function useIsAdmin() {
  return useHasRole('ROLE_ADMIN');
}

// Helper hook to check if user belongs to a company
export function useIsCompanyUser() {
  const { data: user } = useCurrentUser();
  return !!user?.companyId;
}