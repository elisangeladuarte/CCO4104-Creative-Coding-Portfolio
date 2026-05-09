let video;
let vScale = 6;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640 / vScale, 480 / vScale);
  video.hide();
}

function draw() {
  background(245, 240, 230);

  video.loadPixels();

  // We loop through the smaller video buffer but draw at full scale
  for (let x = 0; x < video.width; x++) {
    for (let y = 0; y < video.height; y++) {
      let index = (x + y * video.width) * 4;

      let r = video.pixels[index];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];

      let bright = (r + g + b) / 3;

      // This ensures the webcam colors are very visible and vibrant
      let finalColor = color(r * 1.2, g * 1.1, b * 1.3, 200);

      let n = noise(x * 0.1, y * 0.1, frameCount * 0.03);
      let jitterX = map(n, 0, 1, -4, 4);
      let jitterY = map(noise(y, x, frameCount * 0.03), 0, 1, -4, 4);

      push();
      // Scale coordination back up to canvas siz3
      translate(x * vScale + jitterX, y * vScale + jitterY);

      // Rotation based on brightness creates the cross-hatching effect
      let angle = map(bright, 0, 255, 0, PI);
      rotate(angle + n * 0.2);

      stroke(finalColor);

      // Thicker lines in dark areas, delicate lines in highlights
      let sw = map(bright, 0, 255, 4, 0.5);
      strokeWeight(sw);

      let shimmer = sin(frameCount * 0.08 + x + y) * 1.5;
      let len = map(bright, 0, 255, vScale * 2.5, vScale * 0.5);

      line(-len / 2 + shimmer, 0, len / 2 - shimmer, 0);
      pop();
    }
  }
}
