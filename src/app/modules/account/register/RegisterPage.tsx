
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../../shared/hooks/useAppSelector';
import RegisterForm from './RegisterForm';

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAppSelector(state => state.authentication);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Surplus360
          </h1>
          <p className="text-muted-foreground mt-2">
            Rejoignez la plateforme B2B
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
