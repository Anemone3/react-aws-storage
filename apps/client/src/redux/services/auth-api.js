import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchBaseWithAuth } from "../fetchBaseWithAuth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseWithAuth("http://localhost:3000/api/auth"),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/refreshToken",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
} = authApi;
