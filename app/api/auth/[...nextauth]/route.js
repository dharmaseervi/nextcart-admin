// src/app/api/auth/[...nextauth].js

import NextAuth from 'next-auth/next';
import Googleprovider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';

const authOptions ={
    providers: [
        Googleprovider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        
    ],
    adapter: MongoDBAdapter(clientPromise),
   
};
const handler = NextAuth(authOptions);
export {handler as GET, handler as POST}