var express = require("express")

var app = express();

//request body contains text, font, controlpoints array
app.post("/warpText", function(req, res){
  if(!req.body.text || !req.body.font || !req.body.wrapperSvg){
    return res.send("Bad request");
  }

});
