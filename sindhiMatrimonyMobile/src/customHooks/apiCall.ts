import { useState } from 'react';
import { apiRequest } from '../redux/apiService';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiCall = async (config: any) => {
        setLoading(true);
        setError(null);

        try {
            const res = await apiRequest(config);
            return res;
        } catch (err: any) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { apiCall, loading, error };
};