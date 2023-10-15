import { db } from '@/components/app/utils/firebase'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { getSession } from 'next-auth/react'



export const getBoardFromDb = async () => {
        const session = await getSession();
        if(session?.user) {
            const { user } = session
            const ref = collection(db, `users/${user.email}/tasks`)
            const querySnapshot = await getDocs(ref)
            return querySnapshot.docs.map(doc => doc.data())    
        }
    }
    
export const updateDbBoard = async (boardData: {[key: string]: any}) => {
        const session = await getSession();
        if(session?.user) {
            const { user } = session
            const ref = collection(db, `users/${user.email}/tasks`)
            const querySnapshot = await getDocs(ref)
            const boardId = querySnapshot.docs.map(doc => {
                return doc.id
            })
            await updateDoc(doc(db, `users/${user.email}/tasks/${boardId}`), {
                boards: boardData
            })
        }
    }   