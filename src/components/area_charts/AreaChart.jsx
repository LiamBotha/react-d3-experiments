import * as d3 from 'd3';
import {useEffect, useRef} from "react";
import {select} from "d3";

const AreaChart = ({dataset, width=500, height=500}) => {
    const ref = useRef(null);
    const pathRef = useRef(null);

    const margin = 25;

    // Declare the x (horizontal position) scale.
    const x = d3.scaleUtc()
        .domain(d3.extent(dataset, (d) =>
            new Date(d.date)
        ))
        .range([margin, width - margin]);

    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear([0, d3.max(dataset, d => d.close)], [height - margin, margin]);

    // Declare the area generator.
    const area = d3.area()
        .x((d) => x(new Date(d.date)))
        .y0(y(0))
        .y1((d) => y(d.close));

    useEffect(() => {
        // Container
        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        // path for the area (under the axes).
        select(pathRef.current)
            .attr("d", area(dataset));

        // Add the x-axis.
        svg.select("#x-axis")
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        // Add the y-axis, remove the domain line, add grid lines and a label.
        svg.select("#y-axis")
            .call(d3.axisLeft(y).ticks(height / 40))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").clone()
                .attr("x2", width - margin * 2)
                .attr("stroke-opacity", 0.1))
            .call(g => g.select("text")
                .attr("x", -margin)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("↑ Daily close ($)"));

    }, [dataset, width, height]);

    return <svg ref={ref} style={{ display: "inline-block" }}>
        <path ref={pathRef} id='path' fill='steelblue'></path>
        <g id='x-axis' transform={`translate(0,${height - margin})`}></g>
        <g id='y-axis' transform={`translate(${margin},0)`}>
            <text />
        </g>
    </svg>
}

export default AreaChart;