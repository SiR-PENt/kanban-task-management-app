import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { getBoardFromDb, updateDbBoard } from '@/components/app/utils/functions'
// next-redux-wrapper


export const fireStoreApi = createApi({

    reducerPath: 'firestoreApi', // the path for the reducer
    baseQuery: fakeBaseQuery(), // because we are using fb that has no endpoint
    tagTypes: ['Tasks'],
    endpoints: (builder) => ({
        fetchDataFromDb: builder.query<{[key: string]: any }[], void>({ //builder.query for making requests, builder.mutation for CRUD operations
            async queryFn() {    // forgotten why I used queryFn and not just query. Will do my research as to why:okay, this is because we are not querying
                // the data from an API, this enables us to write arbitrary code inside as long as we return our code in { data: results } form
                try {
                    return { data: getBoardFromDb() } // data must be returned in this form if you are usig queryFn
                }    
                catch(e) {
                    return { error: e }
                }   
            },
            providesTags: ['Tasks'],
        }),
        // mutations
       updateBoardToDb: builder.mutation<{ data: null } | { error: unknown }, {[key: string]: any}>({
          async queryFn(data) {
            try {
                updateDbBoard(data)
                    return { data: null }
                    }
            catch(e) {
                return { error: e }
            }},
        invalidatesTags: ['Tasks'],
       }),  
    })
})

export const { useFetchDataFromDbQuery, useUpdateBoardToDbMutation } = fireStoreApi