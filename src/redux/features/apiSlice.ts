import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { db } from '@/components/app/root-components/firebase'
import { collection, getDocs } from 'firebase/firestore'


export const fireStoreApi = createApi({
    reducerPath: 'firestoreApi', // the path for the reducer
    baseQuery: fakeBaseQuery(), // because we are using fb that has no endpoint
    endpoints: (builder) => ({
        fetchDataFromDb: builder.query<{[key: string]: any }, string>({ //builder.query for makes requests, builder.mutation for CRUD operations
            async queryFn(email) {    // forgotten why I used queryFn and not just query. Will do my research as to why
                try {
                    const ref = collection(db, `users/${email}/tasks`)
                    const querySnapshot = await getDocs(ref)
                    const boards = querySnapshot.docs.map(doc => doc.data())
                    return { data: boards } // data must be returned in this form if you are usig queryFn
                }    
                catch(e) {
                    return { error: e }
                }   
            }
        })
    })
})

export const { useFetchDataFromDbQuery } = fireStoreApi