import LineGraph from "./components/line_graphs/LineGraph.jsx";
import CircleGraph from "./components/points/CircleGraph.jsx";
import BottomAxis from "./components/BottomAxis.jsx";
import ScrollableAreaChart from "./components/area_charts/ScrollableAreaChart.jsx";
import Treemap from "./components/Treemap.jsx";
import BrushableScatterPlot from "./components/points/BrushableScatterPlot.jsx";
import CanvasTest from "./components/points/CanvasTest.jsx";
import LabeledLineGraph from "./components/line_graphs/LabeledLineGraph.jsx";
import BarChart from "./components/bar_charts/BarChart.jsx";
import DivergingStackedBarChart from "./components/bar_charts/DivergingStackedBarChart.jsx";
import ChordDiagram from "./components/ChordDiagram.jsx";
import TopographyContour from "./components/TopographyContour.jsx";
import AreaChart from "./components/area_charts/AreaChart.jsx";

import {useState} from "react";

import aaplDataset from "./assets/aapl.json"
import flareDataset from "./assets/flare.json"
import carsDataset from "./assets/data.json"
import musicDataset from "./assets/music.json"
import pollDataset from "./assets/poll.json"
import volcanoDataset from "./assets/volcano.json"

const generateDataset1D = (numPoints) => (
    Array(numPoints).fill(0).map(() => (
        Math.round(Math.random() * 5)
    ))
)

function App() {

  const [data] = useState([1, 2, 5, 2, 5, 1, 4, 3,1,1,1]);
  const [randData] = useState(generateDataset1D(10));

  return (
      <div>
        <h1>Experiments with D3.js & React</h1>
        <br />
        <h2>Line Graphs</h2>
        <h4>First experiment to figure out how d3js works & how to integrate it with React</h4>
        <section>
            <LineGraph data={data} width={500} height={500}/>
            <LabeledLineGraph data={randData} width={500} height={500}/>
        </section>
          <br/>
        <h2>Points</h2>
        <h4>
            Slightly more complex. Rendering a bunch of points from a dataset,
            also a test to see how different working with canvas
            instead of svgs is as canvas is more performant for large amounts of data
        </h4>
        <section style={{display: "flex", flexWrap: "wrap", justifyContent: "center"}}>
            <CircleGraph width={500} height={500}/>
            <BrushableScatterPlot dataset={carsDataset}/>
            <CanvasTest dataset={carsDataset}/>
        </section>

          <br/>

        <h2>Axis React Component</h2>
        <h4>
            Built my own version of the axisBottom() from d3,
            using d3.scaleLinear() to build the data for the axis
            and then using the ticks() to get the data for rendering the lines for the axis.
            More integrated into the React workflow but more of a pain to use.
        </h4>
        <section>
            <BottomAxis domain={[0, 100]} width={500} color="red" numSteps={10}/>
        </section>

          <br/>

        <h2>Area Charts</h2>
        <h4>
            Essentially a line graph, slightly more complex. adds a path element to draw the color part of the graph
        </h4>
        <section>
            <AreaChart dataset={aaplDataset}/>
            <ScrollableAreaChart dataset={aaplDataset} color="lightgreen"/>
        </section>

          <br/>

        <h2>Tree map</h2>
        <h4>Uses d3.treemap() and d3.hierarchy() to handle the recursive nature of the data. Draws each leaf of the tree as a rect then adds labels & titles</h4>
        <section>
            <Treemap dataset={flareDataset} width={1000} height={500}/>
        </section>

          <br/>

        <h2>Bar Charts</h2>
        <h4>
            The charts use d3.stack() to handle layering the data on top of each other and scaleOrdinal() to set the color based of the type of data
        </h4>
        <section>
            <BarChart dataset={musicDataset}/>
            <DivergingStackedBarChart dataset={pollDataset}/>
        </section>

          <br/>

        <h2>Misc</h2>
        <h4>Chord Diagram & Topography Contour Map</h4>
        <h4>Chord diagrams are the most complex of the diagrams of the ones i've tested from d3. Uses d3.chord(), d3.arc() and d3.ribbon() to handle drawing the circular shape and positioning the lines and text around it</h4>
        <section>
            <ChordDiagram />
            <TopographyContour dataset={volcanoDataset}/>
        </section>
      </div>
  );
}

export default App