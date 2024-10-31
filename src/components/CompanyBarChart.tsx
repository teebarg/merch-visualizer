import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Company } from "@/types/supplier";

type BarChartProps = {
    data: Company[];
};

const CompanyBarChart = ({ data }: BarChartProps) => {
    const svgRef = useRef();

    useEffect(() => {
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const width = 800 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3
            .select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        // Clear previous content
        svg.selectAll("*").remove();

        const chartGroup = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        // X scale for rating categories
        const x0 = d3
            .scaleBand()
            .domain(data.map((d) => d.name))
            .range([0, width])
            .padding(0.2);

        // X1 scale for individual ratings within each group
        const x1 = d3.scaleBand().domain(["ethics_rating", "price_rating", "quality_rating"]).range([0, x0.bandwidth()]).padding(0.05);

        // Y scale for rating values
        const y = d3.scaleLinear().domain([0, 5]).nice().range([height, 0]);

        // Color scale for each rating type
        const color = d3.scaleOrdinal().domain(["ethics_rating", "price_rating", "quality_rating"]).range(["#6b486b", "#ff8c00", "#8a89a6"]);

        // Add X axis
        chartGroup.append("g").attr("class", "x-axis").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(x0));

        // Add Y axis
        chartGroup.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

        // Draw the bars
        chartGroup
            .selectAll("g.layer")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "layer")
            .attr("transform", (d) => `translate(${x0(d.name)}, 0)`)
            .selectAll("rect")
            .data((d) => [
                { key: "ethics_rating", value: d.ethics_rating },
                { key: "price_rating", value: d.price_rating },
                { key: "quality_rating", value: d.quality_rating },
            ])
            .enter()
            .append("rect")
            .attr("x", (d) => x1(d.key))
            .attr("y", (d) => y(d.value))
            .attr("width", x1.bandwidth())
            .attr("height", (d) => height - y(d.value))
            .attr("fill", (d) => color(d.key));

        // Add legend
        const legend = chartGroup
            .selectAll(".legend")
            .data(color.domain())
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        legend
            .append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend
            .append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text((d) => d.replace("_", " ").toUpperCase());
    }, [data]);

    return <svg ref={svgRef}></svg>;
};

export default CompanyBarChart;
