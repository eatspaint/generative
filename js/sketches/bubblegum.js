const FIDELITY = 10;
const ZOOM = 0.1;
const SPEED = 0.03;
const BAND_LOC = 0.6;
const BAND_WIDTH = 0.03;
const PEAK = 0.7;

export default (p) => {
  p.colorMode(p.HSL);
  // destructure height & width from window
  const { windowWidth, windowHeight } = p;

  const lowZone = p.color(300, 100, 70);
  const midZone = p.color(0, 0, 100);
  const hiZone = p.color(180, 100, 50);
  const peakZone = p.color(113, 100, 70);
  const bandHi = (BAND_LOC + (BAND_WIDTH / 2));
  const bandLo = (BAND_LOC - (BAND_WIDTH / 2));
  // return a p.Color, depending on input val
  const calcFill = (val) => {
    if (val < bandLo) {
      return lowZone;
    } else if (val > PEAK) {
      return peakZone;
    } else if (val > bandHi) {
      return hiZone;
    } else {
      return midZone;
    }
  }
  
  // abstract iteration counts for perf boost
  const xLength = windowWidth / FIDELITY;
  const yLength = windowHeight / FIDELITY;
  // iterate across x & y (in FIDELITY) and fill each cell
  const shadeCells = () => {
    for (let x = 0; x < xLength; x++) {
      for (let y = 0; y < yLength; y++) {
        let nx = x * ZOOM;
        let ny = y * ZOOM;
        let color = calcFill(p.noise(nx, ny, (p.frameCount * SPEED)));
        p.fill(color);
        p.square((x * FIDELITY), (y * FIDELITY), FIDELITY);
      }
    }
  }

  p.setup = () => {
    p.createCanvas(windowWidth, windowHeight);
    p.noStroke();
  };
  
  p.draw = () => {
    shadeCells();
  };
};
