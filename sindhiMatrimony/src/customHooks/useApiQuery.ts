// hooks/useApiQuery.ts

import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../redux/apiService';

export const useApiQuery = ({
  queryKey,
  url,
  params = {},
  isToken = true,
  enabled = true,
}: any) => {
  return useQuery({
    queryKey,

    enabled,

    queryFn: () =>
      apiRequest({
        url,
        method: 'GET',
        params,
        isToken,
      }),
  });
};


// const {
//   data,
//   isLoading,
//   error,
//   refetch,
// } = useApiQuery({
//   queryKey: ['home-list'],
//   url: '/home',
// });