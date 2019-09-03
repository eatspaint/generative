let gfx;
let previous_gfx;

const initializeMain = (p) => {
  p.colorMode(p.HSL);
  p.createCanvas(p.windowWidth, p.windowHeight);
  p.frameRate(15);
  p.translate(p.windowWidth / 2, p.windowHeight / 2);
  p.imageMode(p.CENTER);
  p.angleMode(p.DEGREES);
};

const initializeGFX = (p) => {
  gfx = p.createGraphics(p.windowWidth, p.windowHeight);
  gfx.colorMode(p.HSL);
  gfx.stroke(0, 0, 0);
  gfx.strokeWeight(2);
  gfx.fill(0, 0, 0, 0.05);
  gfx.translate(gfx.width / 2, gfx.height / 2);
  gfx.imageMode(gfx.CENTER);
  gfx.angleMode(gfx.DEGREES);
};

const initializePreviousGFX = (p) => {
  previous_gfx = p.createGraphics(p.windowWidth, p.windowHeight);
  previous_gfx.imageMode(previous_gfx.CENTER);
  previous_gfx.translate(previous_gfx.windowWidth / 2, previous_gfx.windowHeight / 2);
};

const setup = (p) => () => {
  initializeMain(p);
  initializeGFX(p);
  initializePreviousGFX(p);
};

const resetBackground = (p) => {
  gfx.background(15, 20, 50);
};

const loadPrevious = () => {
  gfx.image(previous_gfx, 0, 0);
};

const SIZE = 1;
const FIDELITY = 5;
const drawNextFrame = (p) => {
  let minDimension = p.windowWidth > p.windowHeight ? p.windowHeight : p.windowWidth;
  let scaledRadius = (minDimension * SIZE) / 2;
  gfx.fill(0, 0, 100);
  gfx.beginShape();
  for (let i = 0; (i * FIDELITY) <= 360; i++) {
    let unitX = gfx.cos(i * FIDELITY);
    let unitY = gfx.sin(i * FIDELITY);
    let radius = gfx.noise(
      (scaledRadius + unitX) * 0.7,
      (scaledRadius + unitY) * 0.7,
      p.frameCount * 0.05,
    ) * scaledRadius;
    gfx.vertex(
      radius * unitX,
      radius * unitY,
    )
  }
  gfx.endShape(gfx.CLOSE);
};

const renderCurrentFrames = (p) => {
  p.image(gfx, p.windowWidth / 2, p.windowHeight / 2);
};

const storeCurrentFrames = (p) => {
  // args 2 & 3 are shifted for motion effect
  previous_gfx.image(gfx, ...offset(p));
};

const UNIT_DISTANCE = 50;
const offset = (p) => {
  let xOffset = UNIT_DISTANCE * p.sin(p.frameCount);
  let yOffset = UNIT_DISTANCE * p.cos(p.frameCount);
  // bitwise or, rounding offsets to avoid blurring
  return [xOffset | 0, yOffset | 0];
}; 

const draw = (p) => () => {
  resetBackground(p);
  loadPrevious();
  drawNextFrame(p);
  renderCurrentFrames(p);
  storeCurrentFrames(p);
};

export const useMovement = (p) => [setup(p), draw(p)];
