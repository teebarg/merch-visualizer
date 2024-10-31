import { useEffect, useRef } from "react";
import * as d3 from "d3";

type HeatmapProps = {
    data: { company: string; product: string; available: boolean }[];
};

const Heatmap = ({ data }: HeatmapProps) => {
    const svgRef = useRef(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const height = 400;
        const width = 600;

        svg.attr("width", width).attr("height", height);

        // Setup heatmap drawing code here
    }, [data]);

    return <svg ref={svgRef} />;
};

export default Heatmap;
