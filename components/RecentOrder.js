'use client'

export default function RecentOrder({ order }) {

    // Get the 10 most recent orders
    const recentOrders = order.slice(-10);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
                <table className="table-auto rounded-md w-full border-collapse border border-gray-400">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="px-4 py-2">Order</th>
                            <th className="px-4 py-2">Customer</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Total</th>
                            <th className="px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map((order, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                <td className="border px-4 py-2">{order._id}</td>
                                <td className="border px-4 py-2">{order.user}</td>
                                <td className="border px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="border px-4 py-2">{order.amount}</td>
                                <td className="border px-4 py-2">{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
