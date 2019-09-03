/**
 * CONFIG
 * WAVE_FIDELITY: int => how frequently points are draw on x-axis
 * AMPLITUDE_PERCENTAGE: float => percent of vertical screen space available for wave
 * NOISE_GRANULARITY: float => fine <-> coarse noise
 * COLOR_RANGE: [int, int] => low & high hue (HSL) values for wave color
 * THICKNESS: int => thickness of drawn line
 * DELAY_TIME: float => the closer this number is to 0, the longer lines will persist
 */
const WAVE_FIDELITY = 5;
const AMPLITUDE_PERCENTAGE = 0.05;
const NOISE_GRANULARITY = 0.05;
const COLOR_RANGE = [0, 360];
const THICKNESS = 3;
const DELAY_TIME = 0.20;
let prev_gfx;
let current_gfx;
const setup = (p) => () => {
  p.colorMode(p.HSL);
  p.createCanvas(p.windowWidth, p.windowHeight);
  p.frameRate(15);
  current_gfx = p.createGraphics(p.windowWidth, p.windowHeight);
  current_gfx.colorMode(p.HSL);
  current_gfx.translate(0, p.windowHeight / 2);
  prev_gfx = p.createGraphics(p.windowWidth, p.windowHeight);
  prev_gfx.translate(0, p.windowHeight / 2);
};

const wavePoints = (p) => {
  // calculate height range for points in wave
  let amp = p.windowHeight * AMPLITUDE_PERCENTAGE;
  
  let points = []
  for (let i = 0; ((i - 1) * WAVE_FIDELITY) <= p.windowWidth; i++) {
    let x = i * WAVE_FIDELITY;
    // remap noise value at i (0..1) to a value within amp (vertically centered)
    let y = p.map(p.noise((i * NOISE_GRANULARITY), (p.frameCount * NOISE_GRANULARITY)), 0, 1, -amp / 2, amp / 2);
    points.push({x, y});
  }
  return points;
};

const drawWave = (p, color) => {
  const points = wavePoints(p);
  current_gfx.strokeWeight(THICKNESS);
  current_gfx.stroke(...color);
  // current_gfx.fill(...color, 0.15);
  current_gfx.noFill();
  
  current_gfx.beginShape();
  // Draw the wave
  points.forEach(point => {
    current_gfx.vertex(point.x, point.y);
  });
  // Draw a point in the bottom right
  current_gfx.vertex(current_gfx.windowWidth, current_gfx.windowHeight / 2);
  // " bottom left
  current_gfx.vertex(0, current_gfx.windowHeight / 2);
  // Close the shape
  current_gfx.endShape(current_gfx.CLOSE);
};

const draw = (p) => () => {
  prev_gfx.image(current_gfx, 0, 0);
  // prev_gfx.translate(0, p.windowHeight / 2);
  current_gfx.image(prev_gfx, 0, 0);
  let color = [
    p.map(p.noise(p.frameCount * NOISE_GRANULARITY), 0, 1, ...COLOR_RANGE), // H
    p.random(65, 80), // S
    p.random(45, 55), // L
  ];

  const [h, ...rest] = color;
  // set BG color to compliment of wave
  const bg = h + 180;
  // current_gfx.background(bg, 30, 90, DELAY_TIME);
  drawWave(p, color);
  p.image(current_gfx, 0, 0);
};

export const useWavesMoving = (p) => [setup(p), draw(p)];
