// sketch.js - original peice with generative methods
// Author: Emily Gavilanes
// Date: 1/29/2024
// inspired by code from "P_2_1_3_05", "p_2_1_5_03", chatGPT, and p5.js resource library

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}


'use strict';

var shapes = [];
var density = 2.5;
var shapeHeight = 64;
var shapeColor;

var newShape;

// setup() function is called once when the program starts
function setup() {
  createCanvas(800, 800);
  noFill();
  shapeColor = color(0);
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(255);

  shapes.forEach(function (shape) {
    shape.draw();
  });

  if (newShape) {
    newShape.x2 = mouseX;
    newShape.y2 = mouseY;
    newShape.h = shapeHeight;
    newShape.c = shapeColor;
    newShape.draw();
  }

  if (mouseIsPressed && mouseButton == LEFT) {
    push();
    translate(width / 2, height / 2);

    var circleResolution = int(map(mouseY + 100, 0, height, 2, 10));
    var radius = mouseX - width / 2;
    var angle = TAU / circleResolution;

    beginShape();
    for (var i = 0; i <= circleResolution; i++) {
      var x = cos(angle * i) * radius;
      var y = sin(angle * i) * radius;
      vertex(x, y);
    }
    endShape();

    pop();
  }
}

function Shape(x1, y1, x2, y2, h, c) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.h = h;
  this.c = c;

  Shape.prototype.draw = function () {
    var w = dist(this.x1, this.y1, this.x2, this.y2);
    var a = atan2(this.y2 - this.y1, this.x2 - this.x1);
    stroke(this.c);
    push();
    translate(this.x1, this.y1);
    rotate(a);
    translate(0, -this.h / 2);

    // Draw grid
    var tileWidth = w / VALUE1; // Adjust this based on your requirements
    for (var i = 0; i < VALUE1; i++) {
      for (var j = 0; j < VALUE2; j++) {
        var posY = map(j, 0, VALUE2 - 1, 0, this.h);
        line(0, posY, w, posY);
      }
      var posX = map(i, 0, VALUE1 - 1, 0, w);
      line(posX, 0, posX, this.h);
    }

    pop();
  };
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
  // code to run when mouse is pressed
  newShape = new Shape(pmouseX, pmouseY, mouseX, mouseY, shapeHeight, shapeColor);
}

function mouseReleased() {
  shapes.push(newShape);
  newShape = undefined;
}

function keyPressed() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');

  if (key == '1') shapeColor = color(255, 0, 0);
  if (key == '2') shapeColor = color(0, 255, 0);
  if (key == '3') shapeColor = color(0, 0, 255);
  if (key == '4') shapeColor = color(0);

  if (keyCode == UP_ARROW) shapeHeight += density;
  if (keyCode == DOWN_ARROW) shapeHeight -= density;
}





