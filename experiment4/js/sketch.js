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
var useOriginalColors = true;
var img;
var lastFontSizeChange = 0;
var lastRotationChange = 0;
var lastColorChange = 0;
var fontSizeChangeInterval = 2000; // 2 seconds
var rotationChangeInterval = 2000; // 2 seconds
var colorChangeInterval = 1000; // 1 second

function preload() {
  img = loadImage('img/pic.png');
}

function setup() {
  createCanvas(533, 796);
  textFont('Times');
  textSize(10);
  textAlign(LEFT, CENTER);
  print(img.width + ' • ' + img.height);
}

function draw() {
  background(255);

  var x = 0;
  var y = 10;
  var counter = 0;

  while (y < height) {
    // translate position (display) to position (image)
    img.loadPixels();
    // get current color
    var imgX = round(map(x, 0, width, 0, img.width));
    var imgY = round(map(y, 0, height, 0, img.height));
    var c = color(img.get(imgX, imgY));
    var greyscale = round(red(c) * 0.222 + green(c) * 0.707 + blue(c) * 0.071);

    push();
    translate(x, y);

    if (fontSizeStatic) {
      textSize(fontSizeMax);
      if (useOriginalColors) {
        fill(c);
      } else {
        fill(greyscale);
      }
    } else {
      // greyscale to fontsize
      var fontSize = map(greyscale, 0, 255, fontSizeMax, fontSizeMin);
      fontSize = max(fontSize, 1);
      textSize(fontSize);
      if (useOriginalColors) {
        fill(c);
      } else {
        fill(greyscale);
      }
    }

    // Randomly rotate the words
    if (millis() - lastRotationChange >= rotationChangeInterval) {
      lastRotationChange = millis();
      rotate(random(-PI / 4, PI / 4)); // Adjust the rotation angle as needed
    }

    var word = inputText.split(' ')[counter];
    text(word, 0, 0);
    var wordWidth = textWidth(word) + kerning;
    // for the next word ... x + word width
    x += wordWidth;

    pop();

    // linebreaks
    if (x + wordWidth >= width) {
      x = 0;
      y += spacing;
    }

    counter++;
    if (counter >= inputText.split(' ').length) {
      counter = 0;
    }
  }

  // Check for font size change every 2 seconds
  if (millis() - lastFontSizeChange >= fontSizeChangeInterval) {
    lastFontSizeChange = millis();
    randomizeFontSizes();
  }

  // Check for color change every 1 second
  if (millis() - lastColorChange >= colorChangeInterval) {
    lastColorChange = millis();
    toggleColorScheme();
  }
}

function randomizeFontSizes() {
  fontSizeMax = floor(random(10, 30));
  fontSizeMin = floor(random(5, fontSizeMax - 5));
}

function toggleColorScheme() {
  useOriginalColors = !useOriginalColors;
}




