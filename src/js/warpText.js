import Warp from "../../node_modules/warpjs";
import gsap from "gsap";
import Draggable from "gsap/Draggable";
import moveCanvas from "./chunks/moveCanvas";
import textToSvg from "./chunks/textToSvg";
import generateControlPoints from "./mychunks/generateControlPoints";
gsap.registerPlugin(Draggable);

let svgString0, svgString1;
let zoom = 1;
const svgContainer = document.getElementById("svg-container");
const origin_svgElement = document.getElementById("svg-element");
const svgControl = document.getElementById("svg-control");
// const zoomElement = document.getElementById("scale-wrap");
const btnWarpText = document.getElementById("btn_warpText");
const containTextInput = document.getElementById("containTextInput");
var inputControlPoints = [];
var words, wordIndex = -1;

function randomRows() {
  return Math.floor(Math.random() * 100) % 2 + 1;
}

function randomIndex(length) {
  return Math.floor(Math.random() * 100) % length;
}
function wordSeparate(text) {
  var words = [];
  var num_rows = randomRows();
  if (num_rows == 1) {
    words.push(text);
  }
  else {
    var segIndex = randomIndex(text.length)
    var word1 = text.slice(0, segIndex);
    var word2 = text.slice(segIndex + 1, text.length - 1);
    words.push(word1);
    words.push(word2);
  }
  return words;
}

btnWarpText.addEventListener("click", (e)=>{
  var inputedText = containTextInput.value;
  words = wordSeparate(inputedText);
  console.log("words", words);
  inputControlPoints = drawSvgPath(0, words.length)
  if(words.length > 0){
    wordIndex = 0;
    warpStart();
  }
});

function warpStart(){
  if (wordIndex >= words.length)
    return;
  console.log("wordIndex: ", wordIndex);
  const promise = textToSvg(words[wordIndex], "../../fonts/fonts/Diplomata SC.ttf");
  promise.then(setSvgString);
}

function setSvgString(svg) {
  if(wordIndex == 0){
    svgString0 = svg;
    warpText(svgString0);
    return;
  }
  svgString1 = svg;
  warpText(svgString1);
}

function warpText(svgString) {
  const controlPath = document.getElementById("control-path");
  const parser = new DOMParser();
  let pathDom = parser.parseFromString(svgString, "image/svg+xml").getElementsByTagName("svg")[0].children[0];
  const svgElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );
  svgContainer.appendChild(svgElement);
  svgElement.appendChild(pathDom);
  // Need to interpolate first, so angles remain sharp
  const warp = new Warp(svgElement);
  warp.interpolate( 4 );

  var elementInnerPathBBox = svgElement.children[0].getBBox();

  let controlPoints = generateControlPoints(
    elementInnerPathBBox.width,
    elementInnerPathBBox.height,
    elementInnerPathBBox.x,
    elementInnerPathBBox.y,
    inputControlPoints[wordIndex][0].length,
    inputControlPoints[wordIndex][1].length,
    inputControlPoints[wordIndex][2].length,
    inputControlPoints[wordIndex][3].length
  )
  // Compute weights from control points
  warp.transform(function (v0, V = controlPoints) {
    const A = [];
    const W = [];
    const L = [];

    // Find angles
    for (let i = 0; i < V.length; i++) {
      const j = (i + 1) % V.length;

      const vi = V[i];
      const vj = V[j];

      const r0i = Math.sqrt((v0[0] - vi[0]) ** 2 + (v0[1] - vi[1]) ** 2);
      const r0j = Math.sqrt((v0[0] - vj[0]) ** 2 + (v0[1] - vj[1]) ** 2);
      const rij = Math.sqrt((vi[0] - vj[0]) ** 2 + (vi[1] - vj[1]) ** 2);

      const dn = 2 * r0i * r0j;
      const r = (r0i ** 2 + r0j ** 2 - rij ** 2) / dn;

      A[i] = isNaN(r) ? 0 : Math.acos(Math.max(-1, Math.min(r, 1)));
    }

    // Find weights
    for (let j = 0; j < V.length; j++) {
      const i = (j > 0 ? j : V.length) - 1;

      // const vi = V[i];
      const vj = V[j];

      const r = Math.sqrt((vj[0] - v0[0]) ** 2 + (vj[1] - v0[1]) ** 2);

      W[j] = (Math.tan(A[i] / 2) + Math.tan(A[j] / 2)) / r;
    }

    // Normalise weights
    const Ws = W.reduce((a, b) => a + b, 0);
    for (let i = 0; i < V.length; i++) {
      L[i] = W[i] / Ws;
    }

    // Save weights to the point for use when transforming
    return [...v0, ...L];
  });

  // Warp function
  function reposition([x, y, ...W], V = controlPoints) {
    let nx = 0;
    let ny = 0;
    // Recreate the points using mean value coordinates
    for (let i = 0; i < V.length; i++) {
      nx += W[i] * V[i][0];
      ny += W[i] * V[i][1];
    }
    return [nx, ny, ...W];
  }
  // Draw control shape
  function drawControlShape(element = controlPath, V = controlPoints) {
    const path = [`M${V[0][0]} ${V[0][1]}`];

    for (let i = 1; i < V.length; i++) {
      path.push(`L${V[i][0]} ${V[i][1]}`);
    }
    path.push("Z");
    element.setAttribute("d", path.join(""));
  }

  // Draw control point
  function drawPoint(element, pos = { x: 0, y: 0 }, index) {
    const point = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    point.setAttributeNS(null, "class", "control-point");
    point.setAttributeNS(null, "cx", pos.x);
    point.setAttributeNS(null, "cy", pos.y);
    point.setAttributeNS(null, "r", 6);
    element.appendChild(point);


    Draggable.create(point, {
      type: "x,y",
      onDrag: function () {
        const relativeX = (this.pointerX - svgControl.getBoundingClientRect().left) / zoom;
        const relativeY = (this.pointerY - svgControl.getBoundingClientRect().top) / zoom;

        controlPoints[index] = [relativeX, relativeY];
        drawControlShape();
        warp.transform(reposition);
      },
    });
  }

  // Place control points
  function drawControlPoints(element = svgControl, V = controlPoints) {
    V.map((i, index) => {
      drawPoint(element, { x: i[0], y: i[1] }, index);
      return null;
    });
  }

  let inputControlPoints_toTwoDim = [];
  inputControlPoints[wordIndex][0].forEach(value => {
    inputControlPoints_toTwoDim.push(value)
  });
  inputControlPoints[wordIndex][1].forEach(value => {
    inputControlPoints_toTwoDim.push(value)
  });
  inputControlPoints[wordIndex][2].forEach(value => {
    inputControlPoints_toTwoDim.push(value)
  });
  inputControlPoints[wordIndex][3].forEach(value => {
    inputControlPoints_toTwoDim.push(value)
  });

  for(var i = 0; i< inputControlPoints_toTwoDim.length; i++){
    controlPoints[i] = inputControlPoints_toTwoDim[i];
    drawControlShape();
    warp.transform(reposition);
  }
  drawControlShape();
  drawControlPoints();
  var processedPath = svgElement.children[0];
  origin_svgElement.appendChild(processedPath);
  wordIndex++;
  if(wordIndex < words.length){
    warpStart();
  }
  // warp.transform(reposition);
}


// Initial calling
moveCanvas(svgContainer);
// init(true);
