import { MultiGraph } from "graphology";
import { Sigma } from "sigma";
import data from "./data/processed_data.json";
import { circular } from "graphology-layout";
import forceAtlas2 from "graphology-layout-forceatlas2";

const container = document.getElementById("sigma-container");

const multiGraph = new MultiGraph();

multiGraph.import(data);
const renderer = new Sigma(multiGraph, container);

circular.assign(multiGraph);
const settings = forceAtlas2.inferSettings(multiGraph);
forceAtlas2.assign(multiGraph, { settings, iterations: 600 });

// multiGraph.nodes().forEach(node => console.log(node))
// console.log(multiGraph.order)