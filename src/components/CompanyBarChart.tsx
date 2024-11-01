import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Company } from "@/types";

type BarChartProps = {
    data: Company[];
};

const CompanyBarChart = ({ data }: BarChartProps) => {
    const chartRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        // Clear previous chart
        d3.select(chartRef.current).selectAll("*").remove();

        // Set up dimensions
        const margin = { top: 0, right: 120, bottom: 60, left: 60 };
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
            .domain(data.map((d: Company) => d.name))
            .padding(0.2);

        const y = d3.scaleLinear().range([height, 0]).domain([0, 5]);

        // Add axes
        // x-axis
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .attr("class", "text-foreground")
            .selectAll("text")
            .attr("transform", "rotate(-25)")
            .style("text-anchor", "end")
            .attr("class", "text-sm font-medium");

        // y-axis
        svg.append("g").call(d3.axisLeft(y)).attr("class", "text-sm font-medium text-foreground");

        // Add grid lines
        svg.append("g")
            .attr("class", "grid")
            .call(
                d3
                    .axisLeft(y)
                    .tickSize(-width)
                    .tickFormat(() => "")
            )
            .style("stroke-dasharray", "3,3")
            .style("stroke-opacity", 0.2);

        // Define metrics and their colors
        const metrics = [
            { key: "ethics_rating", label: "Ethics", color: "hsl(var(--chart-1))" },
            { key: "price_rating", label: "Price", color: "hsl(var(--chart-2))" },
            { key: "quality_rating", label: "Quality", color: "hsl(var(--chart-3))" },
        ];

        // Add bars for each metric
        metrics.forEach((metric, i: number) => {
            const barWidth = x.bandwidth() / metrics.length;

            // Add bars
            svg.selectAll(`.bar-${metric.key}`)
                .data(data)
                .join("rect")
                .attr("class", `bar-${metric.key}`)
                .attr("x", (d: Company) => x(d.name)! + i * barWidth)
                .attr("width", barWidth)
                .attr("y", (d: Company) => {
                    const value = d[metric.key as keyof Company];
                    return value === "Q" ? y(0) : y(Number(value));
                })
                .attr("height", (d: Company) => {
                    const value = d[metric.key as keyof Company];
                    return value === "Q" ? 0 : height - y(Number(value));
                })
                .attr("fill", metric.color)
                .attr("rx", 4)
                .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))")
                .style("transition", "all 0.3s ease");

            // Add 'Q' markers for unknown values
            svg.selectAll(`.q-${metric.key}`)
                .data(data.filter((d) => d[metric.key as keyof Company] === "Q"))
                .join("text")
                .attr("class", `q-${metric.key}`)
                .attr("x", (d: Company) => x(d.name)! + i * barWidth + barWidth / 2)
                .attr("y", height / 2)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("fill", metric.color)
                .attr("font-size", "16px")
                .attr("font-weight", "bold")
                .text("Q");
        });

        // Add legend
        const legend = svg
            .append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 15)
            .attr("text-anchor", "start")
            .selectAll("g")
            .data(metrics)
            .join("g")
            .attr("transform", (_: any, i: number) => `translate(${width + 10},${i * 25})`);

        legend
            .append("rect")
            .attr("x", 0)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", (d: any) => d.color)
            .attr("rx", 2);

        legend
            .append("text")
            .attr("x", 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .attr("font-weight", "bold")
            .text((d: any) => d.label);

    }, [data]);

    return (
        <div className="p-6">
            <div className="overflow-x-auto">
                <svg ref={chartRef} className="w-full max-w-4xl mx-auto" style={{ minWidth: "600px" }} />
            </div>
            <div className="mt-4 text-sm text-muted-foreground text-center">
                <p>Q indicates Question</p>
            </div>
        </div>
    );
};

export default CompanyBarChart;
