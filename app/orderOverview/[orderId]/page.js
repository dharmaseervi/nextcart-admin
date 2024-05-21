"use client";
import Layout from "@/app/admin/Layout";
import React, { useState, useEffect } from "react";

export default function OrderPage({ params }) {
  const { orderId } = params;

  const [orderPlaced, setOrderPlaced] = useState([]);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState("orderPlaced");
  const steps = [
    { status: "orderPlaced", label: "Order Placed", subLabel: 'Your order has been placed successfully.', icon: < CheckIcon className="h-5 w-5" /> },
    { status: "shipped", label: "Shipped", subLabel: 'Your order has been shipped.', icon: <TruckIcon className="h-5 w-5" /> },
    { status: "outForDelivery", label: "Out for Delivery", subLabel: 'Your order is being processed', icon: <BoxIcon className="h-5 w-5" /> },
    { status: "delivered", label: "Delivered", subLabel: 'Your order has been delivered', icon: <PackageIcon className="h-5 w-5" /> },
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/adminorder?orderid=${orderId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch order data");
        }

        const data = await response.json();
        setOrderPlaced(data.orderItems);
        setOrderStatus(data.orderItems[0].status)
        console.log(data.orderItems[0].status, 'order');
      } catch (error) {
        setError(error.message);
      }
    };
    fetchOrder();
  }, []);
  console.log(orderPlaced);

  const handleNextStep = async () => {
    try {
      const currentStepIndex = steps.findIndex(
        (step) => step.status === orderStatus
      );
      if (currentStepIndex < steps.length - 1) {
        setOrderStatus(steps[currentStepIndex + 1].status);
      }
      const response = await fetch("http://localhost:3000/api/adminorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          orderStatus: steps[currentStepIndex + 1].status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      console.log("after update", orderPlaced);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <Layout>
        <h1 className="text-2xl font-semibold mb-4">Order Progress</h1>

        <div className="flex flex-col gap-6 p-4 sm:p-6 bg-white rounded-md mb-5">
          <div className="flex items-center gap-2">
            <div className="h-3 flex-1 rounded-full bg-gray-200 dark:bg-gray-800">
              <div className={`h-full rounded-full bg-green-600 dark:bg-primary-500`} style={{ width: `${((steps.findIndex((s) => s.status === orderStatus) + 1) / steps.length) * 100}%` }} />
            </div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Step {steps.findIndex((s) => s.status === orderStatus) + 1} of {steps.length}</span>
          </div>

          <div className="grid gap-4">
            {steps.map((step, index) => (
              <div className="flex items-center gap-4" key={step.status}>
                <div className={`flex h-10 w-10 items-center justify-center rounded-full  text-primary dark:bg-primary-500/20 dark:text-primary-500 ${index <= steps.findIndex((s) => s.status === orderStatus) ? 'bg-green-600' : 'bg-gray-200'}`}>
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-base font-medium">{step.label}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{step.subLabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {orderPlaced?.map((order, index) => (
          <div
            key={index}
            className="border mb-6 rounded-lg overflow-hidden shadow-md"
          >
            <div className="p-4 bg-gray-50 border-b">
              <p className="text-gray-900">Order ID: {order._id}</p>
              <p className="text-gray-900">User ID: {order.user}</p>
              <p className="text-gray-900">
                Created At: {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-white">
              {order.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center mb-4">
                  <img
                    className="w-16 h-16 mr-4 rounded"
                    src={item?.product?.photo?.[0]}
                    alt={item?.product?.productname}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {item?.product?.productname}
                    </h3>
                    <p className="">Quantity: {item?.quantity}</p>
                    <p className="">Price: {item?.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {steps.findIndex((step) => step.status === orderStatus) <
          steps.length - 1 && (
            <div className="flex justify-end">
              <button
                onClick={handleNextStep}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg"
              >
                Next Step
              </button>
            </div>
          )}

        {error && <p className="text-red-500">{error}</p>}
      </Layout>
    </div>
  );
}

function BoxIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}


function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}


function PackageIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}


function TruckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
      <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
      <circle cx="7" cy="18" r="2" />
      <path d="M15 18H9" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  )
}