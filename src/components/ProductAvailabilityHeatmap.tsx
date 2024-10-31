import React, { useState, useEffect } from "react";
import { useD3 } from "@/hooks/useD3";
import * as d3 from "d3";
import { Product } from "@/types/supplier";

interface ProductAvailabilityChartProps {
    data: Product[];
}

const ProductAvailabilityHeatmap: React.FC<ProductAvailabilityChartProps> = ({ data }) => {
    const ref = useD3(
        (svg) => {
            const width = 800;
            const height = 600;

            // Group products by company
            const groupedData = d3.group(data, (d) => d.company_id);

            // Extract unique product names
            const productNames = Array.from(new Set(data.map((d) => d.product_name)));

            // Create X and Y scales
            const x = d3.scaleBand().range([0, width]).padding(0.1);
            const y = d3.scaleBand().range([height, 0]).padding(0.1);

            x.domain(productNames);
            y.domain(Array.from(groupedData.keys()).sort((a, b) => a - b));

            // Create color scale
            const color = d3.scaleOrdinal().domain(["Y", "N", "Q"]).range(["#1b9e77", "#d95f02", "#7570b3"]);

            // Create the heatmap
            svg.select(".content")
                .selectAll("rect")
                .data(data, (d) => `${d.company_id}-${d.product_name}`)
                .join("rect")
                .attr("x", (d) => x(d.product_name))
                .attr("width", x.bandwidth())
                .attr("y", (d) => y(d.company_id))
                .attr("height", y.bandwidth())
                .style("fill", (d) => color(d.availability));

            // Add axis labels
            svg.select(".x-axis").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

            svg.select(".y-axis").call(d3.axisLeft(y));
        },
        [data]
    );

    return (
        <div className="w-full h-full">
            <svg ref={ref} className="w-full h-full">
                <g className="content" />
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
        </div>
    );
};

export default ProductAvailabilityHeatmap;
