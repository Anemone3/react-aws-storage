import { useEffect, useRef } from 'react';
import { useRefreshTokenMutation } from '../redux/services/auth-api';
import { useSelector } from 'react-redux';

export const useAuthentication = body => {
  const hasRefreshed = useRef(false);

  const [refreshToken, { data, error, isLoading }] = useRefreshTokenMutation();

  const { accessToken } = useSelector(state => state.auth);

  useEffect(() => {
    if (!hasRefreshed.current) {
      const checkAuth = async () => {
        // console.log("Verificando Token");
        try {
          await refreshToken(body).unwrap();
        } catch (error) {
          // console.error("Auth failed:", error);
        }
      };

      if (!accessToken) checkAuth();
    }

    return () => (hasRefreshed.current = true);
  }, []);

  return { data, isLoading, error };
};
