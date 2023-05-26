//none use, original source code
var __width = 2000;
var __height = 2000;
var canvas = d3.select("body").append("canvas")
  .attr("width", __width)
  .attr("height", __height);
var context = canvas.node().getContext("2d");
var __interval = 1;
var __patterns = [
    {
        path: "M 18.9 576.7 c 0 0 63.9 -72.9 117.8 -79.6 c 0 0 205.2 -34.6 301.7 -104.8 c 0 0 111 -74.7 183.9 -259.7 c 0 0 29.2 -35.9 65 -20.2 c 0 0 121.1 48.2 191.8 21.3 c 0 0 52.7 -14.6 67.3 -12.3 c 0 0 -19.1 88.6 -21.3 149.2 c 0 0 5.6 133.5 38.1 187.3 c 0 0 47.1 163.7 41.5 180.6 c 0 0 -31.4 29.2 -274.8 23.6 c 0 0 -252.3 2.6 -291.6 0.7 C 438.3 662.6 190.5 656.3 18.9 576.7 Z",
        z1: 840,
        z2: 1120,
        z3: 1660,
        z4: 2660,
        rz: [[200], [200, 840]]
    },
    {
        path: "M 52.2 428.3 c 0 0 10.1 -32.4 103.8 -63.4 c 0 0 -5 -1.4 137.7 -36.8 c 0 0 152.1 -50.5 292.7 -100.9 c 0 0 31.7 -15.9 56.2 20.9 c 0 0 58.4 113.9 167.3 100.2 c 0 0 64.2 -7.9 102.4 -50.5 c 0 0 60.6 99.5 58.4 169.4 c 0 0 27.4 12.3 -196.8 7.9 c 0 0 -325.9 3.3 -346.1 0.9 C 427.8 476.1 145.9 472.3 52.2 428.3 Z",
        z1: 600,
        z2: 980,
        z3: 1160,
        z4: 2060,
        rz: [[200], [200, 600]]
    }
];
var bezier = function(t, p0, p1, p2, p3){
    var cX = 3 * (p1.x - p0.x),
      bX = 3 * (p2.x - p1.x) - cX,
      aX = p3.x - p0.x - cX - bX;

    var cY = 3 * (p1.y - p0.y),
      bY = 3 * (p2.y - p1.y) - cY,
      aY = p3.y - p0.y - cY - bY;

    var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
    var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;

    return {x: x, y: y};
};

var drawBezier = function(p0, p1, p2, p3){
    // console.log(p0, p1, p2, p3);
    var points = [];
    var accuracy = 0.01;
    // context.beginPath();
    // context.strokeStyle = "#000";
    // context.line__width = 3;
    points.push(p0);
    context.moveTo(p0.x, p0.y);
    for (var i = 0; i < 1; i += accuracy){
        var p = bezier(i, p0, p1, p2, p3);
        // context.lineTo(p.x, p.y);
        points.push(p);
    }
    points.push(p3);
    // context.stroke()

    context.beginPath();
    context.arc(p1.x, p1.y, 10, 0, 2 * Math.PI);
    context.fill();
    context.beginPath();
    context.arc(p2.x, p2.y, 10, 0, 2 * Math.PI);
    context.fill();

    return points;
}

var drawPoints = function(points, color) {
    context.fillStyle = color;
    for (var i = 0; i < points.length; i ++)
    {
        context.beginPath();
        context.arc(points[i].x, points[i].y, 3, 0, 2 * Math.PI);
        context.fill();
        context.font = '10px serif';
        context.fillText('' + i/* + ', ' + points[i].x + ', ' + points[i].y*/, points[i].x, points[i].y);
    }
}
var distance = function (p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

var drawSameDistancePoints = function(points, color, dis) {
    var arr = [];
    context.fillStyle = color;
    for (var i = 0; i < points.length; i ++)
    {
        if (i > 0)
        {
            if (distance(points[i], prev) < dis)
                continue;
        }
        context.beginPath();
        context.arc(points[i].x, points[i].y, 3, 0, 2 * Math.PI);
        context.fill();
        context.font = '10px serif';
        context.fillText('' + i/* + ', ' + points[i].x + ', ' + points[i].y*/, points[i].x, points[i].y);
        arr.push([points[i].x, points[i].y]);
        prev = points[i];
    }
    return arr;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

var drawSvgOriginalPath = function(shape)
{
    var properties = spp.svgPathProperties(__patterns[shape].path);
    var length = properties.getTotalLength();
    var points = [];
    for (var i = 0; i < length; i += 20)
    {
        points.push(properties.getPointAtLength(i));
    }
    drawPoints(points, "#000");
}

var drawSvgPath = function(shape, rows)
{
    var properties = spp.svgPathProperties(__patterns[shape].path);
    var length = properties.getTotalLength();
    var z1 = __patterns[shape].z1, z2 = __patterns[shape].z2, z3 = __patterns[shape].z3, z4 = __patterns[shape].z4;
    z1 += getRandomInt(-30, 30)
    var rects = [];
    var startPoints = [0], endPoints = [z3];
    for (var i = 1; i <  rows; i ++)
    {
        startPoints.push((i * z1 / rows) + getRandomInt(-50, 250));
    }
    startPoints.push(z1);

    for (var i = 1; i <  rows; i ++)
    {
        endPoints.push((z3 - i * (z3 - z2) / rows) + getRandomInt(-100, 200));
    }
    endPoints.push(z2);

    for (var i = 0; i < rows; i ++)
    {
        rects.push({
            lb: startPoints[i],
            lt: startPoints[i + 1],
            rt: endPoints[i + 1],
            rb: endPoints[i]
        });
        var p0 = properties.getPointAtLength(rects[i].lt);
        var p3 = properties.getPointAtLength(rects[i].rt);
        var p1 = {x: p0.x * 0.75 + p3.x * 0.25, y: p0.y * 0.75 + p3.y * 0.25};
        var p2 = {x: p0.x * 0.25 + p3.x * 0.75, y: p0.y * 0.25 + p3.y * 0.75};
        p1.x += getRandomInt(-100, 150);
        p1.y += getRandomInt(-100, 150);
        p2.x += getRandomInt(-100, 150);
        p2.y += getRandomInt(-100, 150);
        rects[i].t1 = p1;
        rects[i].t2 = p2;
        if (i == 0)
        {
            p0 = properties.getPointAtLength(rects[i].rb);
            p3 = properties.getPointAtLength(rects[i].lb);
            p1 = {x: p0.x * 0.75 + p3.x * 0.25, y: p0.y * 0.75 + p3.y * 0.25};
            p2 = {x: p0.x * 0.25 + p3.x * 0.75, y: p0.y * 0.25 + p3.y * 0.75};
            p1.x += getRandomInt(-100, 150);
            p1.y += getRandomInt(-100, 150);
            p2.x += getRandomInt(-100, 150);
            p2.y += getRandomInt(-100, 150);
            rects[i].b1 = p1;
            rects[i].b2 = p2;
        }
        else
        {
            rects[i].b1 = rects[i - 1].t1;
            rects[i].b2 = rects[i - 1].t2;
        }
    }

    var totalPaths = [];
    for (var i = rects.length - 1; i >= 0; i --)
    {
        var result = [];
        var points = [];
        var real_lt = __patterns[shape].rz[rows - 1][i];
        real_lt += getRandomInt(-50, 150);
        for (var j = real_lt/*rects[i].lt*/; j >= rects[i].lb; j -= __interval)
        {
            points.push(properties.getPointAtLength(j));
        }
        result.push(drawSameDistancePoints(points, "#f00", 10));

        points = [];
        if (i == 0)
        {
            for (var j = z4; j >= rects[i].rb; j -= __interval)
            {
                points.push(properties.getPointAtLength(j));
            }
        }
        else
        {
            var p0 = properties.getPointAtLength(rects[i].rb);
            var p3 = properties.getPointAtLength(rects[i].lb);
            points = drawBezier(p0, rects[i].b1, rects[i].b2, p3);
            points.reverse();
        }
        result.push(drawSameDistancePoints(points, "#0f0", 10));

        points = [];
        for (var j = rects[i].rb; j >= rects[i].rt; j -= __interval)
        {
            points.push(properties.getPointAtLength(j));
        }
        result.push(drawSameDistancePoints(points, "#00f", 10));

        points = [];
        if (i == rows - 1)
        {
            for (var j = rects[i].rt; j >= real_lt; j -= __interval)
            {
                points.push(properties.getPointAtLength(j));
            }
        }
        else
        {
            var p0 = properties.getPointAtLength(rects[i].rt);
            var p3 = properties.getPointAtLength(rects[i].lt);
            points = drawBezier(p0, rects[i].t1, rects[i].t2, p3);
            for (var j = rects[i].lt; j >= real_lt; j -= __interval)
            {
                points.push(properties.getPointAtLength(j));
            }
        }
        result.push(drawSameDistancePoints(points, "#000", 10));
        totalPaths.push(result);
    }
    return totalPaths;
}
