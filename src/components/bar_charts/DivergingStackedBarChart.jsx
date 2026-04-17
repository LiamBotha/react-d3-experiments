import * as d3 from 'd3';
import {useEffect, useRef} from "react";

export default function DivergingStackedBarChart ({dataset, width=500, height=500}) {
    const svgRef= useRef(null);
    const xRef= useRef(null);
    const yRef= useRef(null);
    const barRef= useRef(null);
    const margin = 40;

    useEffect(() => {

        let data = Object.assign(dataset, {
            negative: "← Negative",
            positive: "Positive →",
            negatives: ["Strongly Disagree", "Disagree", "Mostly Disagree"],
            positives: ["Mostly Agree", "Agree", "Strongly Agree"],
        })

        // assign a valence to each category
        const signs = new Map([].concat(
            data.negatives.map(d => [d, -1]),
            data.positives.map(d => [d, +1]),
        ));

        // compute bias - sum of negative values
        const bias = d3.sort(
            d3.rollup(data, v => d3.sum(v, d => d.value * Math.min(0, signs.get(d.category))), d => d.name),
            ([, a]) => a,
        );

        // values are stacked from the inside out, starting with moderate values and ending with extremes
        const series = d3.stack()
            .keys([].concat(data.negatives.slice().reverse(), data.positives))
            .value(([,value], category) => signs.get(category) * (value.get(category) || 0))
            .offset(d3.stackOffsetDiverging)
            (d3.rollup(data, data => d3.rollup(data, ([d]) => d.value, d=> d.category), d=>d.name));

        // x scale
        const x = d3.scaleLinear()
            .domain(d3.extent(series.flat(2)))
            .rangeRound([margin, width - margin]);

        const y = d3.scaleBand()
            .domain(bias.map(([name]) => name))
            .rangeRound([margin, height - margin])
            .padding(2 / 33);

        const color = d3.scaleOrdinal()
            .domain([].concat(data.negatives, data.positives))
            .range(d3.schemeSpectral[data.negatives.length + data.positives.length])

        // formats a percentage, used on the axis and in tooltips
        const formatValue = ((format) => (x) => format(Math.abs(x)))(d3.format(".0%"));

        // container
        const svg = d3.select(svgRef.current);
        const xAxis = d3.select(xRef.current);
        const yAxis = d3.select(yRef.current);
        const barContainer = d3.select(barRef.current);

        // append rect for each value with tooltip
        barContainer.selectAll("g")
            .data(series)
            .join("g")
                .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(d => d.map(v => Object.assign(v, {key: d.key})))
            .join("rect")
                .attr("x", d=> x(d[0]))
                .attr("y", ({data: [name]}) => y(name))
                .attr("width", d => x(d[1]) - x(d[0]))
                .attr("height", y.bandwidth())
            .append("title")
                .text(({key, data: [_name, value]}) => `${formatValue(value.get(key))} ${key}`);

        // x axis
        xAxis.call(d3.axisTop(x)
                .ticks(width / 80)
                .tickFormat(formatValue)
                .tickSizeOuter(0))
            .call(g => g.select(".domain").remove())

        yAxis.call(d3.axisLeft(y).tickSizeOuter(0))
            .call(g => g.selectAll(".tick")
                .data(bias)
                .attr("transform", ([name, min]) => `translate(${x(min)},${y(name) + y.bandwidth() / 2})`))
            .call(g => g.select(".domain")
                .attr("transform", `translate(${x(0)}, 0)`))

    }, [dataset, width, height]);

    return <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{
        border:"1px solid black",
        maxWidth: "100%",
        height: "auto",
        font: "10px sans-serif"
    }}>
        <g ref={barRef}></g>
        <g id='x-axis' ref={xRef} transform={`translate(0, ${margin})`} />
        <g id='y-axis' ref={yRef} />
    </svg>
}