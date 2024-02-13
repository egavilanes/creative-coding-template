// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
'use strict';

var textTyped = 'DO NOT DISTURB';
var fontSizes = [];
var minFontSize = 15;
var maxFontSize = 800;
var newFontSize = 0;

var pMillis = 0;
var maxTimeDelta = 5000.0;

var spacing = 2; // line height
var tracking = 0; // between letters
var font;

var colors;
var paths;
var textImg;
var nOff = 0;
var pointDensity = 8;

var drawMode = 1;
var fontSize = 200;

function setup() {
  createCanvas(2000, 800);
  frameRate(25);
  rectMode(CENTER);
  font = 'Arial';

  colors = [color(65, 105, 185), color(245, 95, 80), color(15, 233, 118)];
  pixelDensity(1);

  noCursor();
  noStroke();

  // Initialize fontSizes
  for (var i = 0; i < textTyped.length; i++) {
    fontSizes[i] = minFontSize;
  }

  setupText();
}

function setupText() {
  // create an offscreen graphics object to draw the text into
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
          drawMode1(x, y);
        } else if (drawMode == 2) {
          drawMode2(x, y);
        } else if (drawMode == 3) {
          drawMode3(x, y);
        } else if (drawMode == 4) {
          drawMode4(x, y);
        }
      }
    }
  }

  drawText();
}

function drawText() {
  textAlign(LEFT);
  fill(0);

  spacing = map(mouseY, 0, height, 0, 120);
  translate(0, 200 + spacing);

  var x = 0;
  var y = 0;
  var fontSize = 20;

  for (var i = 0; i < textTyped.length; i++) {
    fontSize = fontSizes[i];
    textFont(font, fontSize);
    var letter = textTyped.charAt(i);
    var letterWidth = textWidth(letter) + tracking;

    if (x + letterWidth > width) {
      x = 0;
      y += spacing;
    }

    text(letter, x, y);
    x += letterWidth;
  }

  var timeDelta = millis() - pMillis;
  newFontSize = map(timeDelta, 0, maxTimeDelta, minFontSize, maxFontSize);
  newFontSize = min(newFontSize, maxFontSize);

  fill(200, 30, 40);
  if (int(frameCount / 10) % 2 == 0) fill(255);
  rect(x, y, newFontSize / 2, newFontSize / 20);
}

function drawMode1(x, y) {
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

function drawMode2(x, y) {
  stroke(0, 0, 0);
  strokeWeight(1);
  noStroke();
  push();
  translate(x, y);

  var num = noise((x + nOff) / 10, y / 10);

  if (num < 0.6) {
    fill(colors[0]);
  } else if (num < 0.7) {
    fill(colors[1]);
  } else {
    fill(colors[2]);
  }

  var w = noise((x - nOff) / 10, (y + nOff * 0.1) / 10) * 20;
  var h = noise((x - nOff) / 10, (y + nOff * 0.1) / 10) * 10;
  ellipse(0, 0, w, h);
  pop();
}

function drawMode3(x, y) {
  stroke(0, 0, 0);
  strokeWeight(1);
  noStroke();

  var num = random(1);

  if (num < 0.6) {
    fill(colors[0]);
  } else if (num < 0.7) {
    fill(colors[1]);
  } else {
    fill(colors[2]);
  }

  push();
  beginShape();
  for (var i = 0; i < 3; i++) {
    var ox = (noise((i * 1000 + x - nOff) / 30, (i * 3000 + y + nOff) / 30) - 0.5) * pointDensity * 6;
    var oy = (noise((i * 2000 + x - nOff) / 30, (i * 4000 + y + nOff) / 30) - 0.5) * pointDensity * 6;
    vertex(x + ox, y + oy);
  }
  endShape(CLOSE);
  pop();
}

function drawMode4(x, y) {
  stroke(colors[0]);
  strokeWeight(3);

  point(x - 10, y - 10);
  point(x, y);
  point(x + 10, y + 10);

  for (var i = 0; i < 5; i++) {
    if (i == 1) {
      stroke(colors[1]);
    } else if (i == 3) {
      stroke(colors[2]);
    }

    if (i % 2 == 0) {
      var ox = noise((10000 + i * 100 + x - nOff) / 10) * 10;
      var oy = noise((20000 + i * 100 + x - nOff) / 10) * 10;
      point(x + ox, y + oy);
    } else {
      var ox = noise((30000 + i * 100 + x - nOff) / 10) * 10;
      var oy = noise((40000 + i * 100 + x - nOff) / 10) * 10;
      point(x - ox, y - oy);
    }
  }
}

function keyPressed() {
  if (keyCode === CONTROL) saveCanvas(gd.timestamp(), 'png');

  if (keyCode === DELETE || keyCode === BACKSPACE) {
    if (textTyped.length > 0) {
      textTyped = textTyped.substring(0, max(0, textTyped.length - 1));
      fontSizes.pop();
      setupText();
    }
  }
  if (keyCode === ENTER || keyCode === RETURN) {
    textTyped += '\n';
    fontSizes.push(newFontSize);
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
  if (keyCode >= 32) {
    textTyped += key;
    fontSizes.push(newFontSize);
    setupText();
  }
}

