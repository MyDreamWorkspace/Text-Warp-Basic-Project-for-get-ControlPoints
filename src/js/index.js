import Warp from "../../node_modules/warpjs";
import gsap from "gsap";
import Draggable from "gsap/Draggable";
import moveCanvas from "./chunks/moveCanvas";
import textToSvg from "./chunks/textToSvg";
import generateControlPoints from "./mychunks/generateControlPoints";
import { createElement } from 'warpjs/src/svg/utils';
import translate_svg_path from "translate-svg-path";
import svg_parse from "parse-svg-path";
import serialize_svg_path from "serialize-svg-path";

gsap.registerPlugin(Draggable);

const svgContainer = document.getElementById("svg_container");
const origin_svgElement = document.getElementById("svg_element");
const btnWarpText = document.getElementById("btn_warpText");
const containTextInput = document.getElementById("containTextInput");
const fontName = document.getElementById("fontName");
var inputControlPoints = [];
var words, wordIndex = -1;
var segRate = [
  [3, 7],
  [4, 6],
  [5, 5]
];
var font;
function randomRows() {
  return Math.floor(Math.random() * 100) % 2 + 1;
}
function getSegIndex(length, segRating = []) {
  return Math.floor(length / (segRating[0] + segRating[1]) * segRating[0]);
}
function randomIndex(length){
  return Math.floor(Math.random() * 100)% length;
}
function wordSeparate(text) {
  var words = [];
  var num_rows = randomRows();
  if (num_rows == 1) {
    words.push(text);
  }
  else {
    var segIndex = getSegIndex(text.length, segRate[randomIndex(segRate.length)])
    var word1 = text.slice(0, segIndex);
    var word2 = text.slice(segIndex, text.length);
    words.push(word1);
    words.push(word2);
  }
  return words;
}

btnWarpText.addEventListener("click", (e)=>{
  origin_svgElement.innerHTML = "";
  document.getElementById("warpLoading").classList.add("show");
  var inputedText = containTextInput.value;
  words = wordSeparate(inputedText);
  font = fontName.getAttribute("value");
  inputControlPoints = drawSvgPath(0, words.length)
  if(words.length > 0){
    wordIndex = 0;
    warpStart();
  }
});

function warpStart(){
  if (wordIndex >= words.length)
    return;
  const promise = textToSvg(words[wordIndex], "../../fonts/" + font);
  promise.then(warpText);
}

function getOffset(){
  var x_Offset = document.getElementById("shoesImage").offsetLeft + document.getElementById("shoesImage").getBoundingClientRect().width * 0.141;
  var y_Offset = document.getElementById("shoesImage").offsetTop + document.getElementById("shoesImage").getBoundingClientRect().height * 0.132;
  return [Math.floor(x_Offset), Math.floor(y_Offset)];
}

function warpText(svgString) {
  var svg_fromParser = new DOMParser()
      .parseFromString(svgString, "image/svg+xml")
      .getElementsByTagName("svg")[0];
  svgContainer.appendChild(svg_fromParser);
  var pathRect = svgContainer.children[svgContainer.children.length-1].children[0].getBBox();
  svgContainer.children[svgContainer.children.length-1].setAttribute("viewBox", 0+" "+0+" "+pathRect.width+" "+pathRect.height);
  svgContainer.children[svgContainer.children.length-1].setAttribute("width", pathRect.width+"px");
  svgContainer.children[svgContainer.children.length-1].setAttribute("height", pathRect.height+"px");
  svgContainer.children[svgContainer.children.length-1].setAttribute("style", "overflow:visible;visibility:hidden;");
  svgContainer.children[svgContainer.children.length-1].setAttribute("id", "temp_svg"+wordIndex);
  var origin_path_data = svg_parse(svgContainer.children[svgContainer.children.length-1].children[0].getAttribute("d"));
  var translated_path_data = serialize_svg_path(translate_svg_path(origin_path_data, -pathRect.x, -pathRect.y));
  svgContainer.children[svgContainer.children.length-1].children[0].setAttribute("d", translated_path_data);
  var temp_svg = document.getElementById("temp_svg"+wordIndex);
  // Need to interpolate first, so angles remain sharp
  const warp = new Warp(temp_svg);
  warp.interpolate( 4 );
  var controlPoints = generateControlPoints(
      pathRect.width,
      pathRect.height,
      -0.1,
      -0.1,
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

  //to two dimention array
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

  function getBoxRatio(originWidth){
    return document.getElementById("shoesImage").getBoundingClientRect().width * 0.7883 / originWidth;
  }

  function mainProcess() {
    origin_svgElement.appendChild(temp_svg.children[0]);
    svgContainer.removeChild(temp_svg);
    wordIndex++;
    if(wordIndex < words.length){
      warpStart();
    }
    else{
      var pathData = "";
      for(var i=0;i<origin_svgElement.children.length;i++){
        pathData += origin_svgElement.children[i].getAttribute("d");
      }
      origin_svgElement.children[0].setAttribute("d", pathData);
      for(var i=1;i<origin_svgElement.children.length;i++){
        origin_svgElement.removeChild(origin_svgElement.children[i]);
      }
      var completedPathBBox = origin_svgElement.children[0].getBBox();
      origin_svgElement.setAttribute("viewBox", completedPathBBox.x+" "+completedPathBBox.y+" "+completedPathBBox.width+" "+completedPathBBox.height);
      origin_svgElement.style.transform = "scale("+ getBoxRatio(completedPathBBox.width)+")";
      origin_svgElement.style.width = completedPathBBox.width+"px";
      origin_svgElement.style.height = completedPathBBox.height+"px";
      document.getElementById("warpLoading").classList.remove("show");
    }
  }
  var k = 0;
  function runThread() {
    setTimeout(()=>{
      for (let i = 0; i < inputControlPoints_toTwoDim.length; i ++) {
        controlPoints[k] = inputControlPoints_toTwoDim[k];
        k++;
      }
      warp.transform(reposition);

      if (k == inputControlPoints_toTwoDim.length)
      {
        mainProcess();
      }
      else
      {
        runThread();
      }
    }, 0);
  }
  runThread();
}


