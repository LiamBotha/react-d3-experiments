import * as d3 from 'd3';
import {useEffect, useRef} from "react";

export default function TopographyContour ({dataset, width=500}) {
    const ref = useRef(null);

    const n = dataset.width;
    const m = dataset.height;
    const height = Math.round(m / n * width);
    const path = d3.geoPath().projection(d3.geoIdentity().scale(width / n));
    const contours = d3.contours().size([n, m]);
    const color = d3.scaleSequential(d3.interpolateTurbo).domain(d3.extent(dataset.values)).nice();

    return <svg ref={ref} width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{maxWidth: '100%', height: 'auto'}}>
        <g stroke="black">
            {
                color.ticks(20).map((d) => {
                    return <path key={d} d={path(contours.contour(dataset.values, d))} fill={ color(d) } />
                })
            }
        </g>
    </svg>
}