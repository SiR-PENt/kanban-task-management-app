import { getSession } from "next-auth/react";
import { updateUserDetails, getUserDetails } from "@/components/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/components/redux/hooks";

export default function useGetUserSession() {

    const dispatch = useAppDispatch();

    const getUserSession = async () => {
        const session =  await getSession();
        dispatch(updateUserDetails(session?.user))
       }

    const user = useAppSelector(getUserDetails) 
    
    return { getUserSession, user }
}