import 'p5/lib/addons/p5.dom';

class Pixel {
  constructor({x, y, color}) {
    this.x = x;
    this.y = y;
    this.color = color;
  }

  draw() {

  }
}

export default (p) => {
  const SPINE_OPACITY = 0.5 * 255; // opacity for spines
  const SPINE_WIDTH = 2; // width of a spine
  const RESOLUTION = 15; // Size of a "pixel"
  const SPINE_MULT = 10; // length of spines relative to pixel size
  const RADIUS = RESOLUTION * SPINE_MULT; // util value

  let COLS;
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
    const cols = sampleImage({ img, xSteps, ySteps, scale });

    COLS = cols;
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
    const cols = [];
    const pixels = [];
    for (let x = 0; x < xSteps; x++) {
      let col = [];
      for (let y = 0; y < ySteps; y++) {
        let [r, g, b] = img.get(
          (x * RESOLUTION) * scale,
          (y * RESOLUTION) * scale,
        );
        col.push({
          color: p.color(r, g, b, SPINE_OPACITY),
        });
        // pixels.push(new Pixel({
        //   x: x * RESOLUTION,
        //   y: y * RESOLUTION,
        //   color: p.color(r, g, b, SPINE_OPACITY)
        // }));
      }
      cols.push(col);
    };
    // console.log(pixels);
    return cols;
  }

  // Rotate the cursor according to lightness of color
  const rotateToLightness = (color) => {
    // Calc starting rotation based on lightness
    let rot = p.map(p.lightness(color), 0, 255, 0, 360);
    // Set starting rotation
    p.rotate(rot + p.frameCount);
  };

  // Determine number of spines according to saturation of color
  const spinesForSaturation = (color) => (
    p.map(p.saturation(color), 0, 255, 1, 10) + 1
  );

  // Draw a unit line "spine" for given length
  const drawSpine = (length) => p.line(0, 0, length, 0);

  // Iterate across cols, draw for each value
  const plotPixels = (cols) => {
    cols.forEach((col, x) => {
      col.forEach((cell, y) => {
        p.push();
        // Set stroke to pixel color
        p.stroke(cell.color);
        // Go to x/y origin for this pixel
        p.translate(x * RESOLUTION, y * RESOLUTION);
        // Rotate to starting angle based on lightness
        rotateToLightness(cell.color);
        // Calc number of spines based on saturation
        let spines = spinesForSaturation(cell.color);
        // Calc degrees per rotation step
        let rotStep = 360 / spines;
        // Draw the first spine
        let spineLength = RADIUS;
        drawSpine(spineLength);
        // Draw the remaining spines
        for (let i = 0; i <= spines; i++) {
          p.rotate(rotStep);
          drawSpine(spineLength);
        }
        p.pop();
      });
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
    plotPixels(COLS);
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
  };

  p.draw = () => {
    if (COLS) {
      drawImage();
      p.noLoop();
    }
  };
};
