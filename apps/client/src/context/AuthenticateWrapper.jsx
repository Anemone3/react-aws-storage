import { useNavigate, useSearchParams } from 'react-router';
import { useAuthentication } from '../hooks/useAuthentication';
import { useEffect } from 'react';

export const AuthenticateWrapper = ({ children }) => {
  const [searchParam] = useSearchParams();
  const navigate = useNavigate();
  const tokenProvider = searchParam.get('auth') || null;

  const { data, isLoading } = useAuthentication(tokenProvider);

  useEffect(() => {
    if (data && data.accessToken) {
      if (location.pathname === '/success' && tokenProvider) {
        // If the user is already authenticated and the token provider is present, redirect to the home page
        navigate('/', { replace: true });
      }
      //   navigate('/', { replace: true });
    } else if (data && !data.accessToken) {
      navigate('/login', { replace: true });
    }
  }, [data, tokenProvider]);

  return children;
};
