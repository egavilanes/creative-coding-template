// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
'use strict';

var font;
var fontSize = 120;
var myAnimatedText;

var textTyped = 'TYPE & CODE';
var drawMode = 1;
var padding = 10;
var nOff = 0;
var pointDensity = 8;
var colors;

var paths;
var textImg;

function preload() {
  font = loadFont('data/FreeSans.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  noCursor();
  imageMode(CENTER);
  rectMode(CENTER);
  frameRate(25);

  myAnimatedText = new animatedType();
  myAnimatedText.textTyped.push(myAnimatedText.addText('TYPE!'));
  myAnimatedText.textTyped.push(myAnimatedText.addText('CODE!'));

  colors = [color(65, 105, 185), color(245, 95, 80), color(15, 233, 118)];

  opentype.load('data/FreeSans.otf', function(err, f) {
    if (err) {
      print('Font could not be loaded: ' + err);
    } else {
      font = f;
      loop();
    }
  });

  setupText();
}

function setupText() {
  textImg = createGraphics(width, height);
  textImg.pixelDensity(1);
  textImg.background(255);
  textImg.textFont(font);
  textImg.textSize(fontSize);
  textImg.text(textTyped, 100, fontSize + 50);
  textImg.loadPixels();
}

function draw() {
  background(255);

  nOff++;

  for (var x = 0; x < textImg.width; x += pointDensity) {
    for (var y = 0; y < textImg.height; y += pointDensity) {
      var index = (x + y * textImg.width) * 4;
      var r = textImg.pixels[index];

      if (r < 128) {
        if (drawMode == 1) {
          strokeWeight(1);
          var noiseFac = map(mouseX, 0, width, 0, 1);
          var lengthFac = map(mouseY, 0, height, 0.01, 1);
          var num = noise((x + nOff) * noiseFac, y * noiseFac);
          if (num < 0.6) {
            stroke(colors[0]);
          } else if (num < 0.7) {
            stroke(colors[1]);
          } else {
            stroke(colors[2]);
          }
          push();
          translate(x, y);
          rotate(radians(frameCount));
          line(0, 0, fontSize * lengthFac, 0);
          pop();
        }
      }
    }
  }

  translate(20, 150);
  fill(0);

  myAnimatedText.getLineCount();
  myAnimatedText.getPaths();
  myAnimatedText.getIndividualPaths();
  myAnimatedText.getCoordinates();

  if (myAnimatedText.drawMode == 1) {
    myAnimatedText.animatedPoints('ellipse');
  }
  if (myAnimatedText.drawMode == 2) {
    myAnimatedText.animatedPoints('rect');
  }
  if (myAnimatedText.drawMode == 3) {
    myAnimatedText.lines2mouse();
  }
  if (myAnimatedText.drawMode == 4) {
    myAnimatedText.radialLines();
  }
}

function keyPressed() {
  if (keyCode === CONTROL) saveCanvas(gd.timestamp(), 'png');

  if (keyCode === DELETE || keyCode === BACKSPACE) {
    textTyped = textTyped.substring(0, max(0, textTyped.length - 1));
    setupText();
  }
  if (keyCode === ENTER || keyCode === RETURN) {
    textTyped += '\n';
    setupText();
  }
  if (keyCode === LEFT_ARROW) {
    drawMode--;
    if (drawMode < 1) drawMode = 4;
  }
  if (keyCode === RIGHT_ARROW) {
    drawMode++;
    if (drawMode > 4) drawMode = 1;
  }
  if (keyCode === DOWN_ARROW) {
    pointDensity--;
    if (pointDensity < 4) pointDensity = 4;
  }
  if (keyCode === UP_ARROW) {
    pointDensity++;
  }

}

function keyTyped() {
  if (keyCode >= 32){
    textTyped += key;
    setupText();
  }
}

function animatedType() {
  var that = this;
  that.textTyped = [];
  that.paths = [];
  that.individualPaths = [];
  that.ranges = [];
  that.lineCount = 0;
  that.letterCoordinates = [];
  that.pointDensity = 2;
  that.startX = 0;
  that.colors = [color(65, 105, 185), color(245, 95, 80), color(15, 233, 118), color(233, 15, 130), color(118, 15, 233), color(15, 233, 118)];
  that.angle = 0;
  that.drawMode = 8;
  that.style = 1;

  this.getLineCount = function(){
    if (that.textTyped.length > 0){
      that.lineCount = that.textTyped.length - 1;
    } else {
      that.lineCount = 0;
    }
  };

  this.addText = function(_text){
    var textObject = {counter: 0, text: _text};
    return textObject;
  };

  this.getPaths = function(){
    that.paths = [];
    that.textTyped.forEach(function(txt, lineNum){
      if (txt.text.length > 0){
        var fontPath = font.getPath(txt.text, 0, 0, fontSize);
        var path = new g.Path(fontPath.commands);
        path = g.resampleByLength(path, that.pointDensity);
        var pathData = {
          data: path,
          lineNumber: lineNum,
          len: path.commands.length,
          breaks: floor(path.commands.length / txt.text.length),
          ranges: []
        };
        for (var i = 0; i < pathData.len - 1; i += pathData.breaks){
          pathData.ranges.push(floor(i));
        }
        that.paths.push(pathData);
      }
    });
  };

  this.getIndividualPaths = function(){
    that.individualPaths = [];
    that.textTyped.forEach(function(txt, lineNum){
      if (txt.text.length > 0){
        txt.text.split('').forEach(function(d){
          var fontPath = font.getPath(d, 0, 0, fontSize);
          var path = new g.Path(fontPath.commands);
          path = g.resampleByLength(path, that.pointDensity);
          var pathData = {
            data: path,
            lineNumber: lineNum,
            len: path.commands.length,
            bbox: fontPath.getBoundingBox(),
            distX: 0,
            startX: 0
          };
          pathData.distX = ceil(dist(pathData.bbox.x1, 0, pathData.bbox.x2, 0));
          that.individualPaths.push(pathData);
        });
      }
    });
    that.startX = 0;
    for (var i = 0; i < that.individualPaths.length - 1; i++){
      if (that.individualPaths[i].lineNumber === that.individualPaths[i + 1].lineNumber){
        that.individualPaths[i].startX = that.startX;
        that.startX += that.individualPaths[i].distX + 15;
      } else {
        that.individualPaths[i].startX = that.startX;
        that.startX = 0;
      }
      if (i == that.individualPaths.length - 2){
        that.individualPaths[i + 1].startX = that.startX;
      }
    }
  };

  this.getCoordinates = function(){
    that.coordinates = [];
    that.paths.forEach(function(path, idx){
      path.data.commands.forEach(function(coord){
        if (coord.x != undefined && coord.y != undefined){
          var yOffset = path.lineNumber * fontSize;
          that.coordinates.push({x: coord.x, y: coord.y + yOffset});
        }
      });
    });
  };

  this.animatedPoints = function(_shape){
    that.paths.forEach(function(path, idx){
      fill(that.colors[path.lineNumber]);
      stroke(that.colors[path.lineNumber]);
      path.ranges.forEach(function(d){
        var cmd = path.data.commands[that.textTyped[idx].counter + d];
        if (cmd != undefined){
          if (that.textTyped[idx].counter < path.breaks){
            var yOffset = path.lineNumber * fontSize;
            if (_shape == 'ellipse'){
              ellipse(cmd.x, cmd.y + yOffset, fontSize * 0.10, fontSize * 0.10);
            } else if (_shape == 'rect'){
              rect(cmd.x, cmd.y + yOffset, fontSize * 0.10, fontSize * 0.10);
            }
            that.textTyped[idx].counter++;
          } else {
            that.textTyped[idx].counter = 0;
          }
        }
      });
    });
  };

  this.lines2mouse = function(){
    stroke(that.colors[0]);
    that.coordinates.forEach(function(coords){
      strokeWeight(1);
      line(coords.x + map(mouseX, 0, width, -100, 100), coords.y + map(mouseY, 0, height, -100, 100), coords.x, coords.y);
    });
  };

  this.radialLines = function(){
    stroke(that.colors[0]);
    that.coordinates.forEach(function(coords){
      strokeWeight(1);
      for (var i = 0; i < 360; i += 60){
        var angle = radians(i);
        var radiusDistanceX = map(mouseX, 0, width, 0, random(20));
        var radiusDistanceY = map(mouseY, 0, width, 0, random(20));
        var ptX = cos(angle) * radiusDistanceX + coords.x;
        var ptY = sin(angle) * radiusDistanceY + coords.y;
        line(ptX, ptY, coords.x, coords.y);
      }
    });
  };
}
