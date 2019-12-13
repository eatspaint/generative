export default (p) => {
  p.setup = () => {
    p.colorMode(p.HSL);
    p.angleMode(p.DEGREES);
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(10);
  };

  p.draw = () => {
    p.noLoop();
  };
};
