'use client'
import React from 'react'
import Navbar from '../../components/Navbar'
import { usePathname, useRouter } from 'next/navigation';



export default function Layout({ children }) {
    const pathname = usePathname();
    return (
        <>
            <div className='bg-indigo-500 h-14 px-10 flex justify-between items-center'>
                <h1 className='text-xl'>Ecommerce Admin</h1>
                <h1 className='text-xl'>{pathname.split('/')}</h1>
            </div>
            <div className="flex bg-gray-600  h-screen w-screen">
                <div className=" bg-gray-900 h-full w-1/4">
                    <Navbar />
                </div>
                <div className="p-2 w-full h-full overflow-hidden  ">
                    {children}
                </div>
            </div>
        </>
    )
}
