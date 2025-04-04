import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const collectionApi = createApi({
  reducerPath: "collectionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/collection",
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = getState().auth;

      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Collections"],
  endpoints: (builder) => ({
    getAllCollections: builder.query({
      query: (userId) => ({
        url: `/${userId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.collections
          ? [
              ...result.collections.map(({ id }) => ({
                type: "Collections",
                id,
              })),
              { type: "Collections", id: "LIST" },
            ]
          : [{ type: "Collections", id: "LIST" }],
    }),
    createCollection: builder.mutation({
      query: ({ userId, title }) => ({
        url: `/${userId}/collections`,
        body: {
          title,
        },
        method: "POST",
      }),
      invalidatesTags: [{ type: "Collections", id: "LIST" }],
    }),
  }),
});

export const { useCreateCollectionMutation, useGetAllCollectionsQuery } =
  collectionApi;
