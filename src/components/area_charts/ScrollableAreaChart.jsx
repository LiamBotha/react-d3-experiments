import {useEffect, useRef} from "react";
import {axisBottom, axisLeft, curveStep, utcMonth, area, scaleLinear, scaleUtc, max, extent, select} from "d3";


const ScrollableAreaChart = ({dataset, width = 500, height = 500, color}) => {
    const svgRef = useRef(null);
    const divRef = useRef(null);
    const pathRef = useRef(null);

    const marginTop = 20;
    const marginRight = 20;
    const marginBottom = 35;
    const marginLeft = 35;

    // Specify the chart dimensions and margins. The width is determined by Observable’s stdlib,
    // making it reactive when the window is resized. The total width of the chart is computed
    // as 6 times the window width.
    const totalWidth = width * 6;

    useEffect(() => {
        // Create the horizontal (x) scale over the total width.
        const x = scaleUtc()
            .domain(extent(dataset, d => new Date(d.date)))
            .range([marginLeft, totalWidth - marginRight]);

        // Create the vertical (x) scale.
        const y = scaleLinear()
            .domain([0, max(dataset, d => d.close)]).nice(6)
            .range([height - marginBottom, marginTop]);

        // Define an area shape generator.
        const getArea = area()
            .curve(curveStep)
            .x(d => x(new Date(d.date)))
            .y0(y(0))
            .y1(d => y(d.close));

        // Create a div that holds two svg elements: one for the main chart and horizontal axis,
        // which moves as the user scrolls the content; the other for the vertical axis (which
        // doesn’t scroll).

        // Create the svg with the vertical axis.
        select(svgRef.current)
            .select("g")
            .call(axisLeft(y).ticks(6))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("$ Close"));

        // Create a scrolling div containing the area shape and the horizontal axis.
        const body = select(divRef.current)
        const svg = body.select("svg")

        svg.select("g")
            .call(axisBottom(x).ticks(utcMonth.every(1200 / width)).tickSizeOuter(0));

        select(pathRef.current)
            .datum(dataset)
            .attr("d", getArea);

        // scroll to the end
        body.node().scrollBy(totalWidth, 0);

    }, [dataset, totalWidth, width, height]);

    return <div style={{display:"inline-block"}}>
        <svg id='y-axis' ref={svgRef} width={width} height={height} style={{ position: "absolute", pointerEvents: "none", zIndex: 1, }}>
           <g transform={`translate(${marginLeft},0)`} ></g>
        </svg>
        <div id='body' ref={divRef} style={{ overflowX: 'scroll', WebkitOverflowScrolling: 'touch', width: width + 'px' }}>
            <svg width={totalWidth} height={height} style={{ display: 'block' }}>
                <g transform={`translate(0, ${height - marginBottom})`}/>
                <path ref={pathRef} fill={ color ?? 'steelblue'}/>
            </svg>
        </div>
    </div>
}

export default ScrollableAreaChart;