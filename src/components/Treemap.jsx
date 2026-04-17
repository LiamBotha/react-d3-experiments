import {useEffect, useRef} from "react";
import * as d3 from "d3";

const Treemap = ({dataset, width=1000, height=1000}) => {

    const ref = useRef(null);

    useEffect(() => {
        const color = d3.scaleOrdinal(dataset.children.map(d => d.name),  d3.schemeTableau10);

        const root = d3.treemap()
            .tile(d3.treemapSquarify)
            .size([width, height])
            .padding(1)
            .round(true)
        (d3.hierarchy(dataset)
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value));

        // container
        const svg = d3.select(ref.current)

        // add a cell for each leaf of the hierarchy
        const leaf = svg.selectAll("g")
            .data(root.leaves())
            .join("g")
                .attr("transform", d=> `translate(${d.x0}, ${d.y0})`)

        // tooltip
        const format = d3.format(",d")
        leaf.select("title").remove(); // remove old versions of this on update
        leaf.append("title")
            .text(d => `${d.ancestors().reverse().map(d => d.data.name).join(".")}\n${format(d.value)}`);

        // color rectangles
        leaf.select("rect").remove();
        leaf.append("rect")
            .attr("id", (d, i) => (d.leafUid = "leaf-" + i))
            .attr("fill", d => { while( d.depth > 1) d = d.parent; return color(d.data.name); })
            .attr("fill-opacity", 0.6)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0);

        // clipPath to prevent overflow
        leaf.select("clipPath").remove();
        leaf.append("clipPath")
            .attr("id", (d, i)=> (d.clipUid = `clip-${i}`))
            .select("use").remove()
            .append("use")
                .attr("xlink:href", d => d.leafUid.href);

        // multiline text
        leaf.select("text").remove();
        leaf.append("text")
            .attr("clipPath", d => d.clipUid)
            .selectAll("tspan")
            .data(d=> d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value)))
            .join("tspan")
            .attr('x', 3)
            .attr('y', (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
            .attr('fill-opacity', (_d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
            .text(d => d)

    }, [dataset, width, height]);

    return <svg ref={ref} width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ maxWidth: '100%', height: 'auto', font: '10px sans-serif' }} >
    </svg>
}

export default Treemap