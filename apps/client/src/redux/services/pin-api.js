import { collectionApi } from './collection-api';
import { current } from '@reduxjs/toolkit';
import { baseApi } from './base-api';

export const pinApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getPins: builder.query({
      query: () => '/pins',
      providesTags: ['Pins'],
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
          console.log('Full response:', result);

          if (!result.data?.data) return;

          const createdPin = result.data;

          console.log('Created Pin:', createdPin);
          dispatch(
            pinApi.util.updateQueryData('getPins', undefined, draft => {
              console.log('draft?', draft);
              if (!draft.data.some(pin => pin.id === createdPin.data.id)) {
                draft.data.unshift(createdPin.data);
              }
            }),
          );

          if (!createdPin.data?.collections) return;

          if (createdPin.data?.collections?.length > 0) {
            dispatch(
              collectionApi.util.updateQueryData('getAllCollections', userId, draft => {
                // console.log("Draft Data:", current(draft));
                if (draft.collections?.length === 0 || !draft.collections) {
                  console.log('Invalid collections structure:', current(draft));
                  return draft;
                }

                const collectionsIdList = createdPin.data?.collections.map(c => c.collectionId);

                const collection = draft.collections.find(c => collectionsIdList.includes(c.id));

                if (collection) {
                  if (!collection.pins.some(p => p.id === createdPin.data.id)) {
                    collection.pins.push({
                      id: createdPin.data.id,
                      userId: createdPin.data.userId,
                      title: createdPin.data.title,
                      image: createdPin.data.image,
                      description: createdPin.data.description,
                      imageUrl: createdPin.data.imageUrl,
                      createdAt: createdPin.data.createdAt,
                      updatedAt: createdPin.data.updatedAt,
                    });
                  }
                }

                return draft;
              }),
            );
          }
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

export const { useCreatePinMutation, useGetPinsQuery } = pinApi;
