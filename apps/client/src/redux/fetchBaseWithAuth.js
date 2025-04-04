import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearAuthenticate, setAuthenticate } from "./features/auth-slice";
import { authApi } from "./services/auth-api";

export const fetchBaseWithAuth = (baseUrl = "")=> async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = getState().auth;

      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);


  if (result.error) {
    
    if(result.error.status === 401){
      try {
        const {accessToken, data } = await api.dispatch(
          authApi.endpoints.refreshToken.initiate()
        ).unwrap();
        
        console.log(refreshResult);
    
        if(accessToken) {
          api.dispatch(setAuthenticate({
            accessToken: accessToken,
            user: data
          }));
        }
    
          return baseQuery(args, api, extraOptions);
      } catch (error) {
        api.dispatch(clearAuthenticate());
      }
    }else if (result.error.status === 403) {
      console.log('Acceso prohibido - limpiando autenticación');
      api.dispatch(clearAuthenticate());
    }

  }

  return result;
};
