
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import ErrorBoundary from '@/components/ErrorBoundary';

// Pages
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Marketplace from '@/pages/Marketplace';
import MySurplus from '@/pages/MySurplus';
import Tracking from '@/pages/Tracking';
import Profile from '@/pages/Profile';
import Company from '@/pages/Company';
import NotFound from '@/pages/NotFound';

// Types
import { UserRole } from '@/types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected routes with layout */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/marketplace" element={
                  <ProtectedRoute>
                    <Layout>
                      <Marketplace />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/my-surplus" element={
                  <ProtectedRoute requiredRoles={[UserRole.COMPANY, UserRole.ADMIN]}>
                    <Layout>
                      <MySurplus />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/tracking" element={
                  <ProtectedRoute>
                    <Layout>
                      <Tracking />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Layout>
                      <Profile />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/company" element={
                  <ProtectedRoute>
                    <Layout>
                      <Company />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                {/* Redirects */}
                <Route path="/login" element={<Navigate to="/auth" replace />} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
