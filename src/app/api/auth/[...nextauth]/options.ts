import type { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { collection } from "firebase/firestore";
import { addDoc, getDocs, doc } from "firebase/firestore"; 
import { db } from '@/components/app/utils/firebase';
import data from '../../../root-components/data.json'
import { User } from 'next-auth';

export const options: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          })
    ],
// ...
}
// 116323452573569343854