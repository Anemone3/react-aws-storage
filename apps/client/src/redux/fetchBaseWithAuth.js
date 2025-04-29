import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearAuthenticate } from './features/auth-slice';
import { getRefreshToken } from './services/base-api';

export const fetchBaseWithAuth =
  (baseUrl = '') =>
  async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
      baseUrl: baseUrl,
      credentials: 'include',
      prepareHeaders: (headers, { getState }) => {
        const { accessToken } = getState().auth;

        console.log({ accessToken });

        if (accessToken) {
          headers.set('Authorization', `Bearer ${accessToken}`);
        }
        return headers;
      },
    });

    let result = await baseQuery(args, api, extraOptions);

    if (result.error) {
      if (result.error.status === 401) {
        try {
          await getRefreshToken(api);
          // **** Esto me da dependencia circular, el error: Uncaught ReferenceError: can't access lexical declaration 'fetchBaseWithAuth' before initialization ***///
          // await api.dispatch(
          //   authApi.endpoints.refreshToken.initiate()
          // ).unwrap();

          result = await baseQuery(args, api, extraOptions);
        } catch (error) {
          api.dispatch(clearAuthenticate());
          //api.dispatch(authApi.util.resetApiState());
        }
      } else if (result.error.status === 403) {
        // console.log('Acceso prohibido - limpiando autenticación');
        api.dispatch(clearAuthenticate());
      }
    }

    return result;
  };
