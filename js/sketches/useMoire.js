// https://medium.com/front-end-weekly/learning-the-p5-canvas-drawing-library-in-es6-and-webpack-bf514a679544
const initCanvas = (p) => {
  p.createCanvas(p.windowWidth, p.windowHeight);
  p.imageMode(p.CENTER);
  p.angleMode(p.DEGREES);
  p.translate(p.windowWidth / 2, p.windowHeight / 2);
  p.colorMode(p.HSL);
  p.background(40, 0, 15);
}

const initGraphics = (gfx) => {
  gfx.colorMode(gfx.HSL);
  gfx.stroke(180, 100, 50);
  gfx.strokeWeight(3);
}

const generatePoints = (gfx, count = 1000) => {
  for (let i = 0; i < count; i++) {
    let x = gfx.random(0, gfx.windowWidth + 1);
    let y = gfx.random(0, gfx.windowHeight + 1);
    gfx.point(x, y);
  }
}

const setup = (p) => () => {
  initCanvas(p);
  let gfx = p.createGraphics(p.windowWidth, p.windowHeight);
  initGraphics(gfx);
  generatePoints(gfx, 3000);
  p.image(gfx, 0, 0);
  p.rotate(1);
  p.image(gfx, 0, 0);
};

const draw = (p) => () => {
  p.noloop();
};

export const useMoire = (p) => [setup(p), draw(p)];
