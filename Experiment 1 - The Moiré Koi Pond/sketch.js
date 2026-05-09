let img;

function preload() {
  // Loading the koi animation as our base texture
  img = loadImage("koifish.gif");
}

function setup() {
  createCanvas(600, 600);
  img.resize(600, 600); // Making sure the GIF fills our canvas
}

function draw() {
  background(15); // Slightly deeper black for better contrast

  fill(15);
  noStroke();
  circle(width / 2, height / 2, 570);

  img.loadPixels();
  let spacing = 3;

  let pondCenter = createVector(width / 2, height / 2);
  let pondRadius = 280;

  for (let x = 0; x < width; x += spacing) {
    // Adding a sine wave and frameCount to create that liquid refraction look
    let waterWarp = sin(frameCount * 0.015 + x * 0.02) * 10;

    // The mouse controls the overall shimmer/shift of the water
    let mouseWeight = map(mouseX, 0, width, -10, 10);
    let xOffset = lerp(-5, 5, mouseX / width) + waterWarp;

    for (let y = 0; y < height; y += 4) {
      let d = dist(x, y, pondCenter.x, pondCenter.y);

      // Only drawing pixels inside the pond circle
      if (d < pondRadius) {
        let pixIndex = (x + y * width) * 4;
        let r = img.pixels[pixIndex];
        let g = img.pixels[pixIndex + 1];

        // This calculates transparency based on how close the pixel is to the edge
        // As d approaches pondRadius, edgeFade goes to 0
        let edgeFade = map(d, pondRadius - 20, pondRadius, 255, 0, true);

        // Identifying the fish vs the water
        if (r > g + 30) {
          fill(255, 60, 40, edgeFade); // Vibrant red/orange koi
        } else if (r > 200 && g > 200) {
          let twinkle = sin(frameCount * 0.1 + x * y) * 30; // Twinkling effect for sparkles
          fill(220, 255, 250, min(220 + twinkle, edgeFade)); // The white sparkles in the water
        } else {
          //  Cyan water
          fill(0, 160, 200, min(180, edgeFade));
        }

        // Mapping pixel brightness to the width of our slats
        let w = map(r, 0, 255, 0.5, spacing * 1.8);

        let waveTimer = sin(frameCount * 0.1);

        push();
        translate(x + xOffset, y);

        // This rotates the slats gradually between horizontal and vertical
        if (waveTimer > 0) {
          rect(0, 0, w, 3, 1);
        } else {
          rect(0, 0, 3, w, 1);
        }
        pop();
      }
    }
  }
}
