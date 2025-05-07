import { baseApi } from './base-api';

export const collectionApi = baseApi.injectEndpoints({
  reducerPath: 'collectionApi',
  endpoints: builder => ({
    getAllCollections: builder.query({
      query: ({ userId }) => ({
        url: `/collection/${userId}`,
        method: 'GET',
      }),
      providesTags: result =>
        result?.collections
          ? [
              ...result.collections.map(({ id }) => ({
                type: 'Collections',
                id,
              })),
              { type: 'Collections', id: 'LIST' },
            ]
          : [{ type: 'Collections', id: 'LIST' }],
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        // Remover el accessToken de la clave para evitar múltiples entradas
        const { userId } = queryArgs;
        return { endpointName, userId };
      },
    }),
    createCollection: builder.mutation({
      query: ({ userId, title, isPublic }) => ({
        url: `/collection/${userId}/collections`,
        body: {
          title,
          isPublic,
        },
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Collections', id: 'LIST' }],
    }),
    addPinToCollection: builder.mutation({
      query: ({ collectionId, pinId }) => ({
        url: `/collection/${collectionId}/pins/${pinId}`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Collections', id: 'LIST' }],
    }),
    removePinToCollection: builder.mutation({
      query: ({ collectionId, pinId, userId }) => ({
        url: `/collection/${userId}`,
        method: 'DELETE',
        body: {
          collectionId: Number(collectionId),
          pinId: Number(pinId),
        },
      }),
      async onQueryStarted({ collectionId, pinId, userId }, { dispatch, queryFulfilled }) {
        try {
          // Opcional: Actualización optimista de la caché
          const patchResult = dispatch(
            collectionApi.util.updateQueryData('getAllCollections', { userId }, draft => {
              const collection = draft.collections.find(c => c.id === collectionId);
              if (collection) {
                collection.pins = collection.pins.filter(pin => pin.id !== pinId); // Elimina el pin de la colección
              }
            }),
          );

          // Espera a que la mutación se complete
          await queryFulfilled;
        } catch (error) {
          console.error('Error en removePinToCollection:', error);
          // Revertir cambios si la mutación falla
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: 'Collections', id: 'LIST' }],
    }),
  }),
});

export const { useCreateCollectionMutation, useGetAllCollectionsQuery, useAddPinToCollectionMutation, useRemovePinToCollectionMutation } =
  collectionApi;
