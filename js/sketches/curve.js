export default (p) => {
  p.colorMode(p.HSL);
  p.angleMode(p.DEGREES);
  const { windowHeight, windowWidth } = p;

  const midpoint = (p1, p2) => {
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    return ([(x1 + x2) / 2, (y1 + y2) / 2]);
  }
  
  const drawCurve = ({ controlPoints, color }) => {
    p.fill(...color);
    p.beginShape();
    
    let n = controlPoints.length;

    // draw the start
    let start = midpoint(controlPoints[n - 1][1], controlPoints[0][0])
    p.vertex(...start);
  
    // iterate through controlPoints
    for (let i = 0; i < n; i++) {
      // get the control points for the curve "a"
      let a1 = controlPoints[i][0];
      let a2 = controlPoints[i][1];
      // get the first control point form the next line "b"
      let b1 = controlPoints[(i + 1) % n][0];
      // calc the start point of the next line "b"
      let b0 = midpoint(a2, b1);
      // draw curve up to start of "b"
      p.bezierVertex(...a1, ...a2, ...b0);
    }
    p.endShape();
  };

  const steps = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];

  const scalePoints = ({ points, scale }) => (
    // entire array of control point pairs
    points.map(pair => (
      // a control point pair
      pair.map(point => (
        // an x, y pair
        point.map(val => val * scale)
      ))
    ))
  );

  const HUE_SPLAY = 5;
  const drawLayers = ({ points, hue }) => {
    steps.forEach((step, i) => {
      drawCurve({
        controlPoints: scalePoints({ points, scale: step }),
        color: [(hue + (i * HUE_SPLAY)) % 360, 50, 30, 0.3],
      });
    });
  }

  const CONTROL_MIN_LENGTH = 0;
  const CONTROL_MAX_LENGTH = 130;
  const CONTROL_MIN_COUNT = 3;
  const CONTROL_MAX_COUNT = 7;
  const generateControlPoints = () => {
    // determine how many control pairs to output
    const pairCount = p.floor(p.random(CONTROL_MIN_COUNT, CONTROL_MAX_COUNT));

    let controlPoints = [];
    let segmentSize = 360 / pairCount;
    for (let i = 0; i < pairCount; i++) {
      // calculate two halves of this segment
      let minDeg = (i * segmentSize) + 1;
      let midDeg = (i * segmentSize) + (segmentSize / 2);
      let maxDeg = (i + 1) * segmentSize;
      // randomize length & angle for first control
      let c1Length = p.random(CONTROL_MIN_LENGTH, CONTROL_MAX_LENGTH);
      let c1Deg = p.random(minDeg, midDeg);
      // randomize length & angle for second control
      let c2Length = p.random(CONTROL_MIN_LENGTH, CONTROL_MAX_LENGTH);
      let c2Deg = p.random(midDeg, maxDeg);
      // calc x, y for each control
      let control1 = [c1Length * p.sin(c1Deg), c1Length * p.cos(c1Deg)];
      let control2 = [c2Length * p.sin(c2Deg), c2Length * p.cos(c2Deg)];
      // return the pair
      controlPoints.push([control1, control2]);
    }
    return controlPoints;
  }
  
  const goodHues = [
    60,
    160,
    200,
    280,
    330,
  ];

  const cols = p.floor(windowWidth / (CONTROL_MAX_LENGTH * 2));
  const rows = p.floor(windowHeight / (CONTROL_MAX_LENGTH * 2));
  const hOffset = ((windowWidth % (CONTROL_MAX_LENGTH * 2)) / 2) + CONTROL_MAX_LENGTH;
  const vOffset = ((windowHeight % (CONTROL_MAX_LENGTH * 2)) / 2) + CONTROL_MAX_LENGTH;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.translate(hOffset, vOffset);

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        p.push();
        p.translate((x * CONTROL_MAX_LENGTH * 2), (y * CONTROL_MAX_LENGTH * 2));
        drawLayers({
          points: generateControlPoints(),
          hue: p.random(goodHues),
        });
        p.pop();
      }
    }
  };
};
