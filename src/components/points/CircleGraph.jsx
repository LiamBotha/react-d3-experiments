import {useEffect, useRef, useState} from "react";
import * as d3 from "d3";

const generateDataset2D = (width, height) => (
    Array(100).fill(0).map(() => (
        [
            Math.round(Math.random() * (width - 20) + 10),
            Math.round(Math.random() * (height - 45) + 10)
        ]
    ))
)

const CircleGraph = ({width, height}) => {
    const ref = useRef(null);
    const [data, setData] = useState(generateDataset2D(width, height));

    const buttonMargin = 25;

    const x = d3.scaleLinear()
        .domain([0, width])
        .range(["0", "360"]);

    const y = d3.scaleLinear()
        .domain([0, height - buttonMargin])
        .range(["0", "1"]);

    function handleClick() {
        setData(generateDataset2D(width, height))
    }

    useEffect(() => {
        const svgElement = d3.select(ref.current);
        svgElement.selectAll("circle")
            .data(data)
            .join("circle")
                .attr("cx", d => d[0])
                .attr("cy", d => d[1])
                .attr("r", width / 100)
                .attr("fill", d => d3.hsl( x(d[0]) , y(d[1]), 0.5))
    }, [data])

    return <div style={{ border: "1px solid black", display: "inline-block", height: {height} + "px" }}>
        <svg width={width} height={height - buttonMargin} ref={ref}/>
        <button onClick={handleClick} style={{ display: "block"}}>Generate Points</button>
    </div>
}

export default CircleGraph;