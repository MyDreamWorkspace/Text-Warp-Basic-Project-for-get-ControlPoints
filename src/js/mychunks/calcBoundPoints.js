const calcBoundPoint = (pointsNum, boundSvg) =>{
    let parser = new DOMParser();
    let leftPath = parser.parseFromString(boundSvg, "image/svg+xml").getElementById("left");
    let rightPath = parser.parseFromString(boundSvg, "image/svg+xml").getElementById("right");
    let topPath = parser.parseFromString(boundSvg, "image/svg+xml").getElementById("top");
    let bottomPath = parser.parseFromString(boundSvg, "image/svg+xml").getElementById("bottom");
    const pathBBox = leftPath.getBBox();
    console.log("pathBox", leftPath, pathBBox.x, pathBBox.y);
    let leftPathlength = leftPath.getTotalLength();
    let bottomPathlength = bottomPath.getTotalLength();
    let rightPathlength = rightPath.getTotalLength();
    let topPathlength = topPath.getTotalLength();
}
export default calcBoundPoint
