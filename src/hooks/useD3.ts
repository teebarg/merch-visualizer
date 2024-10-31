import { useRef, useEffect } from "react";
import * as d3 from "d3";

export const useD3 = (renderChart, dependencies) => {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current);
        renderChart(svg);
    }, dependencies);

    return ref;
};
