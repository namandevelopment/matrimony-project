import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from './redux/Store/store';
import { queryClient } from './tanstackQuery/client';
import Routes from './routes/Routes';
import { GlobalModalProvider } from './customModals/ModalContext';
import { ToastProvider } from './toastMessage/toast';
import { NetworkProvider } from './network';

export const App: React.FC = () => {
  return (
    <Provider store={store}>
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
    </Provider>
  );
};

export default App;
