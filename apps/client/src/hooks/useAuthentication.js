import { useEffect, useRef } from 'react';
import { useRefreshTokenMutation } from '../redux/services/auth-api';
import { useSelector } from 'react-redux';
import { Axis3D } from 'lucide-react';

export const useAuthentication = () => {
  const hasRefreshed = useRef(false);

  const [refreshToken, { data, error, isLoading }] = useRefreshTokenMutation();

  const { accessToken } = useSelector(state => state.auth);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasRefreshed.current) {
        hasRefreshed.current = true;
        refreshToken(accessToken);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return { data, isLoading, error };
};
