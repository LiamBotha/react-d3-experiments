import * as d3 from "d3";
import {useEffect, useRef} from "react";

const CanvasTest = ({dataset, width=500, height=500}) => {
    const canvasRef = useRef(null);
    const margin = 30;

    useEffect(() => {

        const x = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d["Miles_per_Gallon"])]).nice()
            .range([margin, width - margin])
            .unknown(margin);

        const y = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.Horsepower)]).nice()
            .range([height - margin, margin])
            .unknown(margin);

        const canvas = d3.select(canvasRef.current)
        const context= canvas.node().getContext("2d");

        // Draw points
        dataset.map(d => {
            context.beginPath();
            context.arc(x(d["Miles_per_Gallon"]), y(d.Horsepower), 2, 0, 2 * Math.PI);
            context.strokeStyle = x(d.Horsepower) === margin || y(d["Miles_per_Gallon"]) === margin ? "red" : "blue";
            context.stroke();
            context.closePath();
        })

        context.textBaseline = "top"
        context.textAlign = "center"
        context.font = "100px"
        context.fillText("Drawn with canvas ", width / 2, 5);

        // draw x axis
        x.ticks().map(value => {
            const startY = height - margin;
            // tick line
            context.beginPath();
            context.strokeStyle = "black";
            context.lineWidth = .5;
            context.moveTo(x(value), startY);
            context.lineTo(x(value), startY + 6);
            context.stroke();
            context.closePath();
            // text
            context.fillStyle = "black";
            context.textAlign = "center";
            context.textBaseline = "top";
            context.fillText(value, x(value), startY + 6)
        })

        // draw y axis
        y.ticks().map(value => {
            // tick line
            context.beginPath();
            context.strokeStyle = "black";
            context.lineWidth = .5;
            context.moveTo(margin, y(value));
            context.lineTo(margin - 6, y(value));
            context.stroke();
            context.closePath();
            // text
            context.fillStyle = "black";
            context.textAlign = "end";
            context.textBaseline = "middle";
            context.fillText(value, margin - 6, y(value))
        })

    }, [width, height]);

    return <canvas ref={canvasRef} id="canvas" width={width} height={height} style={{border: "1px solid black", display: "inline-block"}}>
    </canvas>
}

export default CanvasTest;