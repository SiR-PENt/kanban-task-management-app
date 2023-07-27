'use client'
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./root-components/firebase";
import { useEffect } from "react";
import { getSession } from 'next-auth/react'
import data from './root-components/data.json'
import { updateUserDetails, getUserDetails } from "../redux/features/userSlice";
import { useAppDispatch, useAppSelector } from '@/components/redux/hooks'
import { useFetchDataFromDbQuery } from "../redux/features/apiSlice";

export default function Dashboard() {

  const dispatch = useAppDispatch(); // step 1

  const getUserSession = async () => {
   const session =  await getSession();
   dispatch(updateUserDetails(session?.user))
  }  // step 2 => getSession of user and save in the redux user state
  
  const user = useAppSelector(getUserDetails) // step 3 => get user data from redux store
  
  const handleAddDoc = async () => { 
    // this is a way to check if a user already exists in the db, by checking if a tasks exists for a user
       const docRef = collection(db, "users", user.email, 'tasks')
       const getDos = await getDocs(docRef);
       if(getDos.docs.length > 0) {
          return
       }
       else {
        try { 
          await addDoc(collection(db, "users", user.email, 'tasks'), data);
        } catch (e) {
          console.error("Error adding document: ", e);
        }
       }}
       
       if(user) {
         const { data, error } = useFetchDataFromDbQuery(user.email)
         console.log('data', data, 'error', error)
       }

     useEffect(() => {
         handleAddDoc() // step 4 => when the user data changes, call this function
     }, [user])
  
  useEffect(() => {
    getUserSession() // step 3 => after page renders, call this function
  }, [])

  return (
    <main>
     <p className="dark:text-red-900"></p>
    </main>
  )
}
