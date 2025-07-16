import React, { createContext, ReactNode } from 'react';
import { User, UserProfile, Company, UserRole } from '@/types';
import { useAuthStatus, useLogout } from '@/hooks/api/useAuth';

interface AuthContextType {
  currentUser: User | null;
  profile: UserProfile | null;
  currentCompany: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: string) => boolean;
  hasAnyAuthority: (authorities: string[]) => boolean;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { currentUser, profile, isAuthenticated, isLoading, hasRole, hasAnyAuthority } = useAuthStatus();
  const logoutMutation = useLogout();

  const logout = () => {
    logoutMutation.mutate();
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    // This will be implemented with API call
    throw new Error('updateProfile not implemented yet');
  };

  const value: AuthContextType = {
    currentUser,
    profile,
    currentCompany: profile?.company || null,
    isAuthenticated,
    isLoading,
    hasRole,
    hasAnyAuthority,
    logout,
    updateProfile,
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