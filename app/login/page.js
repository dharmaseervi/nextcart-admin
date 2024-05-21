'use client'

import React from 'react'
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';

export default function Login() {
    // const { data: session } = useSession();
    // const router = useRouter();
    // useEffect(() => {
    //     if (session) {
    //         router.push('/')
    //     }
    // }, [session])

    return (
        <div className='flex flex-col justify-start items-center mx-auto space-y-4 p-20 bg-indigo-900 h-screen w-screen'>
            <div className='flex flex-col gap-3 justify-center align-center border w-2/4 h-5/6 p-5'>
                <div>
                    <h1 className="text-white font-serif font-bold text-4xl p-2 text-center">Login</h1>
                </div>
                <div className='flex flex-col w-full'>
                    <div>
                        <label htmlFor="email" className='text-white font-serif font-bold'>email</label>
                        <input type="email" name="email" id="" className='border-black p-2' placeholder=' enter your email' />
                    </div>
                    <div>
                        <label htmlFor="password" className='text-white font-serif font-bold'>password</label>
                        <input type="password" name="password" id="" className='border-black p-2' placeholder=' enter your password' />
                    </div>
                </div>
                <div className='flex justify-center w-full'>
                    <button className=' px-4 py-2 rounded text-white font-medium text-xl uppercase font-serif border-white border w-full bg-gray-800'>login with email</button>
                </div>
                <div className='flex justify-center w-full'>
                    <button onClick={() => { signIn('google') }} className=' px-4 py-2 rounded text-white font-medium text-xl uppercase font-serif border-white border w-full bg-red-800'>login with google</button>
                </div>
            </div>
        </div>
    )

}
