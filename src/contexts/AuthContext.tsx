import React, { createContext, ReactNode, useContext } from 'react';
import { User, Company, UserRole } from '@/types';
import { useIsAuthenticated, useLogout } from '@/hooks/api/useAuth';

interface AuthContextType {
  currentUser: User | null;
  currentCompany: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: string) => boolean;
  hasAnyAuthority: (authorities: string[]) => boolean;
  logout: () => void;
  updateProfile: (profile: Partial<User>) => Promise<void>;
  isAdmin: boolean;
  isCompanyUser: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user: currentUser, isAuthenticated, isLoading } = useIsAuthenticated();
  const logoutMutation = useLogout();

  const logout = () => {
    logoutMutation.mutate();
  };

  const updateProfile = async (profileData: Partial<User>) => {
    // Implement profile update logic here if needed
    // For now, just a placeholder
    return Promise.resolve();
  };

  const hasRole = (role: string): boolean => {
    return currentUser?.authorities?.includes(role) || false;
  };

  const hasAnyAuthority = (authorities: string[]): boolean => {
    return authorities.some(authority => hasRole(authority));
  };

  const isAdmin = hasRole('ROLE_ADMIN');
  const isCompanyUser = !!currentUser?.companyId;

  const value: AuthContextType = {
    currentUser,
    currentCompany: currentUser?.company || null,
    isAuthenticated,
    isLoading,
    hasRole,
    hasAnyAuthority,
    logout,
    updateProfile,
    isAdmin,
    isCompanyUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;