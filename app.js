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
console.log(multiGraph)
//layout settings
circular.assign(multiGraph);
const settings = forceAtlas2.inferSettings(multiGraph);
forceAtlas2.assign(multiGraph, { settings, iterations: 50 });

//hover functionality (show neighbors)
const state = {}

function setHoveredNode(node) {
    if (node) {
      state.hoveredNode = node; //the hovered node
      state.hoveredNeighbors = new Set(multiGraph.neighbors(node)); //unique ids of the hovered node's neighbors
    } else {
      state.hoveredNode = null;
      state.hoveredNeighbors = null;
    }

    // console.log('state', state)
  
    // Refresh rendering:
    renderer.refresh();
}



//events
renderer.on("enterNode", ({ node }) => {
    setHoveredNode(node);
});

renderer.on("leaveNode", () => {
    setHoveredNode(null);
});

/*
reducers allow us to dynamically change the appearance of nodes and edges, 
without actually changing the main graphology data
*/
renderer.setSetting("nodeReducer", (node, data) => {
    const res = { ...data };
    // console.log(res)

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

//colors
const colors = {
  'Breeding Herd': '#D8482D',
  'Nursery': '#D8482D',
  'Finisher': '#B30000',
  'Boar Stud': '#BB100A',
}

multiGraph.forEachNode((node, attributes) =>
  multiGraph.setNodeAttribute(node, "color", colors[attributes.farm_type])
  // console.log(attributes)
);

// console.log(multiGraph.neighbors('1686'))
// console.log(multiGraph.order)
// multiGraph.mapNodes((node, attr) => {
//     console.log(attr)
// })