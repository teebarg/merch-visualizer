import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { Product } from "@/types/supplier";

interface ProductAvailabilityChartProps {
    data: Product[];
}

export function ProductAvailabilityChart({ data }: ProductAvailabilityChartProps) {
    const chartRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        // Clear previous chart
        d3.select(chartRef.current).selectAll("*").remove();

        // Set up dimensions
        const margin = { top: 20, right: 100, bottom: 100, left: 150 };
        const width = 800 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        // Create SVG
        const svg = d3
            .select(chartRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Get all product types
        const productTypes = Object.keys(data[0].products);

        // Create scales
        const x = d3
            .scaleBand()
            .range([0, width])
            .domain(data.map((d) => d.name))
            .padding(0.1);

        const y = d3.scaleBand().range([height, 0]).domain(productTypes).padding(0.1);

        // Add axes
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g").call(d3.axisLeft(y));

        // Add cells
        data.forEach((supplier) => {
            productTypes.forEach((product) => {
                const availability = supplier.products[product as keyof typeof supplier.products];
                const color = availability === "Y" ? "#16a34a" : availability === "N" ? "#dc2626" : "#94a3b8";

                svg.append("rect")
                    .attr("x", x(supplier.name))
                    .attr("y", y(product))
                    .attr("width", x.bandwidth())
                    .attr("height", y.bandwidth())
                    .attr("fill", color)
                    .attr("opacity", availability === "Q" ? 0.3 : 0.8);

                svg.append("text")
                    .attr("x", x(supplier.name)! + x.bandwidth() / 2)
                    .attr("y", y(product)! + y.bandwidth() / 2)
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "middle")
                    .attr("fill", "white")
                    .text(availability);
            });
        });
    }, [data]);

    return (
        <div className="p-6 mt-6">
            <h2 className="text-2xl font-bold mb-6">Product Availability Matrix</h2>
            <div className="overflow-x-auto">
                <svg ref={chartRef} className="mx-auto" />
            </div>
        </div>
    );
}
