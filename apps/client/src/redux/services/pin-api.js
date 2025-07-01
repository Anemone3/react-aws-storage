import { collectionApi } from './collection-api';
import { baseApi } from './base-api';

export const pinApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getPins: builder.query({
      query: (params = {}) => {
        const { page = 1 } = params || {};

        return `/pins?page=${page}`;
      },
      providesTags: result =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Pins', id })), // Etiquetas específicas para cada pin
              { type: 'Pins', id: 'LIST' }, // Etiqueta genérica para la lista
            ]
          : [{ type: 'Pins', id: 'LIST' }],
    }),
    createPin: builder.mutation({
      query: ({ userId, formData }) => ({
        url: `/pins/${userId}`,
        method: 'POST',
        body: formData,
      }),
      async onQueryStarted({ userId }, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;

          if (!result.data?.data) {
            console.log('No data returned from queryFulfilled');
            return;
          }

          const createdPin = result.data.data;

          if (!createdPin.collections || createdPin.collections.length === 0) {
            console.log('ni una collecion asociada');
            return;
          }

          dispatch(
            collectionApi.util.updateQueryData(
              'getAllCollections',
              {
                userId,
              },
              draft => {
                if (!Array.isArray(draft.collections) || draft.collections.length === 0) {
                  return draft;
                }

                const collectionsIdList = createdPin.collections.map(c => c.collectionId);

                collectionsIdList.forEach(collectionId => {
                  const collection = draft.collections.find(c => c.id === collectionId);

                  if (collection) {
                    if (!collection.pins.some(p => p.id === createdPin.id)) {
                      collection.pins.push({
                        id: createdPin.id,
                        userId: createdPin.userId,
                        title: createdPin.title,
                        description: createdPin.description,
                        imageUrl: createdPin.imageUrl,
                        link: createdPin.link,
                        createdAt: createdPin.createdAt,
                        updatedAt: createdPin.updatedAt,
                      });
                    }
                  }
                });

                return draft;
              },
            ),
          );
        } catch (error) {
          console.error('Error in onQueryStarted:', error);
        }
      },
    }),
    deletePin: builder.mutation({
      query: ({ userId, formData }) => ({
        url: `/pins/${userId}`,
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useCreatePinMutation, useGetPinsQuery, useLazyGetPinsQuery } = pinApi;
