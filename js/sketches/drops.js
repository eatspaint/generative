// import CCapture from 'ccapture.js';

const SPREAD_RATE = 0.05;

class Drop {
  constructor({ x, y, p, max, color }) {
    this.x = x; // x pos
    this.y = y; // y pos
    this.p = p; // P5 ref
    this.max = max; // max allowed size
    this.color = color;
    this.t = 0; // time
    this.d = 0; // diameter
    this.growing = true;
  }

  spread() {
    this.t += SPREAD_RATE;
    this.d = this.p.exp(this.t);
    this.growing = this.d <= this.max;
  }

  draw() {
    const { x, y, d, p, color } = this;
    const r = d / 2;
    p.push();
    p.fill(color);
    p.beginShape();
    // Fill screen with rect
    p.vertex(0, 0);
    p.vertex(p.windowWidth, 0);
    p.vertex(p.windowWidth, p.windowHeight);
    p.vertex(0, p.windowHeight);
    // p.rect(0, 0, p.windowWidth, p.w indowHeight);
    // p.circle(x, y, d);
    p.beginContour();
    // Cut out a circle
    // p.curveVertex(x, y);
    p.vertex(x - r, y);
    p.vertex(x, y + r);
    p.vertex(x + r, y);
    p.vertex(x, y - r);
    // p.curveVertex(x, y);
    p.endContour(p.CLOSE);
    p.endShape(p.CLOSE);
    p.pop();
  }

  tick() {
    if (this.growing) {
      this.draw();
      this.spread();
    }
  }
}

export default (p) => {
  const CENTER_X = p.windowWidth / 2;
  const CENTER_Y = p.windowHeight / 2;

  // const capturer = new CCapture({ format: 'png', framerate: 30 });

  const drops = [];

  const pickColor = () => {
    if (drops.length === 0) {
      return p.color(255);
    }
    const hueRoot = (p.frameCount % 360)
    return p.color((p.random(hueRoot, hueRoot + 90) % 360), 50, 50);
  }

  const maxDiamater = (x, y) => {
    return p.max([
      p.dist(0, 0, x, y),
      p.dist(p.windowWidth, 0, x, y),
      p.dist(p.windowWidth, p.windowHeight, x, y),
      p.dist(0, p.windowHeight, x, y),
    ]) * 2.5;
  }

  const TRAVEL = 30;
  let mostRecentDrop = {
    x: CENTER_X,
    y: CENTER_Y,
  }

  // this keeps the position from getting stuck in a corner
  const directionRange = () => {
    const frameAngle = p.frameCount % 360;
    return [frameAngle, frameAngle + 180]
  }

  // Calc next position based on last drop and current allowed directions for travel
  const nextPos = () => {
    let dir = p.map(p.noise((p.frameCount * 0.05)), 0, 1, ...directionRange());
    let x = p.constrain(
      ((p.sin(dir) * TRAVEL) + mostRecentDrop.x),
      0,
      p.windowWidth,
    );
    let y = p.constrain(
      ((p.cos(dir) * TRAVEL) + mostRecentDrop.y),
      0,
      p.windowHeight,
    );
    mostRecentDrop.x = x;
    mostRecentDrop.y = y;
    return { x, y };
  }

  const addDrop = () => {
    const { x, y } = nextPos();
    drops.unshift(new Drop({
      max: maxDiamater(x, y),
      color: pickColor(),
      x,
      y,
      p,
    }));
  }

  p.setup = () => {
    p.colorMode(p.HSL);
    p.angleMode(p.DEGREES);
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.stroke(0);
    p.strokeWeight(3);
    p.frameRate(30);

  };
  
  const FRAME_COUNT = 30 * 60; // 60 seconds @ 30fps

  p.draw = () => {
    // p.frameCount === 1 && capturer.start();
    p.background(255);
    // Since we draw in 30fps, frameCount % 30 === 0 would add a new drop every second
    if (p.frameCount % 5 === 0) {
      addDrop();
    }

    drops.forEach((drop, i) => {
      if (!drop.growing) {
        drops.splice(i, 1);
      }
      drop.tick();
    });

    // if (p.frameCount > FRAME_COUNT) {
    //   p.noLoop();
    //   capturer.stop();
    //   capturer.save();
    // }

    // capturer.capture(document.getElementById('defaultCanvas0'));
  };

  // Helper for pausing during dev
  let looping = true;
  p.mouseClicked = () => {
    if (looping) {
      p.noLoop();
      looping = !looping;
    } else {
      p.loop();
      looping = !looping;
    }
  }
};
