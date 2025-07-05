
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch } from '../shared/hooks/useAppDispatch';
import { useAppSelector } from '../shared/hooks/useAppSelector';
import { getSession } from '../shared/reducers/authentication';
import PrivateRoute from '../shared/components/PrivateRoute';
import Layout from '../shared/layout/Layout';
import LoadingSpinner from '../shared/components/LoadingSpinner';

// Page imports
import LoginPage from '../modules/account/login/LoginPage';
import RegisterPage from '../modules/account/register/RegisterPage';
import DashboardPage from '../modules/dashboard/DashboardPage';
import ProductListPage from '../entities/product/ProductListPage';
import MySurplusPage from '../entities/product/MySurplusPage';
import ProductDetailPage from '../entities/product/ProductDetailPage';
import RequestListPage from '../entities/request/RequestListPage';
import TransactionListPage from '../entities/transaction/TransactionListPage';
import RSEDashboardPage from '../modules/rse/RSEDashboardPage';
import AccountSettingsPage from '../modules/account/settings/AccountSettingsPage';

import { AUTHORITIES } from '../config/constants';

const AppRoutes: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, sessionHasBeenFetched } = useAppSelector(state => state.authentication);

  useEffect(() => {
    if (!sessionHasBeenFetched) {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (token) {
        dispatch(getSession());
      }
    }
  }, [dispatch, sessionHasBeenFetched]);

  if (!sessionHasBeenFetched) {
    return <LoadingSpinner message="Initialisation de l'application..." />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes with layout */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Layout>
            <DashboardPage />
          </Layout>
        </PrivateRoute>
      } />
      
      {/* Product routes */}
      <Route path="/entities/product" element={
        <PrivateRoute>
          <Layout>
            <ProductListPage />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/entities/product/my-surplus" element={
        <PrivateRoute authorities={[AUTHORITIES.COMPANY, AUTHORITIES.ADMIN]}>
          <Layout>
            <MySurplusPage />
          </Layout>
        </PrivateRoute>
      } />
      
      <Route path="/entities/product/:id" element={
        <PrivateRoute>
          <Layout>
            <ProductDetailPage />
          </Layout>
        </PrivateRoute>
      } />
      
      {/* Request routes */}
      <Route path="/entities/request" element={
        <PrivateRoute>
          <Layout>
            <RequestListPage />
          </Layout>
        </PrivateRoute>
      } />
      
      {/* Transaction routes */}
      <Route path="/entities/transaction" element={
        <PrivateRoute>
          <Layout>
            <TransactionListPage />
          </Layout>
        </PrivateRoute>
      } />
      
      {/* RSE Dashboard */}
      <Route path="/rse-dashboard" element={
        <PrivateRoute>
          <Layout>
            <RSEDashboardPage />
          </Layout>
        </PrivateRoute>
      } />
      
      {/* Account settings */}
      <Route path="/account/settings" element={
        <PrivateRoute>
          <Layout>
            <AccountSettingsPage />
          </Layout>
        </PrivateRoute>
      } />
      
      {/* Redirects */}
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
      } />
      
      {/* 404 fallback */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-muted-foreground">Page non trouvée</p>
          </div>
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;
