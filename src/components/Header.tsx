
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import NotificationCenter from './NotificationCenter';
import Logo from './header/Logo';
import QuickStats from './header/QuickStats';
import UserMenu from './header/UserMenu';
import { Plus, HelpCircle } from 'lucide-react';

const Header = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Center - Quick Stats */}
          <QuickStats />

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <NotificationCenter />

            {/* Quick Actions */}
            {(currentUser?.role === 'COMPANY' || currentUser?.role === 'ADMIN') && (
              <Button 
                size="sm" 
                className="hidden sm:flex bg-primary hover:bg-primary/90"
                onClick={() => navigate('/my-surplus')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Surplus
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
