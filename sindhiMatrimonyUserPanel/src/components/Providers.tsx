'use client';

import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/redux/Store/store';
import { queryClient as defaultQueryClient } from '@/tanstackQuery/client';

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Use state to ensure client-side QueryClient instance persistence across re-renders
  const [queryClient] = useState(() => defaultQueryClient);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  );
}

export default Providers;
