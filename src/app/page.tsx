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
import {
  setIsAddedToTrue,
  getIsAddedValue,
} from "../redux/features/modalSlice";
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";
import Boards from "./root-components/Boards";
import Sidebar from "./root-components/Sidebar";

export default function Dashboard() {

  const [getUser, setGetUser] = useState<{ [key: string]: any }>();
  const { data: dbData, isLoading } = useFetchDataFromDbQuery();
  const initialRender = useRef(true);
  const dispatch = useAppDispatch();
  const isAdded = useAppSelector(getIsAddedValue);
  const getUserSession = async () => {
    const session = await getSession();
    if (session) {
      setGetUser(session.user);
    }
  };

  const handleAddDoc = async () => {
    console.log(getUser);
    if (!getUser) return;
    // this is a way to check if a user already exists in the db, by checking if a tasks exists for a user
    const docRef = collection(db, "users", getUser.email, "tasks");
    const getDos = await getDocs(docRef);
    if (getDos.docs.length > 0) {
      dispatch(setIsAddedToTrue());
      return;
    } else {
      try {
        await addDoc(collection(db, "users", getUser.email, "tasks"), data);
        dispatch(setIsAddedToTrue());
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  useEffect(() => {
    getUserSession(); // step 3 => after page renders, call this function
  }, []);

  useEffect(() => {
    if (!initialRender.current) {
      handleAddDoc(); // step 4 => when the user data changes, call this function
      console.log(data)
    }
    else {
      initialRender.current = false;
      console.log(initialRender.current);
    }
  }, [getUser]);

  return (
    <main className="h-full">
      <div className="md:flex h-full">
            <Sidebar />
            <Boards /> 
      </div>     
    </main>
  );
}
