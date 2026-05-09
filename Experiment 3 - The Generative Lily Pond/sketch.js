let pondItems = [];
let rippleLayer;
let mic; // Variable for the microphone input

function setup() {
  createCanvas(600, 600);

  // Initialize microphone
  mic = new p5.AudioIn();
  mic.start();

  // We use a separate graphics layer for the background moiré to keep the frame rate high
  rippleLayer = createGraphics(600, 600);
  drawPondBase();
  initPond();
}

function initPond() {
  pondItems = [];
  // Populate the pond with a mix of pads and flowering pads
  for (let i = 0; i < 7; i++) {
    pondItems.push({
      x: random(width),
      y: random(height),
      size: random(110, 190),
      // Natural hierarchy: not every pad has a flower
      type: random() > 0.4 ? "pad" : "flower_on_pad",
      speed: random(0.015, 0.04),
      offset: random(1000),
    });
  }
}

function draw() {
  background(10, 25, 20); // Dark Olive water base

  // Get the current volume level
  let vol = mic.getLevel();

  // We use lerp to keep the movement from being to jumpy
  let volumeBoost = map(vol, 0, 0.5, 0, 100);

  // Apply the global optical shimmer layer
  image(rippleLayer, 0, 0);

  // Render the generative flora
  for (let item of pondItems) {
    let driftX = map(noise(item.offset + frameCount * 0.005), 0, 1, -20, 20);
    let driftY = map(
      noise(item.offset + 100 + frameCount * 0.005),
      0,
      1,
      -20,
      20
    );

    // Draw a soft shadow first
    noStroke();
    fill(0, 50); // Very transparent black
    ellipse(item.x + driftX + 5, item.y + driftY + 5, item.size * 0.5);

    if (item.type === "flower_on_pad") {
      // Layering: pad drawn first, then the flower on top
      drawLilyPad(item.x + driftX, item.y + driftY, item.size, item.speed);
      drawLilyFlower(
        item.x + driftX,
        item.y + driftY,
        item.size * 0.8,
        item.speed,
        vol
      ); // Lily is 90% size of pad
    } else {
      drawLilyPad(item.x + driftX, item.y + driftY, item.size, item.speed);
    }
  }
}

function drawLilyFlower(x, y, radius, speed, vol) {
  push();
  translate(x, y);
  let lines = 120;
  for (let i = 0; i < lines; i++) {
    let angle = map(i, 0, lines, 0, TWO_PI);

    // Subtle breathing animation for the petals
    let pulse = sin(frameCount * speed + i * 0.1) * (radius * 0.08) + vol * 50;

    let x1 = cos(angle) * (radius / 2 + pulse);
    let y1 = sin(angle) * (radius / 2 + pulse);
    let x2 = cos(angle + PI) * (radius * 0.05);
    let y2 = sin(angle + PI) * (radius * 0.05);

    stroke(255, 80 + vol * 500, 180, 180); // Bright Pink
    strokeWeight(1);
    line(x1, y1, x2, y2);

    // Deepening the form with white highlights
    if (i % 4 == 0) {
      stroke(255, 220); // Bright white highlights
      line(x1, y1, x2 * 0.5, y2 * 0.5);
    }
  }
  pop();
}

function drawLilyPad(x, y, radius, speed, hasFlower) {
  push();
  translate(x, y);
  rotate(sin(frameCount * 0.008) * 0.15);

  fill(34, 76, 50); // Deep pond green
  stroke(45, 100, 65);
  strokeWeight(2);

  let lines = 90;
  beginShape();
  vertex(0, 0);

  for (let i = 0; i <= lines; i++) {
    // Creating the signature V notch of a lily pad
    let angle = map(i, 0, lines, 0, TWO_PI * 0.88);

    // Edge ripple logic to mimic water surface tension
    let ripple = cos(frameCount * speed + i * 0.5) * 3;
    let r = radius / 2 + ripple;

    let vx = cos(angle) * r;
    let vy = sin(angle) * r;

    vertex(vx, vy);
  }
  endShape();
  pop();
}

function drawPondBase() {
  rippleLayer.background(10, 25, 20);
  rippleLayer.noFill();
  for (let i = -width; i < width * 2; i += 10) {
    rippleLayer.stroke(255, 15); // Very faint white
    rippleLayer.line(i, 0, i - width, height); // Top-left to bottom-right
    rippleLayer.line(i - width, 0, i, height); // Top-right to bottom-left
  }
}

function touchStarted() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }
}
