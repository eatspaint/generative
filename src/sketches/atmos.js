class Spiral {
  constructor({angularSpeed, spacing, center, stroke, color, radius}) {
    this.angularSpeed = angularSpeed;
    this.spacing = spacing;
    this.center = center;
    this.stroke = stroke;
    this.color = color;
    this.radius = radius;
    this.continue = true;
  };

  point(p, index) {
    let angle = (index * this.angularSpeed) % 360;
    let r = index * this.spacing;
    if (r >= this.radius) {
      this.continue = false;
    }
    let x = p.cos(angle) * r;
    let y = p.sin(angle) * r;
    return [x, y];
  }

  drawPoint(p, index) {
    const point = this.point(p, index);
    if (this.continue) {
      p.push();
      p.translate(...this.center);
      p.strokeWeight(this.stroke);
      p.stroke(this.color);
      p.point(...point);
      p.strokeWeight(1);
      p.line(0, 0, ...point);
      p.pop();
    }
    return this.continue;
  }
}

export default (p) => {
  p.colorMode(p.HSL);
  p.angleMode(p.DEGREES);

  // controls how fast the points rotate
  const ANGULAR_SPEED = p.random([1, 2.5, 3.5, 5.5, 10, 98, 101, 203, 235]);
  // width of drawn points
  const STROKE = p.random([3, 5, 10, 50, 100, 200]);
  // controls how tight the spiral is (lower == tighter)
  const SPACING = p.random([0.1, 0.3, 1, 2, 3]);
  // controls how much spread there is between spirals
  const OFFSET = p.random([3, 5, 10, 25, 50]);

  console.log({
    ANGULAR_SPEED,
    STROKE,
    SPACING,
    OFFSET,
  });

  // Calculated controls
  // const CENTER = [
  //   p.windowWidth / 2,
  //   p.windowHeight / 2,
  // ];
  const CENTER = [
    p.random(0, p.windowWidth),
    p.random(0, p.windowHeight),
  ];
  const MAX_RADIUS = p.max([
    p.dist(0, 0, ...CENTER),
    p.dist(0, p.windowHeight, ...CENTER),
    p.dist(p.windowWidth, 0, ...CENTER),
    p.dist(p.windowWidth, p.windowHeight, ...CENTER),
  ]) + STROKE;
  let SPIRALS = [];

  const spiralDefaults = {
    angularSpeed: ANGULAR_SPEED,
    spacing: SPACING,
    center: CENTER,
    stroke: STROKE,
    radius: MAX_RADIUS,
    color: p.color(100),
  };

  const spiralConfig = [
    {
      ...spiralDefaults,
    },
    {
      ...spiralDefaults,
      spacing: SPACING,
      center: [
        CENTER[0] + (p.cos(0) * OFFSET),
        CENTER[1] + (p.sin(0) * OFFSET)
      ],
      color: p.color(60, 100, 50, 0.5),
    },
    {
      ...spiralDefaults,
      spacing: SPACING,
      center: [
        CENTER[0] + (p.cos(120) * OFFSET),
        CENTER[1] + (p.sin(120) * OFFSET)
      ],
      color: p.color(180, 100, 50, 0.5),
    },
    {
      ...spiralDefaults,
      spacing: SPACING,
      center: [
        CENTER[0] + (p.cos(240) * OFFSET),
        CENTER[1] + (p.sin(240) * OFFSET)
      ],
      color: p.color(300, 100, 50, 0.5),
    },
  ];

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(60);
    p.background(0);
    spiralConfig.forEach(spiral => {
      SPIRALS.push(new Spiral(spiral));
    });
  };

  p.draw = () => {
    const inProgress = SPIRALS.map((_spiral, index) => index);

    SPIRALS.forEach((spiral, index) => {
      if (spiral.drawPoint(p, p.frameCount)) {
        return;
      }
      // if the spiral is not continuing, remove it from inProgress
      inProgress.splice(index, 1);
    });

    // if all the spirals are finished, stop looping
    if (inProgress.length === 0) {
      p.noLoop();
    }
  };
};
