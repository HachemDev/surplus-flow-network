
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { 
  BarChart3, 
  Package, 
  Search, 
  Truck, 
  Building, 
  User,
  Heart,
  ShoppingCart,
  TrendingUp,
  FileText,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const { currentUser, currentCompany } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: BarChart3,
        description: 'Vue d\'ensemble'
      },
      {
        name: 'Marketplace',
        href: '/marketplace',
        icon: Search,
        description: 'Trouver des surplus'
      }
    ];

    const roleSpecificItems = [];

    // For companies and admins
    if (currentUser?.role === UserRole.COMPANY || currentUser?.role === UserRole.ADMIN) {
      roleSpecificItems.push({
        name: 'Mes Surplus',
        href: '/my-surplus',
        icon: Package,
        description: 'Gérer mes annonces'
      });
    }

    // For all authenticated users
    roleSpecificItems.push(
      {
        name: 'Suivi Logistique',
        href: '/tracking',
        icon: Truck,
        description: 'Suivi des livraisons'
      },
      {
        name: 'Mon Entreprise',
        href: '/company',
        icon: Building,
        description: 'Profil entreprise'
      },
      {
        name: 'Mon Profil',
        href: '/profile',
        icon: User,
        description: 'Paramètres compte'
      }
    );

    return [...baseItems, ...roleSpecificItems];
  };

  const navigationItems = getNavigationItems();

  const getRoleInfo = () => {
    switch (currentUser?.role) {
      case UserRole.ADMIN:
        return { label: 'Administrateur', color: 'text-purple-600 bg-purple-100' };
      case UserRole.COMPANY:
        return { label: 'Entreprise', color: 'text-blue-600 bg-blue-100' };
      case UserRole.ASSOCIATION:
        return { label: 'Association', color: 'text-red-600 bg-red-100' };
      case UserRole.ENTREPRENEUR:
        return { label: 'Entrepreneur', color: 'text-green-600 bg-green-100' };
      default:
        return { label: 'Utilisateur', color: 'text-gray-600 bg-gray-100' };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <aside className="w-64 bg-card border-r border-border h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4">
        {/* User/Company Info */}
        <div className="mb-6 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {currentCompany?.name || `${currentUser?.firstName} ${currentUser?.lastName}`}
              </p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${roleInfo.color}`}>
                {roleInfo.label}
              </span>
            </div>
          </div>
          
          {currentCompany && (
            <div className="text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Score RSE:</span>
                <span className="font-medium">{currentCompany.rseScore}/100</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Navigation
          </div>
          
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-4 w-4" />
                <div className="flex-1">
                  <div>{item.name}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats */}
        {currentCompany && (
          <div className="mt-6 p-3 bg-primary/5 rounded-lg">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Statistiques rapides
            </div>
            <div className="space-y-2 text-xs">
              {currentUser?.role === UserRole.COMPANY && (
                <>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      Surplus publiés
                    </span>
                    <span className="font-medium">{currentCompany.stats.totalSurplus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      Dons réalisés
                    </span>
                    <span className="font-medium">{currentCompany.stats.totalDonations}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  CO₂ économisé
                </span>
                <span className="font-medium">{currentCompany.stats.co2Saved}kg</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
