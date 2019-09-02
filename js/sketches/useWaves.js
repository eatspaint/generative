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
const AMPLITUDE_PERCENTAGE = 0.4;
const NOISE_GRANULARITY = 0.05;
const COLOR_RANGE = [150, 210];
const THICKNESS = 3;
const DELAY_TIME = 0.20;

const setup = (p) => () => {
  p.colorMode(p.HSL);
  p.createCanvas(p.windowWidth, p.windowHeight);
  p.frameRate(15);
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

  p.strokeWeight(THICKNESS);
  p.stroke(...color);
  p.fill(...color, 0.15);

  p.beginShape();
  // Draw the wave
  points.forEach(point => {
    p.vertex(point.x, point.y);
  });
  // Draw a point in the bottom right
  p.vertex(p.windowWidth, p.windowHeight / 2);
  // " bottom left
  p.vertex(0, p.windowHeight / 2);
  // Close the shape
  p.endShape(p.CLOSE);
};

const draw = (p) => () => {
  let color = [
    p.map(p.noise(p.frameCount * NOISE_GRANULARITY), 0, 1, ...COLOR_RANGE), // H
    p.random(65, 80), // S
    p.random(45, 55), // L
  ];

  const [h, ...rest] = color;
  // set BG color to compliment of wave
  const bg = h + 180;
  p.background(bg, 30, 90, DELAY_TIME);
  p.translate(0, p.windowHeight / 2);
  drawWave(p, color);
};

export const useWaves = (p) => [setup(p), draw(p)];
