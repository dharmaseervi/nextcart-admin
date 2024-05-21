
'use client'
import { useContext, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { GlobalContext } from "@/components/GlobalContext";

export default function OrderPlacedChart({order}) {
  
    const chartRef = useRef(null);
    let orderPlacedChart = null; // Reference to the chart instance

    useEffect(() => {
        // Calculate the total amount for each order
        const orderAmounts = order.map(order => order.amount);
        // Get unique order IDs
        const orderIDs = order.map(order => order._id);

        // Destroy existing chart instance if it exists
        if (orderPlacedChart) {
            orderPlacedChart.destroy();
        }

        // Render the horizontal bar chart
        const ctx = chartRef.current.getContext("2d");
        orderPlacedChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: orderIDs,
                datasets: [{
                    label: "Amount",
                    data: orderAmounts,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(201, 203, 207, 0.2)'
                      ],
                    hoverBackgroundColor: "#3B82F6",
                    borderWidth: 0,
                }],
            },
            options: {
                scales: {
                    x: {
                        beginAtZero: true,
                    },
                },
                plugins: {
                    tooltip: {
                        backgroundColor: "#4B5563",
                        titleColor: "#0000",
                        bodyColor: "#D1D5DB",
                        mode: "index",
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return `Amount: $${context.parsed.y}`;
                            },
                        },
                    },
                },
            },
        });

        // Clean up function
        return () => {
            if (orderPlacedChart) {
                orderPlacedChart.destroy();
            }
        };
    }, [order]);

    return (
        <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Orders Placed Chart</h2>
            <div className="overflow-hidden rounded-lg">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
}
