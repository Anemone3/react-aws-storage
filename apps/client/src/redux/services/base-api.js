import { createApi } from "@reduxjs/toolkit/query/react";
import { fetchBaseWithAuth } from "../fetchBaseWithAuth";

export const baseApi = createApi({
  baseQuery: fetchBaseWithAuth(`${import.meta.env.VITE_API_URL}`),
  reducerPath: "baseApi",
  tagTypes: ["Pins", "Collections"],
  endpoints: () => ({}),
});

export const getRefreshToken = async (api) => {
  await api.dispatch(authApi.endpoints.refreshToken.initiate()).unwrap();

  // api.dispatch(
  //   setAuthenticate({
  //     accessToken,
  //     user: data,
  //   }),
  // );
};
