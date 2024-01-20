// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
'use strict';

var c;
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
  createCanvas(windowWidth, windowHeight);
  background(255);
  cursor(CROSS);
  strokeWeight(0.75);

  c = color(181, 157, 0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  if (mouseIsPressed && mouseButton == LEFT) {
    var x = mouseX;
    var y = mouseY;
    if (keyIsPressed && keyCode == SHIFT) {
      if (abs(clickPosX - x) > abs(clickPosY - y)) {
        y = clickPosY;
      } else {
        x = clickPosX;
      }
    }

    push();
    translate(x, y);
    rotate(radians(angle));
    if (lineModuleIndex != 0) {
      tint(c);
      image(lineModule[lineModuleIndex], 0, 0, lineModuleSize, lineModuleSize);
    } else {
      stroke(c);
      line(0, 0, lineModuleSize, lineModuleSize);
    }
    angle += angleSpeed;
    pop();
  }
}

function mousePressed() {
  // create a new random color and line length
  lineModuleSize = random(50, 160);

  // remember click position
  clickPosX = mouseX;
  clickPosY = mouseY;
}

function keyPressed() {
  if (keyCode == UP_ARROW) lineModuleSize += 5;
  if (keyCode == DOWN_ARROW) lineModuleSize -= 5;
  if (keyCode == LEFT_ARROW) angleSpeed -= 0.5;
  if (keyCode == RIGHT_ARROW) angleSpeed += 0.5;
}

function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
  if (keyCode == DELETE || keyCode == BACKSPACE) background(255);

  // reverse direction and mirror angle
  if (key == 'd' || key == 'D') {
    angle += 180;
    angleSpeed *= -1;
  }

  // change color
  if (key == ' ') c = color(random(255), random(255), random(255), random(80, 100));
  // default colors from 1 to 4
  if (key == '1') c = color(181, 157, 0);
  if (key == '2') c = color(0, 130, 164);
  if (key == '3') c = color(87, 35, 129);
  if (key == '4') c = color(197, 0, 123);

  // load svg for line module
  if (key == '5') lineModuleIndex = 0;
  if (key == '6') lineModuleIndex = 1;
  if (key == '7') lineModuleIndex = 2;
  if (key == '8') lineModuleIndex = 3;
  if (key == '9') lineModuleIndex = 4;
}