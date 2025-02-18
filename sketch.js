let rows = 30;
let waveMaxHeight = 150;
let baseT = 0;
let disturbanceRadius = 100;
let boatWidth = 40;
let boatHeight = 25;
let boatX, boatY; // Variables to track boat position

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  // Initialize boat at center of canvas
  boatX = width/2;
  boatY = height/2;
}

function draw() {
  background(0);
  
  // Smooth boat movement towards mouse position
  boatX = lerp(boatX, mouseX, 0.1);
  boatY = lerp(boatY, mouseY, 0.1);
  
  // Use boat position for wave disturbance instead of mouse position
  drawWaves(rows, boatX, boatY);
  drawBoat(boatX, boatY);
}

function drawWaves(number, cursorX, cursorY) {
  for (let i = number; i >= 0; i--) {
    drawWave(i, number, cursorX, cursorY);
  }
  baseT += 0.08;
}

function drawWave(n, rows, cursorX, cursorY) {
  let baseY = map(n, 0, rows, height, 0);
  let t = baseT + n*30;
  let startX = 0;
  
  push();
  colorMode(HSB);
  let hue = map(n, 0, rows, 200, 250);
  stroke(hue, 100, 100, 0.8); // Change this line to modify the color to blue
  noFill();
  strokeWeight(3);
  
  beginShape();
  for (let x = startX; x <= width; x += 5) {
    let waveHeight = height/rows * 0.4;
    let noiseVal = noise(t, x * 0.005);
    let sineWave = sin(x * 0.03 + t) * waveHeight/3;
    
    let d = dist(x, baseY, cursorX, cursorY);
    let mouseEffect = 0;
    if (d < disturbanceRadius) {
      let strength = map(d, 0, disturbanceRadius, 0.9, 0);
      strength = strength * strength;
      
      let ripple = sin(d * 0.08 - baseT * 3) * 10;
      let mouseSpeed = dist(cursorX, cursorY, boatX, boatY);
      let chaos = map(mouseSpeed, 0, 50, 0, 10);
      
      mouseEffect = (ripple + chaos) * strength;
    }
    
    let y = baseY - map(noiseVal, 0, 1, -waveHeight, waveHeight) + 
            sineWave + mouseEffect;
    
    vertex(x, y);
    t += 0.008;
  }
  endShape();
  pop();
}

function drawBoat(x, y) {
  push();
  // Calculate tilt based on boat's movement
  let tilt = map(dist(x, y, boatX, boatY), 0, 20, 0, PI/24);
  if (x < boatX) tilt = -tilt;
  
  translate(x, y);
  rotate(tilt);
  
  // Center the boat relative to cursor point
  translate(-boatWidth/4, 0);
  
  fill(255);
  stroke(200);
  strokeWeight(1);
  
  // Hull
  beginShape();
  vertex(-boatWidth/2, 0);
  bezierVertex(-boatWidth/2.5, boatHeight/2, 
               boatWidth/2.5, boatHeight/2, 
               boatWidth/2, 0);
  vertex(boatWidth/2.5, -boatHeight/4);
  vertex(-boatWidth/2.5, -boatHeight/4);
  endShape(CLOSE);
  
  // Deck
  fill(220);
  beginShape();
  vertex(-boatWidth/3, -boatHeight/4);
  vertex(boatWidth/3, -boatHeight/4);
  vertex(boatWidth/4, -boatHeight/2);
  vertex(-boatWidth/4, -boatHeight/2);
  endShape(CLOSE);
  
  // Sail
  fill(240);
  beginShape();
  vertex(0, -boatHeight/2);
  vertex(-5, -boatHeight*1.5);
  vertex(15, -boatHeight*0.8);
  endShape(CLOSE);
  
  // Mast
  strokeWeight(2);
  line(0, -boatHeight/2, 0, -boatHeight*1.5);
  
  pop();
}