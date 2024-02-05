// sketch.js - purpose and description here
// Author: Emily Gavilanes
// Date:2/5/24
// code from "P_4_3_2_01"

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
'use strict';

var inputText = 'All the world\'s a stage, And all the men and women merely players; They have their exits and their entrances; And one man in his time plays many parts, His acts being seven ages. At first the infant, Mewling and puking in the nurse\'s arms; Then the whining school-boy, with his satchel And shining morning face, creeping like snail Unwillingly to school. And then the lover, Sighing like furnace, with a woeful ballad Made to his mistress\' eyebrow. Then a soldier, Full of strange oaths, and bearded like the pard, Jealous in honour, sudden and quick in quarrel, Seeking the bubble reputation Even in the cannon\'s mouth. And then the justice, In fair round belly with good capon lin\'d, With eyes severe and beard of formal cut, Full of wise saws and modern instances; And so he plays his part. The sixth age shifts Into the lean and slipper\'d pantaloon, With spectacles on nose and pouch on side, His youthful hose, well sav\'d, a world too wide For his shrunk shank; and his big manly voice, Turning again toward childish treble, pipes And whistles in his sound. Last scene of all, That ends this strange eventful history, Is second childishness and mere oblivion; Sans teeth, sans eyes, sans taste, sans every thing.';
var fontSizeMax = 20;
var fontSizeMin = 10;
var spacing = 12; // line height
var kerning = 0.5; // between letters

var fontSizeStatic = false;
var blackAndWhite = false;

var img;

// New variables for image manipulation
var tileCountX = 4;
var tileCountY = 4;
var tileWidth;
var tileHeight;
var cropX;
var cropY;

var imgTiles = [];
var selectMode = true;
var randomMode = false;

function preload() {
  img = loadImage('img/pic.png');
}

function setup() {
  createCanvas(800, 600); // Adjust the canvas size accordingly
  textFont('Times');
  textSize(10);
  textAlign(LEFT, CENTER);

  // Initialize image-related variables
  tileWidth = width / tileCountY;
  tileHeight = height / tileCountX;
  imgTiles = [];

  noCursor();
  noFill();
  stroke(255);
}

function draw() {
  background(255);

  // Call the image manipulation function
  cropTiles();

  var x = 0;
  var y = 10;
  var counter = 0;

  while (y < height) {
    // Translate position (display) to position (image)
    img.loadPixels();
    // Get current color
    var imgX = round(map(x, 0, width, 0, img.width));
    var imgY = round(map(y, 0, height, 0, img.height));
    var c = color(img.get(imgX, imgY));
    var greyscale = round(red(c) * 0.222 + green(c) * 0.707 + blue(c) * 0.071);

    push();
    translate(x, y);

    if (fontSizeStatic) {
      textSize(fontSizeMax);
      if (blackAndWhite) {
        fill(greyscale);
      } else {
        fill(c);
      }
    } else {
      // Greyscale to fontsize
      var fontSize = map(greyscale, 0, 255, fontSizeMax, fontSizeMin);
      fontSize = max(fontSize, 1);
      textSize(fontSize);
      if (blackAndWhite) {
        fill(0);
      } else {
        fill(c);
      }
    }

    var letter = inputText.charAt(counter);
    text(letter, 0, 0);
    var letterWidth = textWidth(letter) + kerning;
    // For the next letter ... x + letter width
    x += letterWidth;

    pop();

    // Linebreaks
    if (x + letterWidth >= width) {
      x = 0;
      y += spacing;
    }

    counter++;
    if (counter >= inputText.length) {
      counter = 0;
    }
  }
  noLoop();
}

function cropTiles() {
  tileWidth = width / tileCountY;
  tileHeight = height / tileCountX;
  imgTiles = [];

  for (var gridY = 0; gridY < tileCountY; gridY++) {
    for (var gridX = 0; gridX < tileCountX; gridX++) {
      if (randomMode) {
        cropX = int(random(mouseX - tileWidth / 2, mouseX + tileWidth / 2));
        cropY = int(random(mouseY - tileHeight / 2, mouseY + tileHeight / 2));
      }
      cropX = constrain(cropX, 0, width - tileWidth);
      cropY = constrain(cropY, 0, height - tileHeight);
      imgTiles.push(img.get(cropX, cropY, tileWidth, tileHeight));
    }
  }
}

function mouseMoved() {
  selectMode = true;
}

function mouseReleased() {
  selectMode = false;
  cropTiles();
}

function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas(gd.timestamp(), 'png');
  if (key == '1') fontSizeStatic = !fontSizeStatic;
  if (key == '2') blackAndWhite = !blackAndWhite;
  loop();
}

function keyPressed() {
  if (keyCode == UP_ARROW) fontSizeMax += 2;
  if (keyCode == DOWN_ARROW) fontSizeMax -= 2;
  if (keyCode == RIGHT_ARROW) fontSizeMin += 2;
  if (keyCode == LEFT_ARROW) fontSizeMin -= 2;
  loop();
}
