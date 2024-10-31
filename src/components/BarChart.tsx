import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Company } from "@/types/supplier";

type BarChartProps = {
    data: Company[];
};

const BarChart = ({ data }: BarChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const height = 400;
        const width = 600;

        svg.attr("width", width).attr("height", height).style("overflow", "visible");

        const x = d3
            .scaleBand()
            .domain(data.map((d) => d.name))
            .range([0, width])
            .padding(0.2);

        const y = d3.scaleLinear().domain([0, 5]).range([height, 0]);

        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d: Company) => x(d.name)!)
            .attr("y", (d: Company) => y(d.ethics_rating))
            .attr("width", x.bandwidth())
            .attr("height", (d: Company) => height - y(d.ethics_rating))
            .attr("fill", "blue");
    }, [data]);

    return <svg ref={svgRef} />;
};

export default BarChart;
