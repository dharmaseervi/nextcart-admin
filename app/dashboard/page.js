'use client'
import { useEffect, useState } from 'react';
import Layout from '../admin/Layout';
import { signOut, useSession } from 'next-auth/react';
import LineChart from '@/components/chart';
import RecentOrder from '@/components/RecentOrder';
import DeliveredOrder, { OutforDelOrder, PendingOrder } from '@/components/deliverOrder';
import SalesPieChart from '@/components/SalesPieChart';
import OrderPlacedChart from '@/components/OrderPlacedChart';


export default function Dashboard() {
    const { data: session } = useSession();
    const [order, setOrder] = useState([])

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/adminorder", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch order data");
                }

                const data = await response.json();
                setOrder(data.orderItems);
            } catch (error) {
                setError(error.message);
            }
        };
        fetchOrder();

    }, []);


    return (
        <Layout>
            <div className='grid grid-cols-4 gap-4 h-full overflow-auto'>
                {/* User Info and Sign Out */}
                <div className='col-span-4 flex justify-between items-center p-4 bg-gray-800 text-white '>
                    {session && (
                        <div className='flex items-center gap-2'>
                            <img src={session.user.image} className='w-8 h-8 rounded-full' alt='User Avatar' />
                            <span className='text-xl font-semibold'>{session.user.name}</span>
                        </div>
                    )}
                    <div className='space-x-4'>
                        <button onClick={() => signOut()} className='px-6 py-1 rounded-sm bg-blue-500 hover:bg-blue-600'>
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Orders Summary */}
                <div className='col-span-1 p-4 border rounded-md'>
                    <DeliveredOrder order={order} />
                </div>
                <div className='col-span-1 p-4 border rounded-md'>
                    <PendingOrder order={order} />
                </div>
                <div className='col-span-2 p-4 border rounded-md'>
                    <OutforDelOrder order={order} />
                </div>

                {/* Charts */}
                <div className='col-span-1 p-4 border rounded-md'>
                    <SalesPieChart order={order} />
                </div>
                <div className='col-span-3 p-4 border rounded-md'>
                    <LineChart order={order} />
                </div>
                <div className='col-span-4 p-4 border rounded-md'>
                    <OrderPlacedChart order={order} />
                </div>

                {/* Recent Orders */}
                <div className='col-span-4 p-4 border rounded-md'>
                    <RecentOrder order={order} />
                </div>
            </div>
        </Layout>
    );
}
