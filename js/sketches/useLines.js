const setup = (p) => () => {
  p.colorMode(p.HSL);
  p.createCanvas(p.windowWidth, p.windowHeight);
  p.frameRate(10);
};

const draw = (p) => () => {
  let cyan = [180, 50, 50];
  p.background(...cyan);
};

export const useLines = (p) => [setup(p), draw(p)];
