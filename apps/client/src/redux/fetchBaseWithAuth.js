import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearAuthenticate, setAuthenticate } from './features/auth-slice';

export const fetchBaseWithAuth =
  (baseUrl = '') =>
  async (args, api, extraOptions) => {
    const baseQuery = fetchBaseQuery({
      baseUrl: baseUrl,
      credentials: 'include',
      prepareHeaders: (headers, { getState }) => {
        const { accessToken } = getState().auth;

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
          // Realiza la solicitud para obtener un nuevo token
          const refreshResult = await baseQuery(
            {
              url: '/auth/token',
              method: 'POST',
              body: {
                refreshToken: api.getState().auth.refreshToken,
              },
            },
            api,
            extraOptions,
          );

          if (refreshResult.data) {
            // Actualiza el estado con el nuevo token
            const { accessToken, user } = refreshResult.data;
            api.dispatch(
              setAuthenticate({
                accessToken,
                user,
              }),
            );

            // Reintenta la solicitud original con el nuevo token
            result = await baseQuery(args, api, extraOptions);
          } else {
            // Si no se puede actualizar el token, realiza el logout
            await handleLogout(api, baseQuery, extraOptions);
          }
        } catch (error) {
          // Si ocurre un error, realiza el logout
          await handleLogout(api, baseQuery, extraOptions);
        }
      } else if (result.error.status === 403) {
        // Manejo de errores 403 (prohibido)
        await handleLogout(api, baseQuery, extraOptions);
      }
    }

    return result;
  };

// Función para manejar el logout
const handleLogout = async (api, baseQuery, extraOptions) => {
  try {
    // Realiza la solicitud de logout al servidor
    await baseQuery(
      {
        url: '/auth/logout',
        method: 'POST',
        credentials: 'include',
      },
      api,
      extraOptions,
    );
  } catch (error) {
    console.error('Error durante el logout:', error);
  } finally {
    api.dispatch(clearAuthenticate());
  }
};
