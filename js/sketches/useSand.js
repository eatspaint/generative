const STROKES = 5;
const GRAINS = 100;
const ACCEL = 5;
const STROKE_WEIGHT = 0.5;
const LOW_ALPHA = 0.05;
const HUE_VARIANCE = 25;
const setup = (p) => () => {
  p.createCanvas(p.windowWidth, p.windowHeight);
  p.colorMode(p.HSL);
  let upper_bound = GRAINS;
  let lower_bound = p.windowHeight - GRAINS;
  let hue = p.random(0, 361);
  p.background((hue + 180) % 360, 50, 93);
  for (let stroke = 0; stroke < STROKES; stroke++) {
    let y = p.random(lower_bound, upper_bound);
    sandStroke(
      p,
      y,
      p.random(
        hue - HUE_VARIANCE,
        hue + HUE_VARIANCE
      ) % 360
    );
  }
};

const sandStroke = (p, y, hue) => {
  let stroke_alpha = (1 / GRAINS) + LOW_ALPHA;
  p.stroke(hue, 100, 50, stroke_alpha);
  p.strokeWeight(STROKE_WEIGHT);

  // start with an amplitude between 0 and the max amplitude
  let amplitude = p.random(0, GRAINS);
  for (
    let i = 0;
    (i * STROKE_WEIGHT) <= p.windowWidth;
    i = i + STROKE_WEIGHT
  ) {
    let px = (i * STROKE_WEIGHT);
    for (let grain = 0; grain < GRAINS; grain++) {
      let py = p.lerp(0, amplitude, (grain / GRAINS));
      if (grain === 0) {
        p.point(px, y);
      } else {
        p.point(px, y + py);
        p.point(px, y - py);
      }
    }
    // determine next amplitude by randomly picking a value within ACCEL units of the current amplitude
    let min_motion = amplitude - ACCEL;
    let max_motion = amplitude + ACCEL;
    amplitude = p.random(
      min_motion > 0 ? min_motion : 0,
      max_motion < GRAINS ? max_motion : GRAINS,
    )
  }
}

const draw = (p) => () => {
  p.noLoop();
};

export const useSand = (p) => [setup(p), draw(p)];
