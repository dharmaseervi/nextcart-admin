'use client'
import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";


export default function LineChart({ order }) {
    const [count, setCount] = useState([]);
    useEffect(() => {
        if (!order || order.length === 0) return; // Skip if order is empty or not yet available

        const orderDates = order.map((order) =>
            new Date(order.createdAt).toLocaleDateString()
        );
        const orderCount = orderDates.reduce((acc, date) => {
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});
        setCount(orderCount)
    }, [order])
    console.log(count);
    const chartRef = useRef(null);


    useEffect(() => {
        const ctx = document.getElementById('myChart').getContext('2d');

        // Destroy existing chart instance if it exists
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        // Create new chart instance
        chartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(count),
                datasets: [{
                    data: Object.values(count),
                    label: "No of Orders",
                    borderColor: "#3e95cd",
                    backgroundColor: "#7bb6dd",
                    fill: false,
                }]
            },
            options: {
                // Your chart options here
            }
        });

        // Clean up function
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [count]);

    return (
        <>
            <div className='rounded-xl w-full h-fit my-auto'>
                <canvas id='myChart'></canvas>
            </div>
        </>
    );
}
