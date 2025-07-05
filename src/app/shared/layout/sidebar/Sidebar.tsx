
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
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
  Settings,
  MessageSquare
} from 'lucide-react';
import { AUTHORITIES } from '../../../config/constants';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAppSelector(state => state.authentication);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const getNavigationItems = () => {
    const baseItems = [
      {
        name: t('navbar.dashboard'),
        href: '/dashboard',
        icon: BarChart3,
        description: 'Vue d\'ensemble'
      },
      {
        name: t('navbar.marketplace'),
        href: '/entities/product',
        icon: Search,
        description: 'Trouver des surplus'
      }
    ];

    const roleSpecificItems = [];

    // For companies and admins
    if (user?.authorities.includes(AUTHORITIES.COMPANY) || user?.authorities.includes(AUTHORITIES.ADMIN)) {
      roleSpecificItems.push({
        name: t('navbar.surplus'),
        href: '/entities/product/my-surplus',
        icon: Package,
        description: 'Gérer mes annonces'
      });
    }

    // For all authenticated users
    roleSpecificItems.push(
      {
        name: 'Demandes',
        href: '/entities/request',
        icon: MessageSquare,
        description: 'Gérer les demandes'
      },
      {
        name: t('navbar.transactions'),
        href: '/entities/transaction',
        icon: Truck,
        description: 'Suivi des transactions'
      },
      {
        name: 'RSE Dashboard',
        href: '/rse-dashboard',
        icon: TrendingUp,
        description: 'Impact RSE'
      },
      {
        name: t('navbar.profile'),
        href: '/account/settings',
        icon: User,
        description: 'Paramètres compte'
      }
    );

    return [...baseItems, ...roleSpecificItems];
  };

  const navigationItems = getNavigationItems();

  const getRoleInfo = () => {
    if (user?.authorities.includes(AUTHORITIES.ADMIN)) {
      return { label: 'Administrateur', color: 'text-purple-600 bg-purple-100' };
    } else if (user?.authorities.includes(AUTHORITIES.COMPANY)) {
      return { label: 'Entreprise', color: 'text-blue-600 bg-blue-100' };
    } else if (user?.authorities.includes(AUTHORITIES.NGO)) {
      return { label: 'ONG', color: 'text-red-600 bg-red-100' };
    } else if (user?.authorities.includes(AUTHORITIES.ENTREPRENEUR)) {
      return { label: 'Entrepreneur', color: 'text-green-600 bg-green-100' };
    }
    return { label: 'Utilisateur', color: 'text-gray-600 bg-gray-100' };
  };

  const roleInfo = getRoleInfo();

  return (
    <aside className="w-64 bg-card border-r border-border h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="p-4">
        {/* User Info */}
        <div className="mb-6 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${roleInfo.color}`}>
                {roleInfo.label}
              </span>
            </div>
          </div>
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
      </div>
    </aside>
  );
};

export default Sidebar;
