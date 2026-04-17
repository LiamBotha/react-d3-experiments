import * as d3 from "d3"
import {Fragment, useEffect, useRef} from "react";

export default function LabeledLineGraph({ data, width, height })
{
    const bottomAxisRef = useRef(null);
    const leftAxisRef = useRef(null);
    const padding = 30;
    const rectSize = 5;

    // distributes data to fit width
    const x = d3.scaleLinear()
        .domain([0, data.length - 1]) // min max of values
        .range([padding, width - padding]); // width
    const y = d3.scaleLinear()
        .domain([0, 5])
        .range([500 - padding, padding])

    const line = d3.line((_data, index) => x(index), y);

    // binds these functions to run when the component mounts
    useEffect(()=> void d3
        .select(bottomAxisRef.current)
        .call(d3.axisBottom(x))
        , [bottomAxisRef, x]
    );
    useEffect(()=> void d3
        .select(leftAxisRef.current)
        .call(d3.axisLeft(y))
        , [leftAxisRef, y]
    );

    return <svg
            width={width}
            height={height}
            style={{ border: "2px solid gray" }}>
            <path
                fill='none'
                stroke="green"
                strokeWidth="1.5"
                d={ line(data) || "" }
            />
            <g id="data-points" fill="none" stroke="black" strokeWidth="1.5">
                {
                    // maps data into path
                    // converts data points into coordinates using scaleLinear
                    data.map((d, i) => (
                        <Fragment key={i}>
                            <rect x={x(i) - rectSize/2} y={y(d) - rectSize/2} width={rectSize} height={rectSize} style={{fill:'black', stroke:'none'}} />
                            <text x={x(i)} y={y(d) - rectSize} textAnchor='middle' style={{ font: 'bold 10px sans-serif', stroke:"none", fill:"black"}}>({d}, {i})</text>
                        </Fragment>
                    ))
                }
            </g>
            <g id="bottom-axis" ref={bottomAxisRef} transform={`translate(0, ${height - padding})`} />
            <g id="left-axis" ref={leftAxisRef} transform={`translate(${padding}, 0)`} />
    </svg>
}