import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseWithAuth } from '../fetchBaseWithAuth';

export const baseApi = createApi({
  baseQuery: fetchBaseWithAuth(`${import.meta.env.VITE_API_URL}/api`),
  reducerPath: 'baseApi',
  tagTypes: ['Pins', 'Collections'],
  endpoints: () => ({}),
});
