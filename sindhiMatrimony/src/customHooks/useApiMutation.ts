// hooks/useApiMutation.ts

import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../redux/apiService';

export const useApiMutation = () => {
  return useMutation({
    mutationFn: ({
      url,
      method = 'POST',
      data = {},
      params = {},
      isToken = true,
    }: any) =>
      apiRequest({
        url,
        method,
        data,
        params,
        isToken,
      }),
  });
};