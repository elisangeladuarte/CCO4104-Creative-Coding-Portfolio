function setup() {
  createCanvas(600, 600);
}

function draw() {
  // A deep, dark navy that feels like deep water
  background(10, 20, 35);

  let density = 4;
  for (let i = -width; i < width * 2; i += density) {
    // Calculating distance from the mouse to drive the geometric warping
    let d = dist(mouseX, mouseY, i, mouseY);
    let shift = map(d, 0, 500, 50, 0, true);

    // Variable wave frequency for more organic motion
    let wave = sin(frameCount * 0.03 + i * 0.05) * 8;

    // This adds a subtle layer of complexity to the vibration
    stroke(30, 80, 150, 90);
    strokeWeight(2);
    line(i + shift * 1.1, 0, i - shift * 1.1, height);

    stroke(0, 210, 255, 140);
    strokeWeight(1.2);
    line(i + shift + wave, 0, i - shift - wave, height);

    // This creates the buzzing visual effect where the lines cross

    let sparkleAlpha = map(sin(frameCount * 0.1 + i), -1, 1, 50, 150);
    stroke(200, 220, 255, sparkleAlpha);
    strokeWeight(0.8);
    line(i - shift + wave, 0, i + shift - wave, height);
  }
}
