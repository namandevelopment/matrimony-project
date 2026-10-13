import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { apiGet } from '../redux/apiService';

interface ApiQueryParams {
  queryKey: any[];
  url: string;
  params?: Record<string, any>;
  enabled?: boolean;
  options?: Partial<UseQueryOptions<any, any, any, any>>;
}

export const useApiQuery = ({
  queryKey,
  url,
  params = {},
  enabled = true,
  options = {},
}: ApiQueryParams) => {
  return useQuery({
    queryKey,
    enabled,
    queryFn: () => apiGet(url, { params }),
    ...options,
  });
};
