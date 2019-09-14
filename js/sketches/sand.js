const STROKES = 5;
const GRAINS = 100;
const ACCEL = 1;
const STROKE_WEIGHT = 0.25;
const LOW_ALPHA = 0.05;
const HUE_VARIANCE = 40;

export default (p) => {
  const sandStroke = (y, hue) => {
    p.strokeWeight(STROKE_WEIGHT);

    // start with an amplitude between 0 and the max amplitude
    let amplitude = p.random(0, GRAINS);
    for (
      let i = 0;
      (i * STROKE_WEIGHT) <= p.windowWidth;
      i++
    ) {
      let px = (i * STROKE_WEIGHT);
      // This looks a lot better (more paper-like), but is significantly slower
      // iterate through every grain and drop it at it's place in amplitude
      // for (let grain = 0; grain < GRAINS; grain++) {
      //   let py = p.lerp(0, amplitude, (grain / GRAINS));
      //   if (grain === 0) {
      //     p.point(px, y);
      //   } else {
      //     p.point(px, y + py);
      //     p.point(px, y - py);
      //   }
      // }
      let alpha = (1 + LOW_ALPHA) - (amplitude / GRAINS);
      p.stroke(hue, 100, 50, alpha);
      p.line(px, y - amplitude, px, y + amplitude);
      // determine next amplitude by randomly picking a value within ACCEL units of the current amplitude
      let min_motion = amplitude - ACCEL;
      let max_motion = amplitude + ACCEL;
      amplitude = p.random(
        min_motion > 0 ? min_motion : 0,
        max_motion < GRAINS ? max_motion : GRAINS,
      )
    }
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.colorMode(p.HSL);
    let upper_bound = GRAINS;
    let lower_bound = p.windowHeight - GRAINS;
    let hue = p.random(0, 361);
    p.background((hue + 180) % 360, 50, 93);
    for (let stroke = 0; stroke < STROKES; stroke++) {
      let y = p.random(lower_bound, upper_bound);
      sandStroke(
        y,
        p.random(
          hue - HUE_VARIANCE,
          hue + HUE_VARIANCE
        ) % 360
      );
    }
  };

  p.draw = () => {
    p.noLoop();
  };
};
