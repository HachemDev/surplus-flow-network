
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import LoadingSpinner from './LoadingSpinner';

interface PrivateRouteProps {
  children: React.ReactNode;
  authorities?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, authorities = [] }) => {
  const { isAuthenticated, user, sessionHasBeenFetched } = useAppSelector(state => state.authentication);
  const location = useLocation();

  if (!sessionHasBeenFetched) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (authorities.length > 0 && user) {
    const hasRequiredAuthority = authorities.some(authority => 
      user.authorities.includes(authority)
    );
    
    if (!hasRequiredAuthority) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Accès non autorisé</h2>
            <p className="text-muted-foreground">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;
