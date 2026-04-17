import * as d3 from 'd3'
import {useRef} from "react";

const data = Object.assign([
    [11975,  5871, 8916, 2868],
    [ 1951, 10048, 2060, 6171],
    [ 8010, 16145, 8090, 8045],
    [ 1013,   990,  940, 6907]
], {
    names: ["black", "blond", "brown", "red"],
    colors: ["#000000", "#ffdd89", "#957244", "#f26223"]
})

function groupTicks(d, step) {
    const k = (d.endAngle - d.startAngle) / d.value;
    return d3.range(0, d.value, step).map(value => {
        return {value: value, angle: value * k + d.startAngle};
    });
}

const ChordTick = ({ data, tickStepMajor, formatValue, outerRadius }) => {
    return <g transform={` rotate(${data.angle * 180 / Math.PI - 90}) translate(${outerRadius}, 0)`}>
        <line stroke="currentColor" x2="6" />
        {
            data.value % tickStepMajor === 0
                ? <text
                    x="8"
                    dy=".35em"
                    transform={ data.angle > Math.PI ? "rotate(180) translate(-16)" : null}
                    textAnchor={ data.angle > Math.PI ? "end" : null}>
                    { formatValue(data.value) }
                </text>
                : null
        }
    </g>
}

const Ribbon = ({chords, ribbonFunc, colors, names}) => {
    return <g id="Ribbon" fillOpacity='0.7'>
        {
            chords.map((d, i) => {
                return <path key={i} d={ ribbonFunc(d) } fill={colors[d.target.index]} stroke="white">
                    <title>
                        {
                            `${d.source.value.toLocaleString("en-US")} ${names[d.source.index]} → ${names[d.target.index]}${d.source.index !==
                            d.target.index
                                ? `\n${d.target.value.toLocaleString("en-US")} ${names[d.target.index]} → ${names[d.source.index]}` : ""}` }
                    </title>
                </path>
            })
        }
    </g>
}

export default function ChordDiagram({width=500, height=500}) {
    const svgRef = useRef(null);
    const groupRef = useRef(null);

    const {names, colors} = data;

    const sum = d3.sum(data.flat());
    const tickStep = d3.tickStep(0, sum, 100);
    const tickStepMajor = d3.tickStep(0, sum, 20);
    const formatValue = d3.formatPrefix(",.0", tickStep);

    const outerRadius = Math.min(width, height) * 0.5 - 30;
    const innerRadius = outerRadius - 20;

    const chord = d3.chord()
        .padAngle(20 / innerRadius)
        .sortSubgroups(d3.descending)

    const arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    const ribbon = d3.ribbon()
        .radius(innerRadius);

    const chords = chord(data);

    return <svg ref={svgRef}
                width={width}
                height={height}
                viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
                style={{
                    maxWidth: '100%',
                    height:'auto',
                    font: '10px sans-serif'
    }}>
        <g id="Chord Group" ref={groupRef}>
            {
                chords.groups.map((data, index) => {
                    return <g key={data.value}>
                        <path id="react" d={arc(data)} fill={colors[data.index]} >
                            <title>{ data.value.toLocaleString("en-US")} { names[data.index] }</title>
                        </path>
                        <g>
                        {
                            groupTicks(data, tickStep).map((d) => {
                                return <ChordTick key={d.angle} data={d} tickStepMajor={tickStepMajor} formatValue={formatValue} outerRadius={outerRadius} />
                            })
                        }
                        </g>
                    </g>
                })
            }
        </g>
        <Ribbon chords={chords} ribbonFunc={ribbon} names={names} colors={colors} />
    </svg>
}