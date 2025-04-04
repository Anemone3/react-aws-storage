import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchBaseWithAuth } from "../fetchBaseWithAuth";
import { collectionApi } from "./collection-api";
import { current } from '@reduxjs/toolkit';


export const pinApi = createApi({
    baseQuery: fetchBaseWithAuth("http://localhost:3000/api/pins"),
    reducerPath: "pinApi",
    tagTypes: ["Pins"],
    endpoints: (builder) => ({
        createPin: builder.mutation({
            query: ({ userId, formData }) => ({
                url: `/${userId}`,
                method: "POST",
                body: formData,
            }),
            async onQueryStarted({ userId }, { dispatch, queryFulfilled }) {
                try {
                    const result = await queryFulfilled;
                    console.log('Full response:', result);

                    if (!result?.data) {
                        console.error('No data in response');
                        return;
                    }

                    const createdPin = result.data;

                    dispatch(
                        collectionApi.util.updateQueryData(
                            "getAllCollections",
                            userId,
                            (draft) => {

                                console.log('Draft Data:', current(draft.collections));
                                if (!draft?.collections) {
                                    console.error('Invalid collections structure:', draft);
                                    return draft;
                                }

                                const collectionsIdList = createdPin.data?.collections.map(c => c.collectionId);

                                const collection = draft.collections.find(
                                    c => collectionsIdList.includes(c.id)
                                );

                                console.log('Found collection:', current(collection));

                                if (collection) {
                                    collection.pins.push({
                                        id: createdPin.data.id,
                                        userId: createdPin.data.userId,
                                        title: createdPin.data.title,
                                        image: createdPin.data.image,
                                        description: createdPin.data.description,
                                        imageUrl: createdPin.data.imageUrl,
                                        createdAt: createdPin.data.createdAt,
                                        updatedAt: createdPin.data.updatedAt
                                    });
                                    /* Me faltó retornar quantity en el backend */
                                    collection.quantity += 1;
                                }

                                return draft;
                            }
                        )
                    );
                } catch (error) {
                    console.error('Error in onQueryStarted:', error);
                }
            },
        }),
    })
})


export const { useCreatePinMutation } = pinApi;