export default (p) => {
  const fill = () => {
    for (let x = 0; x <= p.windowWidth; x++) {
      for (let y = 0; y <= p.windowHeight; y++) {
        let val = p.noise(x * 0.005, y * 0.005);
        let hue = p.map(val, 0, 1, 0, 360 * 45) % 360;
        p.stroke(hue, 100, 50);
        p.point(x, y);
      }
    }
  };

  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(p.windowWidth, p.windowHeight);
    fill();
  };

  p.draw = () => {
    p.noLoop();
  };
};
