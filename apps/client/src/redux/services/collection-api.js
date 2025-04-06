import { baseApi } from "./base-api";

export const collectionApi = baseApi.injectEndpoints({
  reducerPath: "collectionApi",
  endpoints: (builder) => ({
    getAllCollections: builder.query({
      query: (userId) => ({
        url: `/collection/${userId}`,
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
        url: `/collection/${userId}/collections`,
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
