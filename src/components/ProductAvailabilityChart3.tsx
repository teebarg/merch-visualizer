import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface Product {
    product_name: string;
    availability: "Y" | "N" | "Q";
}

interface Company {
    company: string;
    products: Product[];
}

interface ProductMatrixProps {
    data: Company[];
}

export function ProductAvailabilityChart3({ data }: ProductMatrixProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        // Clear previous content
        d3.select(svgRef.current).selectAll("*").remove();

        // Setup dimensions
        const margin = { top: 10, right: 40, bottom: 40, left: 200 };
        const width = 800 - margin.left - margin.right;
        const height = 800 - margin.top - margin.bottom;

        // Create SVG
        const svg = d3
            .select(svgRef.current)
            .attr("width", width + margin.left + margin.right + 100)
            .attr("height", height + margin.top + margin.bottom + 100)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Get unique product names
        const productNames = Array.from(new Set(data.flatMap((d) => d.products.map((p) => p.product_name))));

        // Create scales
        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d.company))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleBand().domain(productNames).range([0, height]).padding(0.1);
        // const yScale = d3.scaleBand().domain(productNames).range([0, height]).padding(0.1);
        // const yScale = d3.scaleLinear().domain(productNames).nice().range([height, 0]);

        // Add X axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .attr("beaf", "1234")
            .attr("font-size", "15")
            .style("text-anchor", "end");

        // Add Y axis
        svg.append("g").call(d3.axisLeft(yScale)).selectAll("text").attr("font-size", "15");

        // Add cells
        data.forEach((company) => {
            company.products.forEach((product) => {
                const color = product.availability === "Y" ? "#22c55e" : product.availability === "N" ? "#ef4444" : "#94a3b8";

                // Add rectangle
                svg.append("rect")
                    .attr("x", xScale(company.company))
                    .attr("y", yScale(product.product_name))
                    .attr("width", xScale.bandwidth())
                    .attr("height", yScale.bandwidth())
                    .attr("fill", color)
                    .attr("opacity", product.availability === "Q" ? 0.5 : 0.8)
                    .attr("rx", 4)
                    .attr("ry", 4);

                // Add text
                // svg.append("text")
                //     .attr("x", xScale(company.company)! + xScale.bandwidth() / 2)
                //     .attr("y", yScale(product.product_name)! + yScale.bandwidth() / 2)
                //     .attr("text-anchor", "middle")
                //     .attr("dominant-baseline", "middle")
                //     .attr("fill", "white")
                //     .attr("font-weight", "bold")
                //     .text(product.availability);
            });
        });

        // Add legend
        const legend = svg
            .append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 15)
            .attr("text-anchor", "start")
            .attr("transform", `translate(${width + 10}, 0)`);

        const legendItems = [
            { label: "Yes", color: "#22c55e", value: "Y" },
            { label: "No", color: "#ef4444", value: "N" },
            { label: "Unclear", color: "#94a3b8", value: "Q" },
        ];

        legendItems.forEach((item, i) => {
            const legendRow = legend.append("g").attr("transform", `translate(0, ${i * 25})`);

            legendRow
                .append("rect")
                .attr("width", 20)
                .attr("height", 20)
                .attr("fill", item.color)
                .attr("opacity", item.value === "Q" ? 0.5 : 0.8)
                .attr("rx", 2)
                .attr("ry", 2);

            legendRow.append("text").attr("x", 24).attr("y", 9.5).attr("dy", "0.32em").attr("font-weight", "bold").text(item.label);
        });
    }, [data]);

    return (
        <div>
            <div className="overflow-x-auto">
                <svg ref={svgRef} className="mx-auto" style={{ minWidth: "800px" }} />
            </div>
        </div>
    );
}
