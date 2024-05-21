'use client'
export default function DeliveredOrder({order}) {
    // Filter the orders that are delivered
    const deliveredOrders = order.filter(order => order.status === "delivered");
    console.log(deliveredOrders);

    // Count the number of delivered orders
    const numberOfDeliveredOrders = deliveredOrders.length;

    return (
        <div className="container mx-auto px-4 py-8 ">
            <h2 className="text-2xl font-semibold mb-4 ">Orders Delivered</h2>
            <p className="text-lg text-gray-900">Number of Delivered Orders: {numberOfDeliveredOrders}</p>
        </div>
    );
}

export function PendingOrder({order}) {

    // Filter the orders that are pending
    const pendingOrders = order.filter(order => order.status === "pending");
    console.log(pendingOrders);

    // Count the number of pending orders
    const numberOfPendingOrders = pendingOrders.length;

    return (
        <div className="container mx-auto px-4 py-8 ">
            <h2 className="text-2xl font-semibold mb-4 ">Pending Orders</h2>
            <p className="text-lg text-gray-900">Number of Pending Orders: {numberOfPendingOrders}</p>
        </div>
    );
}

export function OutforDelOrder({order}) {


    // Filter the orders that are out for delivery
    const outForDeliveryOrders = order.filter(order => order.status === "outForDelivery");
    console.log(outForDeliveryOrders);

    // Count the number of out for delivery orders
    const numberOfOutForDeliveryOrders = outForDeliveryOrders.length;

    return (
        <div className="container mx-auto px-4 py-8  ">
            <h2 className="text-2xl font-semibold mb-4 ">Out for Delivery Orders</h2>
            <p className="text-lg text-gray-900">Number of Out for Delivery Orders: {numberOfOutForDeliveryOrders}</p>
        </div>
    );
}
