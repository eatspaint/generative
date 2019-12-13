import 'p5/lib/addons/p5.dom';

const SPINE_OPACITY = 1 * 255; // opacity for spines
const SPINE_WIDTH = 2; // width of a spine
const RESOLUTION = 20; // Size of a "pixel"
const SPINE_MULT = 0.5; // length of spines relative to pixel size
const RADIUS = RESOLUTION * SPINE_MULT; // util value

class Pixel {
  constructor({x, y, color, angle, spines}) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.angle = angle;
    this.spines = spines;
    this.rotStep = 360 / spines;
  };

  drawSpine(p) {
    p.line(0, 0, RADIUS, 0);
  };

  draw(p) {
    p.push();
    // Set stroke to pixel color
    p.stroke(this.color);
    // Go to x/y origin for this pixel
    p.translate(this.x, this.y);
    // Rotate to starting angle based on lightness
    p.rotate(this.angle + p.frameCount);
    // Draw the first spine
    this.drawSpine(p);
    // Draw the remaining spines
    for (let i = 0; i <= this.spines; i++) {
      p.rotate(this.rotStep);
      this.drawSpine(p);
    }
    p.pop();
  };
};

export default (p) => {
  let PIXELS;
  let SCALED_WIDTH;
  let SCALED_HEIGHT;

  // Calc COLS, SCALED_WIDTH, SCALED_HEIGHT
  const processImg = (img) => {
    // Calc scaled height and width
    const { scaledWidth, scaledHeight, scale } = calcScaled(img);
    // Calc number of x & y points in scaled output for desired resolution
    const xSteps = scaledSteps(scaledWidth);
    const ySteps = scaledSteps(scaledHeight);
    // Get color data for every pixel per RESOLUTION
    const pixels = sampleImage({ img, xSteps, ySteps, scale });

    PIXELS = pixels;
    SCALED_WIDTH = scaledWidth;
    SCALED_HEIGHT = scaledHeight;
  };

  // Run global setup for image
  const setupImage = (img) => {
    img.loadPixels();
    p.strokeWeight(SPINE_WIDTH);
    processImg(img);
  };

  // for an image, determine scaled height, width, & scale factor
  const calcScaled = (img) => {
    const size = [img.width, img.height];
    const maxSide = size[0] > size[1] ? 0 : 1;
    const scale = size[maxSide] / [p.windowWidth, p.windowHeight][maxSide];
    return ({
      scale,
      scaledWidth: img.width / scale,
      scaledHeight: img.height / scale,
    })
  };

  // Translates out to avoid clipping edge "pixels"
  const NUDGE_AMT = RESOLUTION / 2;
  const nudgeByHalfResolution = () => {
    p.translate(NUDGE_AMT, NUDGE_AMT);
  };

  // Translates margins for centering rendered image
  const centerDrawing = (scaledWidth, scaledHeight) => {
    p.translate(
      (p.windowWidth - scaledWidth) / 2,
      (p.windowHeight - scaledHeight) / 2,
    );
  };

  // For a given size, return the number of steps per RESOLUTION
  const scaledSteps = (size) => size / RESOLUTION;

  // Iterate across image, and store data based on scaling/step counts
  const sampleImage = ({
    img, xSteps, ySteps, scale
  }) => {
    let pixels = [];
    for (let x = 0; x < xSteps; x++) {
      for (let y = 0; y < ySteps; y++) {
        let [r, g, b] = img.get(
          (x * RESOLUTION) * scale,
          (y * RESOLUTION) * scale,
        );
        let color = p.color(r, g, b, SPINE_OPACITY);
        pixels.push(new Pixel({
          color,
          x: x * RESOLUTION,
          y: y * RESOLUTION,
          angle: p.map(p.lightness(color), 0, 255, 0, 360),
          spines: Math.round(p.map(p.saturation(color), 0, 255, 1, 10)) + 1,
        }));
      }
    };
    return pixels;
  }

  // Iterate across cols, draw for each value
  const plotPixels = (pixels) => {
    pixels.forEach((pixel) => {
      pixel.draw(p);
    });
  };

  // Reset BG, translate, & plot pixels
  const drawImage = () => {
    p.push();
    p.background(0);
    // Move down a bit so we aren't cutting any border pixels off
    nudgeByHalfResolution();
    // Center the rendered image
    centerDrawing(SCALED_WIDTH, SCALED_HEIGHT);
    plotPixels(PIXELS);
    p.pop();
  };

  const gotFile = (file) => {
    // If it's an image file
    if (file.type === 'image') {
      p.loadImage(
        file.data, 
        setupImage,
      );
    } else {
      console.log('Not an image file!');
    }
  };

  p.setup = () => {
    p.angleMode(p.DEGREES);
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(10);
    canvas.drop(gotFile);
    p.text('drop an image into the browser', 10, 20)
  };

  p.draw = () => {
    if (PIXELS) {
      drawImage();
      // p.noLoop();
    }
  };
};
