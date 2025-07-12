
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

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
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
