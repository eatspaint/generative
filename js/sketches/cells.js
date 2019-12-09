export default (p) => {
  // STRUCTURAL CONFIG
  const X_RANGE = [0, p.windowWidth / 2];
  const Y_RANGE = [0, p.windowHeight / 2];
  const CONTROL_POINTS = [];
  const PIXELS = [];
  // CONTROL CONFIG
  const CONTROL_POINT_COUNT = 40;
  const HUE_ORIGIN = p.random(0, 361);
  const FIDELITY = 20;
  const randomPoint = () => [
    p.random(...X_RANGE),
    p.random(...Y_RANGE),
  ];
  // GENERATED CONSTS
  const ORIGIN = randomPoint();
  const DIST_TO_FAR_CORNER = p.max([
    p.dist(...ORIGIN, X_RANGE[0], Y_RANGE[0]),
    p.dist(...ORIGIN, X_RANGE[0], Y_RANGE[1]),
    p.dist(...ORIGIN, X_RANGE[1], Y_RANGE[0]),
    p.dist(...ORIGIN, X_RANGE[1], Y_RANGE[1]),
  ]);

  // NATIVE
  const plotPoint = (x, y) => {
    p.point(x, y);
    p.point(-x, y);
    p.point(x, -y);
    p.point(-x, -y);
  };

  // LATTICE
  // const plotPoint = (x, y) => {
  //   let radius = FIDELITY / 2;
  //   let x1 = x - radius;
  //   let x2 = x + radius;
  //   let y1 = y - radius;
  //   let y2 = y + radius;
  //   p.line(x1, y1, x2, y2);
  //   p.line(x1, y2, x2, y1);
  //   p.line(-x1, -y1, -x2, -y2);
  //   p.line(-x1, -y2, -x2, -y1);
  //   p.line(-x1, y1, -x2, y2);
  //   p.line(-x1, y2, -x2, y1);
  //   p.line(x1, -y1, x2, -y2);
  //   p.line(x1, -y2, x2, -y1);
  // };

  // RAYS
  // const plotPoint = (x, y) => {
  //   p.line(0, 0, x, y);
  //   p.line(0, 0, -x, y);
  //   p.line(0, 0, x, -y);
  //   p.line(0, 0, -x, -y);
  // };

  const drawPixel = ({ x, y, control }) => {
    let hue_component = p.map(
      p.dist(...ORIGIN, ...control),
      0, DIST_TO_FAR_CORNER,
      0, 360,
    )
    p.stroke(
      (HUE_ORIGIN + hue_component + (p.frameCount * 0.1)) % 360,
      100,
      50,
      1,
    );
    plotPoint(x, y);
  };

  // 1. Create random points
  const generateControlPoints = () => {
    for (let i = 0; i < CONTROL_POINT_COUNT; i++) {
      CONTROL_POINTS.push(randomPoint());
    }
  };

  // 2. for every pixel, iterate through points, find closest point
  const closestControlPoint = (point) => {
    let distToClosest;
    let closestControlPoint = CONTROL_POINTS[0];
    // iterate over all control points
    for (let i = 0; i < CONTROL_POINTS.length; i++) {
      let currentControlPoint = CONTROL_POINTS[i];
      let distToCurrentControlPoint = p.dist(
        ...point,
        ...currentControlPoint,
      );
      if (!distToClosest) {
        // in first iteration, distToClosest isn't set yet
        distToClosest = distToCurrentControlPoint;
      }
      if (distToCurrentControlPoint < distToClosest) {
        // if currentControlPoint is closer, set closestControlPoint & distToClosest
        closestControlPoint = currentControlPoint;
        distToClosest = distToCurrentControlPoint;
      }
    }
    return ({ control: closestControlPoint, dist: distToClosest });
  };

  // 3. draw point w val
  const calculatePixels = () => {
    for (let x = FIDELITY / 2; x <= X_RANGE[1]; x += FIDELITY) {
      for (let y = FIDELITY / 2; y <= Y_RANGE[1]; y += FIDELITY) {
        let { control, dist } = closestControlPoint([x, y]);
        PIXELS.push({ x, y, control });
      }
    }
  };

  p.setup = () => {
    // GENERAL SETUP
    p.colorMode(p.HSL);
    p.angleMode(p.DEGRES);
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.pixelDensity(1);
    // GEN POINTS
    generateControlPoints();
    calculatePixels();
  };
  
  p.draw = () => {
    p.background(0);
    p.translate(X_RANGE[1], Y_RANGE[1]);
    let weight = (p.frameCount * 0.05) + FIDELITY;
    // let weight = 1
    p.strokeWeight(weight);
    PIXELS.forEach(pixel => drawPixel(pixel));
  };
};
