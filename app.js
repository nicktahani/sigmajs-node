import { MultiGraph } from "graphology";
import { Sigma } from "sigma";
import data from "./data/processed_data.json";
import { circular } from "graphology-layout";
import forceAtlas2 from "graphology-layout-forceatlas2";

const container = document.getElementById("sigma-container");

const multiGraph = new MultiGraph();

multiGraph.import(data);
const renderer = new Sigma(multiGraph, container, {
    // minCameraRatio: 0.1,
    // maxCameraRatio: 2,
});

//layout settings
circular.assign(multiGraph);
const settings = forceAtlas2.inferSettings(multiGraph);
forceAtlas2.assign(multiGraph, { settings, iterations: 50 });

//hover functionality (show neighbors)
const state = {}

function setHoveredNode(node) {
    if (node) {
      state.hoveredNode = node;
      state.hoveredNeighbors = new Set(multiGraph.neighbors(node));
    } else {
      state.hoveredNode = undefined;
      state.hoveredNeighbors = undefined;
    }
  
    // Refresh rendering:
    renderer.refresh();
}

renderer.on("enterNode", ({ node }) => {
    setHoveredNode(node);
});

renderer.on("leaveNode", () => {
    setHoveredNode(undefined);
});

renderer.setSetting("nodeReducer", (node, data) => {
    const res = { ...data };

    if (state.hoveredNeighbors && !state.hoveredNeighbors.has(node) && state.hoveredNode !== node) {
      res.label = "";
      res.color = "#f6f6f6";
    }

    if (state.selectedNode === node) {
      res.highlighted = true;
    }
    return res;
});

renderer.setSetting("edgeReducer", (edge, data) => {
    const res = { ...data };
    if (state.hoveredNode && !multiGraph.hasExtremity(edge, state.hoveredNode)) {
        res.hidden = true;
    }
    return res;
});

// console.log(multiGraph.neighbors('1686'))
// multiGraph.nodes().forEach(node => console.log(node))
// console.log(multiGraph.order)