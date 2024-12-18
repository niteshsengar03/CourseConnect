import { useState, useCallback } from 'react';
import { apiCall } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const request = useCallback(async (endpoint, method, body = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall(endpoint, method, body, user?.token);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [user]);

  return { request, loading, error };
};

