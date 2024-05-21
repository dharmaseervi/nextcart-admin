"use client";
import Layout from "@/app/admin/Layout";
import { GlobalContext } from "@/components/GlobalContext";
import Link from "next/link";
import { useEffect, useState, useContext } from "react";

export default function Order() {

  const [error, setError] = useState(null);
  const { orderCounts, setOrderPlaced, orderPlaced } = useContext(GlobalContext)
  console.log(orderCounts);

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
        setOrderPlaced(data.orderItems);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchOrder();
  }, []);
  console.log(orderPlaced);



  return (
    <Layout>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <div className='grid  gap-2 overflow-auto h-screen mb-2'>
          {orderPlaced?.map((order, index) => (
            <Link href={'/orderOverview/' + order._id} key={index} className="border bg-white p-2 mb-2 rounded shadow-md">
              <p className="text-red-500">userId:{order.user}</p>
              <p className="text-green-500">orderId:{order._id}</p>
              <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
              <p>Amount: {order.amount}</p>
              <div className='flex flex-wrap gap-2'>
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="border bg-slate-200  ">
                    <img
                      className="w-20 h-20 rounded"
                      src={item?.product?.photo?.[0]}
                      alt={item?.product?.productname}
                    />
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
}
