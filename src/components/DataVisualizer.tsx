import React, { useEffect } from "react";
import * as d3 from "d3";
import { supabase } from "../supabaseClient";
// import { supabase } from "../lib/supabase";

const DataVisualizer: React.FC = () => {
    useEffect(() => {
        fetchAndVisualizeData();
    }, []);

    const fetchAndVisualizeData = async () => {
        const { data: companies } = await supabase.from("companies").select("*");
        const { data: products } = await supabase.from("products").select("*");
        drawCharts(companies, products);
    };

    const drawCharts = (companies?: any[], products?: any[]) => {
        const svg = d3.select("#chart").append("svg").attr("width", 600).attr("height", 400);

        // Example bar chart for ethics scores
        svg.selectAll("rect")
            .data(companies)
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * 40)
            .attr("y", (d) => 400 - d.ethics * 20)
            .attr("width", 30)
            .attr("height", (d) => d.ethics * 20)
            .attr("fill", "teal");
    };

    return <div id="chart"></div>;
};

export default DataVisualizer;
