import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Routes from './routes/Routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 5, // 5 minutes fresh data
      gcTime: 1000 * 60 * 30, // 30 minutes in-memory cache
      retry: 1,
    },
  },
});

import { GlobalModalProvider } from './customModals/ModalContext';
import { ToastProvider } from './toastMessage/toast';
import { NetworkProvider } from './network';

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NetworkProvider>
          <GlobalModalProvider>
            <Routes />
            <ToastProvider />
          </GlobalModalProvider>
        </NetworkProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
