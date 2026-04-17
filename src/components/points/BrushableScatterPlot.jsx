import {useEffect, useRef} from "react";
import * as d3 from "d3";

const BrushableScatterPlot = ({dataset, width = 500, height = 500}) => {
    const ref = useRef(null);
    const xRef = useRef(null);
    const yRef = useRef(null);
    const dotsRef = useRef(null);

    const margin = 30;

    useEffect(() => {

        const x = d3.scaleLinear()
            .domain([0, d3.max(dataset, d=> d["Miles_per_Gallon"])]).nice()
            .range([margin, width - margin])
            .unknown(margin);

        const y = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d['Horsepower'])]).nice()
            .range([height - margin, margin])
            .unknown(height - margin);

        // container
        const svg = d3.select(ref.current)
            .property("value", []);

        // X axis
        const xAxis = d3.select(xRef.current)
            .call(d3.axisBottom(x))
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("x", width - margin)
                .attr("y", -4)
                .attr("fill", "#000")
                .attr("font-weight", "bold")
                .attr("text-anchor", "end")
                .text("Miles per Gallon"));

        // Y axis
        const yAxis = d3.select(yRef.current)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 4)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("Horsepower"));

        // Scatter plot Data Dots
        const dot = d3.select(dotsRef.current)
            .selectAll("circle")
            .data(dataset)
            .join("circle")
                .attr("transform", d => `translate(${x(d["Miles_per_Gallon"])}, ${y(d["Horsepower"])})`)
                .attr("r", 3); // dot size

        // Brush Behaviour
        svg.call(d3.brush().on("start brush end", ({selection}) => {
            let value = [];
            if(selection) {
                const [[x0, y0], [x1, y1]] = selection;
                value = dot
                    .style("stroke", "gray")
                    .filter(d => x0 <= x(d["Miles_per_Gallon"]) && x(d["Miles_per_Gallon"]) < x1
                        && y0 <= y(d["Horsepower"]) && y(d["Horsepower"]) < y1)
                    .style("stroke", "steelblue")
                    .data();
            }
            else {
                dot.style("stroke", "steelblue");
            }
            svg.property("value", value).dispatch("input");
        }));

    }, [dataset, width, height]);

    return <svg ref={ref} width={width} height={height} style={{ border: "1px solid black", display: "inline-block" }}>
        <g id="x-axis" ref={xRef} transform={`translate(0, ${height - margin})`}></g>
        <g id="y-axis" ref={yRef} transform={`translate(${margin}, 0)`}></g>
        <g id='dots' ref={dotsRef} fill="none" stroke="steelblue" strokeWidth="1.5"></g>
    </svg>
}

export default BrushableScatterPlot;