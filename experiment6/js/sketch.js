// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

'use strict';

var textTyped = '';
var font;

var shapeSpace;
var shapeSpace2;
var shapePeriod;
var shapeComma;
var shapeQuestionmark;
var shapeExclamationmark;
var shapeReturn;
var shapes = [];

var centerX;
var centerY;
var offsetX;
var offsetY;
var zoom;

var actRandomSeed;

var rotationSpeed = 0.001; // Adjust rotation speed
var lastShapeAdded = 0; // Variable to track last time a shape was added
var shapeAddInterval = 1000; 
var letterCount = 0; // Counter to track letter positions
var direction = 1; 
var lastDirectionChange = 0; 
var directionChangeInterval = 10;

var scaleDirection = 1; // Direction to scale the images
var lastScaleChange = 0; 

var scaleChangeInterval = 3000;
function preload() {
  font = loadFont('data/miso-bold.ttf');
  shapeSpace = loadImage('data/space.svg');
  shapeSpace2 = loadImage('data/space2.svg');
  shapePeriod = loadImage('data/period.svg');
  shapeComma = loadImage('data/comma.svg');
  shapeExclamationmark = loadImage('data/exclamationmark.svg');
  shapeQuestionmark = loadImage('data/questionmark.svg');
  shapeReturn = loadImage('data/return.svg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  textTyped += 'Hello, world!\n';
  textTyped += 'Please be happy and live a nice life\n';
  textTyped += 'It is so much fun being able to hang out\n';

  centerX = width / 2;
  centerY = height / 2;
  offsetX = 0;
  offsetY = 0;
  zoom = 0.75;

  actRandomSeed = 6;

  cursor(HAND);
  textFont(font, 25);
  textAlign(LEFT, BASELINE);
  noStroke();
  fill(0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);

  // Incremental rotation
  translate(centerX, centerY);
  rotate(frameCount * rotationSpeed); // Adjust rotation speed

  // Calculate elapsed time since the last shape was added
  var elapsedTime = millis() - lastShapeAdded;

  // Add a new shape every second
  if (elapsedTime > shapeAddInterval) {
    addNewShape();
    lastShapeAdded = millis(); // Update last shape added time
  }

  // Allways produce the same sequence of random numbers
  randomSeed(actRandomSeed);

  // Draw text and shapes
  translate(-centerX, -centerY);
  translate(centerX, centerY);
  scale(zoom);

  // Change scale every 3 seconds
  if (millis() - lastScaleChange > scaleChangeInterval) {
    scaleDirection *= -1; // Change scale direction
    lastScaleChange = millis(); // Update last scale change time
  }

  for (var i = 0; i < textTyped.length; i++) {
    var letter = textTyped.charAt(i);
    var letterWidth = textWidth(letter);

    // ------ Letter rule table ------
    switch (letter) {
      case ' ':
        var dir = floor(random(0, 2));
        if (dir == 0) {
          image(shapeSpace, 1, -15);
          translate(4, 1);
          rotate(QUARTER_PI);
        }
        if (dir == 1) {
          image(shapeSpace2, 1, -15);
          translate(14, -5);
          rotate(-QUARTER_PI);
        }
        break;

      case ',':
        image(shapeComma, 1, -15);
        translate(35, 15);
        rotate(QUARTER_PI);
        break;

      case '.':
        image(shapePeriod, 1, -55);
        translate(56, -56);
        rotate(-HALF_PI);
        break;

      case '!':
        image(shapeExclamationmark, 1, -27);
        translate(42.5, -17.5);
        rotate(-QUARTER_PI);
        break;

      case '?':
        image(shapeQuestionmark, 1, -27);
        translate(42.5, -17.5);
        rotate(-QUARTER_PI);
        break;

      case '\n':
        image(shapeReturn, 1, -15);
        translate(1, 10);
        rotate(PI);
        break;

      default:
        // Scale the images
        push();
        scale(1 + scaleDirection * 0.1); // Adjust the scale factor as needed
        text(letter, 0, 0);
        translate(letterWidth, 0);
        pop();
    }

    // Check if it's time to change direction
    if (letterCount >= directionChangeInterval) {
      direction *= -1; // Change direction
      letterCount = 0; // Reset letter count
      lastDirectionChange = millis(); // Update last direction change time
    }
    letterCount++;
  }

  // Blink cursor after text
  if (frameCount / 6 % 2 == 0) rect(0, 0, 15, 2);
}

function mousePressed() {
  offsetX = mouseX - centerX;
  offsetY = mouseY - centerY;
}

function keyReleased() {
  // Export png
  if (keyCode == CONTROL) saveCanvas(gd.timestamp(), 'png');
  if (keyCode == ALT) actRandomSeed++;
}

function keyPressed() {
  switch (keyCode) {
    case DELETE:
    case BACKSPACE:
      textTyped = textTyped.substring(0, max(0, textTyped.length - 1));
      break;
    case ENTER:
    case RETURN:
      // Enable linebreaks
      textTyped += '\n';
      break;
    case UP_ARROW:
      zoom += 0.05;
      break;
    case DOWN_ARROW:
      zoom -= 0.05;
      break;
  }
}

function keyTyped() {
  if (keyCode >= 32) {
    textTyped += key;
  }
}

function addNewShape() {
  // Add a new shape to the text
  var newShapeIndex = int(random(0, 6));
  switch (newShapeIndex) {
    case 0:
      textTyped += ' ';
      break;
    case 1:
      textTyped += ',';
      break;
    case 2:
      textTyped += '.';
      break;
    case 3:
      textTyped += '!';
      break;
    case 4:
      textTyped += '?';
      break;
    case 5:
      textTyped += '\n';
      break;
  }
}
  






