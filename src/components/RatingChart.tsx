import { useEffect, useRef } from "react";
import * as d3 from "d3";
// import { Supplier } from "../types/supplier";
// import type { Supplier } from "@/types/supplier";

interface RatingChartProps {
    data: Supplier[];
}

export function RatingChart({ data }: RatingChartProps) {
    const chartRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        // Clear previous chart
        d3.select(chartRef.current).selectAll("*").remove();

        // Set up dimensions
        const margin = { top: 20, right: 100, bottom: 60, left: 40 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Create SVG
        const svg = d3
            .select(chartRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create scales
        const x = d3
            .scaleBand()
            .range([0, width])
            .domain(data.map((d) => d.name))
            .padding(0.1);

        const y = d3.scaleLinear().range([height, 0]).domain([0, 5]);

        // Add axes
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g").call(d3.axisLeft(y));

        // Add bars for each metric
        const metrics = ["ethics", "price", "quality"] as const;
        const colors = ["#2563eb", "#16a34a", "#dc2626"];
        const labels = ["Ethics", "Price", "Quality"];

        metrics.forEach((metric, i) => {
            svg.selectAll(`.bar-${metric}`)
                .data(data)
                .enter()
                .append("rect")
                .attr("class", `bar-${metric}`)
                .attr("x", (d) => x(d.name)! + (i * x.bandwidth()) / 3)
                .attr("width", x.bandwidth() / 3)
                .attr("y", (d) => {
                    const value = d[metric];
                    return typeof value === "number" ? y(value) : y(0);
                })
                .attr("height", (d) => {
                    const value = d[metric];
                    return typeof value === "number" ? height - y(value) : 0;
                })
                .attr("fill", colors[i])
                .attr("opacity", (d) => (d[metric] === "Q" ? 0.3 : 1));

            // Add 'Q' text for unknown values
            svg.selectAll(`.text-${metric}`)
                .data(data)
                .enter()
                .append("text")
                .attr("class", `text-${metric}`)
                .attr("x", (d) => x(d.name)! + (i * x.bandwidth()) / 3 + x.bandwidth() / 6)
                .attr("y", (d) => y(2.5))
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .text((d) => (d[metric] === "Q" ? "Q" : ""))
                .attr("fill", colors[i]);
        });

        // Add legend
        const legend = svg
            .append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "start")
            .selectAll("g")
            .data(labels)
            .enter()
            .append("g")
            .attr("transform", (d, i) => `translate(${width + 10},${i * 20})`);

        legend
            .append("rect")
            .attr("x", 0)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", (d, i) => colors[i]);

        legend
            .append("text")
            .attr("x", 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text((d) => d);
    }, [data]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Supplier Ratings</h2>
            <div className="overflow-x-auto">
                <svg ref={chartRef} className="mx-auto" />
            </div>
        </div>
    );
}
