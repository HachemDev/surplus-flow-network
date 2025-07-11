import React, { createContext, ReactNode } from 'react';
import { JhipsterUser, UserProfile } from '@/types/jhipster';
import { useAuthStatus } from '@/hooks/api/useAuth';

interface AuthContextType {
  currentUser: JhipsterUser | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: string) => boolean;
  hasAnyAuthority: (authorities: string[]) => boolean;
  login: (credentials: { email: string; password: string; rememberMe?: boolean }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { currentUser, profile, isAuthenticated, isLoading, hasRole, hasAnyAuthority } = useAuthStatus();

  // Placeholder login function - actual login logic should use the API
  const login = async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
    // This will be handled by the useLogin hook in components
    throw new Error('Use useLogin hook for authentication');
  };

  const value: AuthContextType = {
    currentUser,
    profile,
    isAuthenticated,
    isLoading,
    hasRole,
    hasAnyAuthority,
    login,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

// Export useAuth hook for backward compatibility
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};