'use client';

import React, { useState, useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { store, AppDispatch } from '@/redux/Store/store';
import { queryClient as defaultQueryClient } from '@/tanstackQuery/client';
import { ModalProvider } from '@/customModals';
import { get_Master_Dropdowns_Call } from '@/redux/useDispatch';
import { selectMasterDropdowns } from '@/redux/useSelector';

function MasterDataInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const dropdowns = useSelector(selectMasterDropdowns);

  useEffect(() => {
    if (!dropdowns || Object.keys(dropdowns).length === 0) {
      get_Master_Dropdowns_Call(dispatch);
    }
  }, [dispatch, dropdowns]);

  return null;
}

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Use state to ensure client-side QueryClient instance persistence across re-renders
  const [queryClient] = useState(() => defaultQueryClient);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          <MasterDataInitializer />
          {children}
        </ModalProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default Providers;
