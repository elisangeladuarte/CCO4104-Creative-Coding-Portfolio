function setup() {
  createCanvas(600, 600);
}

function draw() {
  // A deep, dark navy that feels like deep water
  background(10, 20, 35);

  noFill();
  stroke(5, 10, 20, 200);
  strokeWeight(150);
  ellipse(width / 2, height / 2, width * 1.3);

  push();
  translate(width / 2, height / 2);

  // Drawing the faint light patterns found on the floor of clear water
  drawCaustics();

  let spacing = 3;
  let maxRadius = 450;
  let numRings = maxRadius / spacing;

  for (let i = 0; i < numRings; i++) {
    let baseR = i * spacing;

    // Displacement logic based on mouse distance and time
    let d = dist(mouseX - width / 2, mouseY - height / 2, 0, 0);
    let wave = sin(i * 0.15 - frameCount * 0.06) * map(d, 0, 800, 20, 0);

    // Subtle swaying motion to simulate water surface tension
    let xSway = cos(i * 0.05 + frameCount * 0.01) * 2;
    let ySway = sin(i * 0.05 + frameCount * 0.01) * 2;

    stroke(20, 50, 100, 80);
    strokeWeight(map(i, 0, numRings, 3, 0.5));
    ellipse(xSway, ySway, baseR * 2 + wave, baseR * 2 + wave);

    stroke(0, 210, 255, 120);
    strokeWeight(map(i, 0, numRings, 1.5, 0.2));
    ellipse(0, 0, baseR * 2 + wave, baseR * 2 + wave);

    // Every other ring gets a high-frequency specular highlight for realism
    if (i % 3 === 0) {
      stroke(220, 240, 255, 200);

      let specularOffset = sin(frameCount * 0.1 + i * 0.1) * 1.5;

      ellipse(
        specularOffset,
        specularOffset,
        baseR * 2 + wave,
        baseR * 2 + wave
      );
    }
  }
  pop();
}

// Function to simulate caustics - the web like patterns of light hitting water
function drawCaustics() {
  for (let x = -width / 2; x < width / 2; x += 20) {
    for (let y = -height / 2; y < height / 2; y += 20) {
      let n = noise(x * 0.01, y * 0.01, frameCount * 0.01);
      if (n > 0.55) {
        stroke(0, 255, 255, map(n, 0.55, 1, 10, 40));
        strokeWeight(n * 2);
        // Draw tiny lines instead of points for a web feel
        line(x, y, x + cos(n * TWO_PI) * 5, y + sin(n * TWO_PI) * 5);
      }
    }
  }
}
