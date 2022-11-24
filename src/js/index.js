import Warp from "../../node_modules/warpjs";
import gsap from "gsap";
import Draggable from "gsap/Draggable";
import moveCanvas from "./chunks/moveCanvas";
import textToSvg from "./chunks/textToSvg";
import generateControlPoints from "./mychunks/generateControlPoints";
import { createElement } from 'warpjs/src/svg/utils';

gsap.registerPlugin(Draggable);

var svgString0, svgString1;
var draggableControlPoints = [];
var zoom = 1;
const svgContainer = document.getElementById("svg_container");
const origin_svgElement = document.getElementById("svg_element");
const svgControl = document.getElementById("svg_control");
const zoomElement = document.getElementById("scale_warp");
const btnWarpText = document.getElementById("btn_warpText");
const containTextInput = document.getElementById("containTextInput");
const fontNameShower = document.getElementById("fontName");
var controlPath;
var inputControlPoints = [];
var words, wordIndex = -1;
var fontList = [
  "Abel-Regular.ttf",
  "AbhayaLibre-ExtraBold.ttf",
  "AbrilFatface-Regular.ttf",
  "AdigianaUI.ttf",
  "AdventPro-Bold.ttf",
  "AlegreyaSans-Black.otf",
  "AlegreyaSansSC-Black.otf",
  "AlfaSlabOne-Regular.ttf",
  "Alike-Regular.ttf",
  "AllertaStencil-Regular.ttf",
  "Allura-Regular.ttf",
  "Amaranth-Regular.ttf",
  "AmaticSC-Regular.ttf",
  "Amiko-Bold.ttf",
  "Andada-Regular.ttf",
  "Andika-Regular.ttf",
  "AnonymousPro-Regular.ttf",
  "AnticDidone-Regular.ttf",
  "Antonio-Bold.ttf",
  "ArbutusSlab-Regular.ttf",
  "Archicoco.ttf",
  "ArchitectsDaughter-Regular.ttf",
  "ArchivoBlack-Regular.ttf",
  "ArimaMadurai-ExtraBold.ttf",
  "Arvo-Regular.ttf",
  "Asap-SemiBold.ttf",
  "asset-Regular.ttf",
  "Assistant-Bold.ttf",
  "Atma-Bold.ttf",
  "Baloo-Regular.ttf",
  "BalooThambi-Regular.ttf",
  "Bangers-Regular.ttf",
  "Barlow-Black.ttf",
  "Belgrano-Regular.ttf",
  "Belleza-Regular.ttf",
  "BenchNine-Regular.ttf",
  "Benne-Regular.otf",
  "Bentham-Regular.ttf",
  "BerkshireSwash-Regular.ttf",
  "Bevan-Regular.ttf",
  "Bhavuka-Regular.ttf",
  "BioRhyme-Regular.otf",
  "Biryani-Black.ttf",
  "BlackOpsOne-Regular.ttf",
  "BM-HANNA.ttf",
  "BodoniFLF-Bold.ttf",
  "Bristol.otf",
  "BroshK.ttf",
  "Bryndan-Write.ttf",
  "Bungee-Regular.ttf",
  "bungeeshade-Regular.ttf",
  "ButchermanCaps-Regular.ttf",
  "Cabin-SemiBold.otf",
  "CabinSketch-Regular.ttf",
  "Cagliostro-Regular.ttf",
  "Cairo-Bold.ttf",
  "Candal-Regular.ttf",
  "CantataOne-Regular.ttf",
  "Capriola-Regular.ttf",
  "cardo-Regular.ttf",
  "CarterOne-Regular.ttf",
  "Caveatbrush-Regular.ttf",
  "Caveat-Regular.ttf",
  "Chango-Regular.ttf",
  "Chewy-Regular.ttf",
  "chonburi-Regular.ttf",
  "Cinzel-Regular.ttf",
  "ClearSans-Bold.ttf",
  "ClickerScript-Regular.ttf",
  "Cmunti.ttf",
  "Codystar-Regular.ttf",
  "Coiny-Regular.ttf",
  "Comfortaa-Bold.ttf",
  "ComingSoon-Regular.ttf",
  "ConcertOne-Regular.ttf",
  "Contrailone-Regular.ttf",
  "Corben-Regular.ttf",
  "CormorantGaramond-Bold.ttf",
  "CormorantSC-Bold.ttf",
  "Costa Rica Personal Use.ttf",
  "Courgette-Regular.ttf",
  "Coustard-Regular.ttf",
  "CraftyGirls-Regular.ttf",
  "Creepster-Regular.ttf",
  "Crushed-Regular.ttf",
  "CupolaRegular.ttf",
  "CutiveMono-Regular.ttf",
  "Decalotype-Black.ttf",
  "DejaVuSans-Bold.ttf",
  "DejaVuSerif.ttf",
  "Dekko-Regular.ttf",
  "DidactGothic-Regular.ttf",
  "Dosis-ExtraBold.ttf",
  "DoulosSILR.ttf",
  "DrSugiyama-Regular.ttf",
  "DuruSans-Regular.ttf",
  "E4 Digital Finalest.ttf",
  "EbGaramond-Regular.ttf",
  "Eczar-ExtraBold.ttf",
  "Edo.ttf",
  "emblemaone-Regular.ttf",
  "EmilysCandy-Regular.ttf",
  "Engagement-Regular.ttf",
  "Essays1743.ttf",
  "EuphoriaScript-Regular.ttf",
  "Exo2-Black.ttf",
  "Farsan-Regular.ttf",
  "Fascinate-Regular.ttf",
  "Faustina-Regular.ttf",
  "FiraSans-Black.ttf",
  "FjallaOne-Regular.ttf",
  "FoglihtenBlackPcs.otf",
  "Forum-Regular.ttf",
  "FreckleFace-Regular.ttf",
  "FredokaOne-Regular.ttf",
  "FugazOne-Regular.ttf",
  "GARUDA.ttf",
  "GemunuLibre-ExtraBold.ttf",
  "GermaniaOne-Regular.ttf",
  "GFSArtemisia.ttf",
  "GFSNeoHellenic-Regular.ttf",
  "GildaDisplay-Regular.ttf",
  "GlacialIndifference-Regular.otf",
  "GlassAntiqua-Regular.ttf",
  "Glegoo-Regular.ttf",
  "GloriaHallelujah-Regular.ttf",
  "GochiHand-Regular.ttf",
  "GoudyStM.otf",
  "Graduate-Regular.ttf",
  "GrandHotel-Regular.ttf",
  "GreatVibes-Regular.ttf",
  "Gruppo-Regular.ttf",
  "HammersmithOne-Regular.ttf",
  "HindGuntur-Bold.ttf",
  "Hitchcut-Regular.ttf",
  "Hitch-hike.otf",
  "HussarBd.otf",
  "IMFeENsc28P-Regular.ttf",
  "IndieFlower-Regular.ttf",
  "JuliusSansOne-Regular.ttf",
  "Jura-Bold.ttf",
  "justanotherhand-regular.ttf",
  "Kadwa-Regular.ttf",
  "Kalam-Bold.ttf",
  "KaushanScript-Regular.ttf",
  "Kavivanar-Regular.ttf",
  "Kavoon-Regular.ttf",
  "Kelvinch-Bold.otf",
  "KiteOne-Regular.ttf",
  "Knewave-Regular.ttf",
  "Kollektif.ttf",
  "KumarOne-Regular.ttf",
  "Kurale-Regular.ttf",
  "Laila-Bold.ttf",
  "Lalezar-Regular.ttf",
  "Lancelot-Regular.ttf",
  "Lato-Bold.ttf",
  "LemonTuesday.otf",
  "LibreBaskerville-Regular.ttf",
  "LibreFranklin-Bold.ttf",
  "lifelogo_hard.ttf",
  "LifeSavers-Regular.ttf",
  "Limelight-Regular.ttf",
  "LJ Studios GF.otf",
  "Lobster-Regular.ttf",
  "LondrinaShadow-Regular.ttf",
  "Diplomata SC.ttf",
  "Lato-Black.ttf",
  "LuckiestGuy.ttf",
  "Oswald-Bold.ttf",
  "Pacifico.ttf"
];
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
  svgControl.innerHTML = "";
  controlPath = createElement("path");
  controlPath.setAttribute("id", "control-path");
  svgControl.appendChild(controlPath);
  document.getElementById("warpLoading").classList.add("show");
  var inputedText = containTextInput.value;
  words = wordSeparate(inputedText);
  font = fontList[randomIndex(fontList.length)];
  fontNameShower.setAttribute("value", font);
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
function boundRatio(){
  return document.getElementById("shoesImage").getBoundingClientRect().width / 1223;
}

function warpText(svgString) {
  const parser = new DOMParser();
  var pathDom = parser.parseFromString(svgString, "image/svg+xml").getElementsByTagName("svg")[0].children[0];
  const svgElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg",
  );
  svgElement.setAttribute("style", "visibility: hidden;");
  svgContainer.appendChild(svgElement);
  svgElement.appendChild(pathDom);

  var zoomRatio = boundRatio();
  zoomElement.style.transform = "scale("+zoomRatio+")";
  zoom =1;
  // Need to interpolate first, so angles remain sharp
  const warp = new Warp(svgElement);
  warp.interpolate( 4 );

  var elementInnerPathBBox = svgElement.children[0].getBBox();

  var controlPoints = generateControlPoints(
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
    element.setAttribute("fill", "none");
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
        // drawControlShape();
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
  document.addEventListener("wheel", function (e) {
    const controlPath = document.getElementById("control-path");
    if (e.deltaY > 0) {
      zoomElement.style.transform = `scale(${(zoom += 0.005)})`;
      controlPath.style.strokeWidth = `${1 / zoom}px`;
    } else if (zoomElement.getBoundingClientRect().width >= 30) {
      zoomElement.style.transform = `scale(${(zoom -= 0.005)})`;
      controlPath.style.strokeWidth = `${1 / zoom}px`;
    }
    draggableControlPoints.map((i) => {
      if (i.getBoundingClientRect().height > 6) {
        i.setAttribute("r", 6 / zoom);
      }
    });
  });
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

  function mainProcess() {
    var processedPath = svgElement.children[0];
    origin_svgElement.appendChild(processedPath);
    svgContainer.removeChild(svgElement);
    wordIndex++;
    if(wordIndex < words.length){
      warpStart();
    }
    document.getElementById("warpLoading").classList.remove("show");
  }
  var k = 0;
  function runThread() {
    setTimeout(()=>{
      for (let i = 0; i < inputControlPoints_toTwoDim.length; i ++) {
        controlPoints[k] = inputControlPoints_toTwoDim[k];
        k++;
      }
      warp.transform(reposition);
      // drawControlShape(controlPath, controlPoints);
      // drawControlPoints(svgControl, controlPoints);
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


moveCanvas(svgContainer);
