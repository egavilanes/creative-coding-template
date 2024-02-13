// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
'use strict';

var textTyped = 'Type & Code';
var fontSizes = [];
var fontSize = 200;
var spacing = 20;
var tracking = 0;
var font;
var cursorSize = 20;
var cursorBlink = false;

function preload() {
  font = loadFont('data/FiraSansCompressed-Bold.otf');
}

function setup() {
  createCanvas(800, 600);
  frameRate(25);
  textFont(font);
  textSize(fontSize);
  noStroke();
  setupText();
}

function setupText() {
  fontSizes = new Array(textTyped.length).fill(fontSize);
}

function draw() {
  background(255);
  fill(0);
  translate(0, 200);

  var x = 0;
  var y = 0;

  for (var i = 0; i < textTyped.length; i++) {
    var letter = textTyped.charAt(i);
    var letterWidth = textWidth(letter) + tracking;

    if (x + letterWidth > width) {
      x = 0;
      y += spacing;
    }

    textSize(fontSizes[i]);
    text(letter, x, y);
    x += letterWidth;
  }

  if (cursorBlink) {
    fill(255, 0, 0);
    rect(x, y, cursorSize / 2, cursorSize / 20);
  }
}

function keyPressed() {
  if (keyCode === CONTROL) saveCanvas(gd.timestamp(), 'png');
  if (keyCode === DELETE || keyCode === BACKSPACE) {
    if (textTyped.length > 0) {
      textTyped = textTyped.substring(0, max(0, textTyped.length - 1));
      fontSizes.pop();
    }
  }
}

function keyTyped() {
  if (keyCode >= 32) {
    textTyped += key;
    fontSizes.push(fontSize);
  }
}

function mouseMoved() {
  cursorBlink = mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
}
