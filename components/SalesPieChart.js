'use client'
import { GlobalContext } from "@/components/GlobalContext";
import { useContext, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function SalesPieChart({order}) {
    const chartRef = useRef(null);
    let salesChart = null; // Reference to the chart instance

    useEffect(() => {
        // Calculate total sales amount for each order
        const salesAmounts = order.map(order => order.amount);

        // Aggregate the total sales amount
        const totalSalesAmount = salesAmounts.reduce((acc, amount) => acc + amount, 0);

        // Destroy existing chart instance if it exists
        if (salesChart) {
            salesChart.destroy();
        }

        // Render the pie chart
        const ctx = chartRef.current.getContext("2d");
        salesChart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["Total Sales"],
                datasets: [{
                    data: [totalSalesAmount],
                    backgroundColor: ["#FF6384"],
                }],
            },
        });

        // Clean up function
        return () => {
            if (salesChart) {
                salesChart.destroy();
            }
        };
    }, [order]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-4">Sales Pie Chart</h2>
            <canvas ref={chartRef}></canvas>
        </div>
    );
}
