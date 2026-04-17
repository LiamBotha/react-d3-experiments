import * as d3 from "d3";
import {useEffect, useRef} from "react";

const colors = new Map([
    ["LP/EP", "#2A5784"],
    ["Vinyl Single", "#43719F"],
    ["8 - Track", "#5B8DB8"],
    ["Cassette", "#7AAAD0"],
    ["Cassette Single", "#9BC7E4"],
    ["Other Tapes", "#BADDF1"],
    ["Kiosk", "#E1575A"],
    ["CD", "#EE7423"],
    ["CD Single", "#F59D3D"],
    ["SACD", "#FFC686"],
    ["DVD Audio", "#9D7760"],
    ["Music Video (Physical)", "#F1CF63"],
    ["Download Album", "#7C4D79"],
    ["Download Single", "#9B6A97"],
    ["Ringtones & Ringbacks", "#BE89AC"],
    ["Download Music Video", "#D5A5C4"],
    ["Other Digital", "#EFC9E6"],
    ["Synchronization", "#BBB1AC"],
    ["Paid Subscription", "#24693D"],
    ["On-Demand Streaming (Ad-Supported)", "#398949"],
    ["Other Ad-Supported Streaming", "#61AA57"],
    ["SoundExchange Distributions", "#7DC470"],
    ["Limited Tier Paid Subscription", "#B4E0A7"]
])

export default function BarChart({dataset, width=500, height=500}) {
    const ref = useRef(null);
    const seriesRef = useRef(null);
    const xRef = useRef(null);
    const yRef = useRef(null);

    const margin = 20;

    useEffect(() => {
        const series = d3.stack()
            .keys(colors.keys())
            .value((group, key) => group.get(key).value)
            .order(d3.stackOrderReverse)
            (d3.rollup(dataset, ([d]) => d, d => d.year, d=>d.name).values())
            .map(s => (s.forEach(d => d.data = d.data.get(s.key)), s));

        const x = d3.scaleBand()
            .domain(dataset.map(d => d.year))
            .range([margin, width - margin]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(series, d=>d3.max(d, d=>d[1]))]).nice()
            .range([height - margin, margin]);

        const color = d3.scaleOrdinal()
            .domain(colors.keys())
            .range(colors.values());

        const formatRevenue = x => (+(x / 1e9).toFixed(2) >= 1)
            ? `${(x / 1e9).toFixed(2)}B`
            : `${(x / 1e6).toFixed(0)}M`;

        // container
        const svg = d3.select(ref.current);
        d3.select(seriesRef.current)
            .selectAll("g")
            .data(series)
            .join("g")
                .attr("fill", ({key}) => color(key))
                .call(g => g.selectAll("rect")
                    .data(d => d)
                    .join("rect")
                        .attr("x", d => x(d.data.year))
                        .attr("y", d=>y(d[1]))
                        .attr("width", x.bandwidth() - 1)
                        .attr("height", d => y(d[0]) - y(d[1]))
                    .append("title")
                        .text(d => `${d.data.name}, ${d.data.year} ${formatRevenue(d.data.value)}`));

        // x axis with tick tweaked to be better spaced
        d3.select(xRef.current)
            .call(d3.axisBottom(x)
                .tickValues(d3.ticks(...d3.extent(x.domain()), width / 80))
                .tickSizeOuter(0));

        // y axis
        d3.select(yRef.current)
            .call(d3.axisLeft(y).tickFormat(x => (x / 1e9).toFixed(0)))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("Revenue (Billions, adj.)"));

    }, [dataset, width, height]);

    return <svg ref={ref} width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ maxWidth: '100%', height: 'auto' }}>
        <g ref={seriesRef}></g>
        <g id='x-axis' ref={xRef} transform={`translate(0,${height - margin})`} />
        <g id='y-axis' ref={yRef} transform={`translate(${margin}, 0)`} />
    </svg>
}