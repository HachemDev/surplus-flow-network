
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '../../hooks/useAppSelector';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import ThemeToggle from '../../components/ThemeToggle';
import UserMenu from './UserMenu';
import NotificationCenter from './NotificationCenter';
import { Recycle, Plus, HelpCircle } from 'lucide-react';
import { AUTHORITIES } from '../../../config/constants';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAppSelector(state => state.authentication);

  const canCreateSurplus = user?.authorities.includes(AUTHORITIES.COMPANY) || 
                          user?.authorities.includes(AUTHORITIES.ADMIN);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="relative">
              <Recycle className="h-8 w-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Surplus360
              </span>
              <div className="text-xs text-muted-foreground">
                Plateforme B2B
              </div>
            </div>
          </Link>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <NotificationCenter />

            {/* Quick Actions */}
            {canCreateSurplus && (
              <Button 
                size="sm" 
                className="hidden sm:flex bg-primary hover:bg-primary/90"
                asChild
              >
                <Link to="/entities/product/new">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('product.addSurplus')}
                </Link>
              </Button>
            )}

            {/* Help */}
            <Button variant="ghost" size="sm">
              <HelpCircle className="h-4 w-4" />
            </Button>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
