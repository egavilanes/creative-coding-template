// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
'use strict';

var tileCount = 20;
var actRandomSeed = 0;

var lineModuleSize = 0;
var angle = 0;
var angleSpeed = 1;
var lineModule = [];
var lineModuleIndex = 0;

var clickPosX = 0;
var clickPosY = 0;

function preload() {
  lineModule[1] = loadImage('data/02.svg');
  lineModule[2] = loadImage('data/03.svg');
  lineModule[3] = loadImage('data/04.svg');
  lineModule[4] = loadImage('data/05.svg');
}

function setup() {
  createCanvas(600, 600);
  background(255);
  strokeWeight(0.75);
}

function draw() {
  translate(width / tileCount / 2, height / tileCount / 2);

  background(255);

  randomSeed(actRandomSeed);

  for (var gridY = 0; gridY < tileCount; gridY++) {
    for (var gridX = 0; gridX < tileCount; gridX++) {

      var posX = width / tileCount * gridX;
      var posY = height / tileCount * gridY;

      if (mouseX >= posX && mouseX < posX + width / tileCount && mouseY >= posY && mouseY < posY + height / tileCount) {
        // Mouse is within the current grid cell
        updateLineModule(gridX, gridY);
      }
    }
  }

  // Draw the line module
  var x = mouseX;
  var y = mouseY;

  push();
  translate(x, y);
  rotate(radians(angle));
  if (lineModuleIndex != 0) {
    tint(181, 157, 0); // Use a default color, you can customize this
    image(lineModule[lineModuleIndex], 0, 0, lineModuleSize, lineModuleSize);
  } else {
    stroke(181, 157, 0); // Use a default color, you can customize this
    line(0, 0, lineModuleSize, lineModuleSize);
  }
  angle += angleSpeed;
  pop();
}

function updateLineModule(gridX, gridY) {
  // Update the line module based on the grid position
  lineModuleIndex = (gridX + gridY) % 5; // You can customize this logic based on your needs
  lineModuleSize = random(50, 160); // You can customize the size range
}

function mousePressed() {
  actRandomSeed = random(100000);
}

