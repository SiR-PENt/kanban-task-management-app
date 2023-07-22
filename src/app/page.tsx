'use client'
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./root-components/firebase";
import { useEffect, useState } from "react";
import { getSession } from 'next-auth/react'
import data from './root-components/data.json'

export default function Dashboard() {

  const [ sessionUser, setSessionUser ] = useState<{[key:string]: any}>()

  const querySnapshot = async () =>  {
    const getDos =  await getDocs(collection(db, "users"));
    const docid = getDos.docs.map((doc) =>  {
      return doc.data()
    })
    return { getDos, docid }
   }

   const getDocIds = async () => {
    const session =  await getSession();
    setSessionUser(session?.user)
    if(sessionUser) {
      try {
        const docRef = await addDoc(collection(db, "users", sessionUser.email, 'tasks'), data);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      const docid = await querySnapshot();
      console.log(docid);
    }
  }
  
  useEffect(() => {
    getDocIds()
  }, [])
  // const { docid } =  querySnapshot()
  // console.log(docid)

  return (
    <main>
     <p className="dark:text-red-900"></p>
    </main>
  )
}
