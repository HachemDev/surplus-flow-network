
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Company } from '@/types';

interface AuthContextType {
  currentUser: User | null;
  currentCompany: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demonstration
const mockUsers: { [key: string]: User & { password: string; company?: Company } } = {
  'admin@surplus360.com': {
    id: '1',
    email: 'admin@surplus360.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'Surplus360',
    role: UserRole.ADMIN,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    isVerified: true,
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date()
  },
  'entreprise@ecotech.fr': {
    id: '2',
    email: 'entreprise@ecotech.fr',
    password: 'entreprise123',
    firstName: 'Marie',
    lastName: 'Dubois',
    role: UserRole.COMPANY,
    companyId: '1',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100',
    isVerified: true,
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(),
    company: {
      id: '1',
      name: 'EcoTech Solutions',
      type: 'BUSINESS' as any,
      industry: 'Technology',
      location: 'Paris, France',
      address: '123 Rue de la Tech, 75001 Paris',
      phone: '+33 1 23 45 67 89',
      email: 'contact@ecotech.fr',
      website: 'https://ecotech-solutions.fr',
      description: 'Leader français en solutions technologiques durables',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
      rseScore: 92,
      verified: true,
      certifications: ['ISO 14001', 'B-Corp'],
      createdAt: new Date('2024-01-15'),
      stats: {
        totalSurplus: 147,
        totalDonations: 89,
        totalSales: 58,
        co2Saved: 2847,
        wasteReduced: 15673
      }
    }
  },
  'association@solidarite.org': {
    id: '3',
    email: 'association@solidarite.org',
    password: 'asso123',
    firstName: 'Pierre',
    lastName: 'Martin',
    role: UserRole.ASSOCIATION,
    companyId: '2',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    isVerified: true,
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date(),
    company: {
      id: '2',
      name: 'Association Solidarité Numérique',
      type: 'ASSOCIATION' as any,
      industry: 'Social',
      location: 'Lyon, France',
      address: '45 Avenue Solidaire, 69000 Lyon',
      phone: '+33 4 78 90 12 34',
      email: 'contact@solidarite-numerique.org',
      description: 'Association dédiée à la réduction de la fracture numérique',
      logo: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200',
      rseScore: 0,
      verified: true,
      certifications: ['Agrément Jeunesse et Sport'],
      createdAt: new Date('2024-02-01'),
      stats: {
        totalSurplus: 0,
        totalDonations: 0,
        totalSales: 0,
        co2Saved: 0,
        wasteReduced: 0
      }
    }
  },
  'entrepreneur@startup.co': {
    id: '4',
    email: 'entrepreneur@startup.co',
    password: 'startup123',
    firstName: 'Sophie',
    lastName: 'Leroy',
    role: UserRole.ENTREPRENEUR,
    companyId: '3',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    isVerified: true,
    createdAt: new Date('2024-03-01'),
    lastLogin: new Date(),
    company: {
      id: '3',
      name: 'GreenStart Innovation',
      type: 'STARTUP' as any,
      industry: 'Green Tech',
      location: 'Toulouse, France',
      address: '12 Rue Innovation, 31000 Toulouse',
      phone: '+33 5 61 23 45 67',
      email: 'hello@greenstart.co',
      website: 'https://greenstart.co',
      description: 'Startup spécialisée dans les innovations environnementales',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200',
      rseScore: 78,
      verified: true,
      certifications: ['French Tech'],
      createdAt: new Date('2024-03-01'),
      stats: {
        totalSurplus: 12,
        totalDonations: 3,
        totalSales: 9,
        co2Saved: 234,
        wasteReduced: 1250
      }
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler la vérification de session au démarrage
    const storedUser = localStorage.getItem('surplus360_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        if (user.companyId) {
          const userWithCompany = Object.values(mockUsers).find(u => u.id === user.id);
          if (userWithCompany?.company) {
            setCurrentCompany(userWithCompany.company);
          }
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('surplus360_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simuler un délai de connexion
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userWithPassword = mockUsers[email];
    if (!userWithPassword || userWithPassword.password !== password) {
      setIsLoading(false);
      throw new Error('Email ou mot de passe incorrect');
    }

    const { password: _, company, ...user } = userWithPassword;
    setCurrentUser(user);
    if (company) {
      setCurrentCompany(company);
    }
    
    localStorage.setItem('surplus360_user', JSON.stringify(user));
    setIsLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentCompany(null);
    localStorage.removeItem('surplus360_user');
  };

  const switchRole = (role: UserRole) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, role };
    setCurrentUser(updatedUser);
    localStorage.setItem('surplus360_user', JSON.stringify(updatedUser));
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...data };
    setCurrentUser(updatedUser);
    localStorage.setItem('surplus360_user', JSON.stringify(updatedUser));
  };

  const value = {
    currentUser,
    currentCompany,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    logout,
    switchRole,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
