"use client";
import { useState, useRef } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./utils/firebase";
import { useEffect } from "react";
import { getSession } from "next-auth/react";
import { data } from "./utils/data.js";
import {
  useFetchDataFromDbQuery,
} from "@/components/redux/services/apiSlice";
import Boards from "./root-components/Boards";
import Sidebar from "./root-components/Sidebar";

export default function Dashboard() {

  const [getUser, setGetUser] = useState<{ [key: string]: any }>();
  const getUserSession = async () => {

    const session = await getSession();
    if (session) {
      setGetUser(session.user);
    }
  };

  const handleAddDoc = async () => {
    if (!getUser) return;
    // this is a way to check if a user already exists in the db, by checking if a tasks exists for a user
    const docRef = collection(db, "users", getUser.email, "tasks");
    const getDos = await getDocs(docRef);
    if (getDos.docs.length > 0) {
      return;
    } else {
      try {
        await addDoc(collection(db, "users", getUser.email, "tasks"), data);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  useEffect(() => {
    getUserSession(); // step 3 => after page renders, call this function
  }, []);

  useEffect(() => {
      handleAddDoc(); // step 4 => when the user data changes, call this function
    }, [getUser])

  return (
    <main className="h-full">
      <div className="md:flex h-full">
            <Sidebar />
            <Boards /> 
      </div>     
    </main>
  );
}
