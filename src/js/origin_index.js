import Warp from "../../node_modules/warpjs";
import textToSvg from "./mychunks/textToSvg";
import generateControlPoints from "./mychunks/generateControlPoints";

import translate_svg_path from "translate-svg-path";
import svg_parse from "parse-svg-path";
import serialize_svg_path from "serialize-svg-path";

const tempSvgContainer = document.getElementById("svg_container");
const origin_svgElement = document.getElementById("svg_element");
const btnWarpText = document.getElementById("btn_warpText");
const containTextInput = document.getElementById("containTextInput");
const nextFont = document.getElementById("next_font");
var inputControlPoints = [];
var words, charIndex = -1, wordIndex = -1, totalCharLength = -1;
var fontName = "";
var colors = ["#be816c", "#c88087"];
var currentFontIndex = 0;
var fonts = [
    "AbhayaLibre-ExtraBold.ttf",
    "AbrilFatface-Regular.ttf",
    "AdigianaUI.ttf",
    "Adumu.ttf",
    "AdventPro-Bold.ttf",
    "Aileron-Heavy.otf",
    "AlegreyaSans-Black.otf",
    "AlfaSlabOne-Regular.ttf",
    "Anton-Regular.ttf",
    "Antonio-Bold.ttf",
    "Archicoco.ttf",
    "ArchivoBlack-Regular.ttf",
    "Baloo-Regular.ttf",
    "BalooThambi-Regular.ttf",
    "Barlow-Black.ttf",
    "Bevan-Regular.ttf",
    "BlackOpsOne-Regular.ttf",
    "BodoniFLF-Bold.ttf",
    "BroshK.ttf",
    "Bungee-Regular.ttf",
    "bungeeshade-Regular.ttf",
    "ButchermanCaps-Regular.ttf",
    "CabinSketch-Regular.ttf",
    "Candal-Regular.ttf",
    "Chango-Regular.ttf",
    "Chewy-Regular.ttf",
    "chonburi-Regular.ttf",
    "Chunkfive.otf",
    "Coiny-Regular.ttf",
    "ConcertOne-Regular.ttf",
    "Contrailone-Regular.ttf",
    "CooperHewitt-Heavy.otf",
    "Creepster-Regular.ttf",
    "CupolaRegular.ttf",
    "Decalotype-Black.ttf",
    "Decalotype-Bold.ttf",
    "Diplomata SC.ttf",
    "DiplomataSC-Regular.ttf",
    "Dosis-ExtraBold.ttf",
    "EbGaramond-Regular.ttf",
    "Eczar-ExtraBold.ttf",
    "Eczar-SemiBold.ttf",
    "emblemaone-Regular.ttf",
    "EmilysCandy-Regular.ttf",
    "Exo2-Black.ttf",
    "Exo2-Bold.ttf",
    "Fascinate-Regular.ttf",
    "FiraSans-Black.ttf",
    "FjallaOne-Regular.ttf",
    "FredokaOne-Regular.ttf",
    "GemunuLibre-ExtraBold.ttf",
    "GFSArtemisia.ttf",
    "GildaDisplay-Regular.ttf",
    "HammersmithOne-Regular.ttf",
    "Heebo-Black.ttf",
    "HindGuntur-Bold.ttf",
    "Hitchcut-Regular.ttf",
    "HussarBd.otf",
    "IMFeENsc28P-Regular.ttf",
    "KumarOne-Regular.ttf",
    "Lalezar-Regular.ttf",
    "Lato-Black.ttf",
    "Lato-BlackItalic.ttf",
    "LibreFranklin-Black.ttf",
    "LibreFranklin-Bold.ttf",
    "LilitaOne-Regular.ttf",
    "Limelight-Regular.ttf",
    "LondrinaShadow-Regular.ttf",
    "Martel-Black.ttf",
    "MerriweatherSans-Bold.ttf",
    "Modak-Regular.ttf",
    "Monoton-Regular.ttf",
    "Montserrat-Black.ttf",
    "Montserrat-ExtraBold.ttf",
    "Nine0.ttf",
    "Norwester.otf",
    "OpenSans-ExtraBold.ttf",
    "Oswald-Bold.ttf",
    "PassionOne-Black.ttf",
    "PassionOne-Regular.ttf",
    "Peace-Sans.otf",
    "Pirou-Regular.otf",
    "PlayfairDisplay-Black.ttf",
    "PlayfairDisplaySC-Regular.ttf",
    "Prata-Regular.ttf",
    "Rajdhani-Bold.ttf",
    "Rakkas-Regular.ttf",
    "Raleway-Black.ttf",
    "Rokkitt-Black.ttf",
    "RozhaOne-Regular.ttf",
    "RubikMonoOne-Regular.ttf",
    "Saira-Black.ttf",
    "SairaExtraCondensed-Black.ttf",
    "SairaExtraCondensed-Bold.ttf",
    "Sancreek-Regular.ttf",
    "SixCaps-Regular.ttf",
    "SquadaOne-Regular.ttf",
    "Suezone-Regular.ttf",
    "Teko-Bold.ttf",
    "Teko-Regular.ttf",
    "TIMES.TTF",
    "TitanOne-Regular.ttf",
    "Ultra-Regular.ttf",
    "Unlock-Regular.ttf",
    "VT323-Regular.ttf",
    "Zabatana-Poster.ttf",
    "ZillaSlab-Bold.ttf"
];
nextFont.addEventListener("click", function(){
    currentFontIndex++;
    console.log("font name before-->", fonts[currentFontIndex]);
});

btnWarpText.addEventListener("click", function(){
    origin_svgElement.innerHTML = "";
    var inputedText = containTextInput.value;
    inputedText = inputedText.toUpperCase();
    origin_svgElement.setAttribute("style", "visibility:hidden");
    inputControlPoints = splitPath(2, inputedText);
    fontName = "../../fonts/"+ fonts[currentFontIndex];
    console.log("font name -->", fontName);
    words = inputedText.split(" ");
    totalCharLength = 0;
    for(let i = 0; i < words.length; i++){
        totalCharLength += words[i].length;
    }
    if(words.length > 0){
        charIndex = 0;
        wordIndex = 0;
        warpStart();
    }
});

function warpStart(){
    if (charIndex == words[wordIndex].length ) {
        wordIndex += 1;
        charIndex = 0;
    }
    if (wordIndex < words.length) {
        const promise = textToSvg(words[wordIndex][charIndex], fontName);
        promise.then(warpText);
    }
    else {
        var pathData, entirePathData = "";
        for(let i = 0; i < words.length; i++) {
            pathData = "";
            for( var j = 0; j < words[i].length; j++ ) {
                if( i == 0) {
                    pathData += origin_svgElement.children[j].getAttribute("d");
                }
                else {
                    var firstWordLength = words[0].length;
                    pathData += origin_svgElement.children[j+firstWordLength].getAttribute("d");
                }
            }
            origin_svgElement.children[i].setAttribute("d", pathData);
            entirePathData +=pathData;
        }
        origin_svgElement.children[words.length].setAttribute("d", entirePathData);
        for(let i1 = words.length + 1; i1 < totalCharLength; i1++){
            var temp_node = origin_svgElement.children[words.length + 1];
            origin_svgElement.removeChild(temp_node);
        }
        
        for( let i2 = 0; i2 < words.length; i2++ ) {
            origin_svgElement.children[i2].setAttribute("fill", colors[i2]);
        }
        var completedPathBBox = origin_svgElement.children[words.length].getBBox();
        origin_svgElement.removeChild(origin_svgElement.children[words.length]);
        origin_svgElement.setAttribute("viewBox", completedPathBBox.x +" "+ completedPathBBox.y +" "+completedPathBBox.width+" "+completedPathBBox.height);
        origin_svgElement.setAttribute("width", completedPathBBox.width+"px"); 
        origin_svgElement.setAttribute("height", completedPathBBox.height+"px"); 
        origin_svgElement.setAttribute("style", "visibility: visible");
        return;
    }
}

function warpText(svgString) {
    var svg_fromParser = new DOMParser()
        .parseFromString(svgString, "image/svg+xml")
        .getElementsByTagName("svg")[0];
    tempSvgContainer.appendChild(svg_fromParser);  //add original svg text to a html component
    var pathRect = tempSvgContainer.children[tempSvgContainer.children.length-1].children[0].getBBox();
    //setting svg's attributes
    tempSvgContainer.children[tempSvgContainer.children.length-1].setAttribute("viewBox", 0+" "+0+" "+pathRect.width+" "+pathRect.height);
    tempSvgContainer.children[tempSvgContainer.children.length-1].setAttribute("width", pathRect.width+"px");
    tempSvgContainer.children[tempSvgContainer.children.length-1].setAttribute("height", pathRect.height+"px");
    tempSvgContainer.children[tempSvgContainer.children.length-1].setAttribute("style", "overflow:visible;visibility:hidden;");
    tempSvgContainer.children[tempSvgContainer.children.length-1].setAttribute("id", "temp_svg"+charIndex);
    //get svg text path data
    var origin_path_data = svg_parse(tempSvgContainer.children[tempSvgContainer.children.length-1].children[0].getAttribute("d"));
    var translated_path_data = serialize_svg_path(translate_svg_path(origin_path_data, -pathRect.x, -pathRect.y));
    tempSvgContainer.children[tempSvgContainer.children.length-1].children[0].setAttribute("d", translated_path_data);  //set svg path's d attribute
    var temp_svg = document.getElementById("temp_svg"+charIndex);   //set id to temp svg
    // Need to interpolate first, so angles remain sharp
    const warp = new Warp(temp_svg);
    warp.interpolate( 4 );
    var controlPoints = generateControlPoints(
        pathRect.width,
        pathRect.height,
        -0.1,
        -0.1,
        inputControlPoints[wordIndex][charIndex][0].length,  //number of points on a specific side
        inputControlPoints[wordIndex][charIndex][1].length,
        inputControlPoints[wordIndex][charIndex][2].length,
        inputControlPoints[wordIndex][charIndex][3].length
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
    inputControlPoints[wordIndex][charIndex][0].forEach(value => {
        inputControlPoints_toTwoDim.push(value)
    });
    inputControlPoints[wordIndex][charIndex][1].forEach(value => {
        inputControlPoints_toTwoDim.push(value)
    });
    inputControlPoints[wordIndex][charIndex][2].forEach(value => {
        inputControlPoints_toTwoDim.push(value)
    });
    inputControlPoints[wordIndex][charIndex][3].forEach(value => {
        inputControlPoints_toTwoDim.push(value)
    });

    function mainProcess() {
        if (wordIndex < words.length ) {
            origin_svgElement.appendChild(temp_svg.children[0]);  //get path
            tempSvgContainer.removeChild(temp_svg);
            charIndex++;
            warpStart();
        }
    }
    var k = 0;
    function runThread() {
        setTimeout(()=>{
            for (let i = 0; i < inputControlPoints_toTwoDim.length; i++) {
                controlPoints[k] = inputControlPoints_toTwoDim[k];
                // drawControlPoints(controlPoints);
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
