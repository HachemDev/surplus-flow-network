
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Settings, 
  LogOut, 
  Building
} from 'lucide-react';
import { toast } from 'sonner';

const UserMenu = () => {
  const { currentUser, currentCompany, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    navigate('/auth');
  };

  const getInitials = () => {
    if (currentUser) {
      return `${currentUser.firstName[0]}${currentUser.lastName[0]}`.toUpperCase();
    }
    return 'U';
  };

  const getRoleColor = () => {
    switch (currentUser?.role) {
      case 'ADMIN':
        return 'bg-purple-500';
      case 'COMPANY':
        return 'bg-blue-500';
      case 'ASSOCIATION':
        return 'bg-red-500';
      case 'ENTREPRENEUR':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser?.avatar} alt={currentUser?.firstName} />
            <AvatarFallback className={getRoleColor()}>
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          {currentCompany?.verified && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80" align="end" forceMount>
        {/* User Info */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={currentUser?.avatar} alt={currentUser?.firstName} />
              <AvatarFallback className={getRoleColor()}>
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">
                {currentUser?.firstName} {currentUser?.lastName}
              </div>
              <div className="text-sm text-muted-foreground">{currentUser?.email}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {currentUser?.role?.replace('_', ' ')}
                </Badge>
                {currentUser?.isVerified && (
                  <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                    Vérifié
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {currentCompany && (
            <div className="mt-3 p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{currentCompany.name}</span>
                {currentCompany.verified && (
                  <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                    Certifié
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {currentCompany.industry} • {currentCompany.location}
              </div>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="p-1">
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <User className="mr-2 h-4 w-4" />
            <span>Mon Profil</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate('/company')}>
            <Building className="mr-2 h-4 w-4" />
            <span>Mon Entreprise</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Déconnexion</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
