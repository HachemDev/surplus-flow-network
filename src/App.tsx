
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import { store } from './app/shared/reducers';
import setupAxiosInterceptors from './app/config/axios-interceptor';
import { clearAuth } from './app/shared/reducers/authentication';
import AppRoutes from './app/routes/AppRoutes';
import ErrorBoundary from './app/shared/components/ErrorBoundary';

// Import i18n configuration
import './app/config/translation';


const clearAuthenticationAndReload = () => {
  store.dispatch(clearAuth());
  window.location.href = '/login';
};

// Setup axios interceptors
setupAxiosInterceptors(clearAuthenticationAndReload);

const App: React.FC = () => {
  useEffect(() => {
    // PWA update notification
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SKIP_WAITING') {
          window.location.reload();
        }
      });
    }
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TooltipProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
