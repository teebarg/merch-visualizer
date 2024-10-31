// import { useEffect, useRef } from "react";
// import * as d3 from "d3";
// import type { Product } from "@/types/supplier";

// interface ProductAvailabilityChartProps {
//     data: Product[];
// }

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

// interface ProductData {
//     company_id: number;
//     product_name: string;
//     availability: string;
// }

interface Product {
    product_name: string;
    availability: string;
}

interface Data {
    company: string;
    products: Product[];
}

const ProductAvailabilityChart2: React.FC<{ data: Data }> = ({ data }) => {
    console.log(data)
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        // Set up SVG dimensions
        const width = 600;
        const height = 300;
        const svg = d3.select(svgRef.current).attr("width", width).attr("height", height).style("background-color", "#f4f4f4");

        // Define scales
        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d.company))
            .range([0, width])
            .padding(0.2);
        const yScale = d3.scaleBand().domain(["T shirt", "Hoodie", "Vest"]).range([height, 0]).padding(0.2);

        // Set up color mapping for availability
        const colorMap = {
            Y: "#4CAF50", // Green for available
            N: "#F44336", // Red for not available
            Q: "#FFC107", // Yellow for low availability
        };

        // Add groups for each company
        svg.selectAll(".company")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "company")
            .attr("transform", (d) => `translate(${xScale(d.company)}, 0)`)
            .each(function (d) {
                // Draw rectangles for each product
                const group = d3.select(this);
                group
                    .selectAll("rect")
                    .data(d.products)
                    .enter()
                    .append("rect")
                    .attr("x", 0)
                    .attr("y", (p) => yScale(p.product_name))
                    .attr("width", xScale.bandwidth())
                    .attr("height", yScale.bandwidth())
                    .attr("fill", (p) => colorMap[p.availability] || "#ccc"); // Default to gray if unknown
            });

        // Add axes
        const xAxis = d3.axisBottom(xScale);
        svg.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);

        const yAxis = d3.axisLeft(yScale);
        svg.append("g").call(yAxis);
    }, [data]);

    return <svg ref={svgRef} />;
};

export default ProductAvailabilityChart2;
