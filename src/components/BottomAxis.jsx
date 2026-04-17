import {useMemo} from "react";
import * as d3 from "d3";

const BottomAxis = (
    {
        domain=[0, 100],
        width=100,
        numSteps,
        color
    }) => {
    const padding = 10;

    // creates and caches the number and pos of notches in the axis
    const ticks = useMemo(() => {
        const xScale = d3.scaleLinear()
            .domain(domain)
            .range([padding, width - padding]); // width in pixels

        const pixelsPerTick = 30;
        const numberOfTicksTarget = Math.max(
            1, Math.floor(width / pixelsPerTick),
        );

        return xScale.ticks(numSteps ?? numberOfTicksTarget)
            .map(value => ({
                value,
                xOffset: xScale(value),
            }))
    }, [domain, width, numSteps]);

    // DOM
    return <svg style={{ width: width }}>
        <path
            d={["M", padding, 6, "v", -6, "H", width - padding, "v", 6].join(" ")}
            fill="none"
            stroke={color}
        />
        {
            ticks.map(({ value, xOffset }) =>
            {
                return <g key={value} transform={`translate(${xOffset}, 0)`}>
                    // notch line
                    <line y2="6" stroke={color}/>
                    // notch text
                    <text key={value} style={{
                        fill: color,
                        fontSize: "10px",
                        textAnchor: "middle",
                        transform: "translateY(20px)"
                    }}>
                        { value }
                    </text>
                </g>
            })
        }
    </svg>
}

export default BottomAxis;