import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { apiFetch } from '../redux/apiService';

interface ApiMutationParams {
  url: string;
  method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  options?: Partial<UseMutationOptions<any, any, any, any>>;
}

export const useApiMutation = ({
  url,
  method = 'POST',
  options = {},
}: ApiMutationParams) => {
  return useMutation({
    mutationFn: (data: any) => {
      return apiFetch({
        url,
        method,
        data,
      });
    },
    ...options,
  });
};
