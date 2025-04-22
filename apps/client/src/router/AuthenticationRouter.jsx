import { Outlet, useNavigate, useSearchParams } from 'react-router';
import { useAuthentication } from '../hooks/useAuthentication';
import { useEffect } from 'react';

const AuthenticationRouter = () => {
  const [searchParam] = useSearchParams();

  const navigate = useNavigate();
  const tokenProvider = searchParam.get('auth') || null;

  const { data, isLoading } = useAuthentication(tokenProvider);

  useEffect(() => {
    if (data && data.accessToken) {
      if (location.pathname === '/success') {
        navigate('/', { replace: -1 });
      }
    } else if (data && !data.accessToken) {
      navigate('/login', { replace: true });
    }
  }, [data]);

  return <Outlet />;
};

export default AuthenticationRouter;
