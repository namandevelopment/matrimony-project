import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { apiPost, apiPut, apiDelete } from '../redux/apiService';

interface ApiMutationParams {
  url: string;
  method?: 'POST' | 'PUT' | 'DELETE';
  options?: Partial<UseMutationOptions<any, any, any, any>>;
}

export const useApiMutation = ({
  url,
  method = 'POST',
  options = {},
}: ApiMutationParams) => {
  return useMutation({
    mutationFn: (data: any) => {
      if (method === 'PUT') return apiPut(url, data);
      if (method === 'DELETE') return apiDelete(url, { data });
      return apiPost(url, data);
    },
    ...options,
  });
};
