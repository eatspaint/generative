export default (p) => {
  const fill = () => {
    p.background(0);
    let time = p.frameCount * 0.005;
    for (let x = 0; x <= p.windowWidth; x++) {
      for (let y = 0; y <= p.windowHeight; y++) {
        let val = p.noise(x * 0.005, y * 0.005, time);
        let hue = p.map(val, 0, 1, 0, 360 * 45) % 360;
        if ((val > 0.4 && val < 0.6) || val < 0.3 || val > 0.7) {
          p.stroke(hue, 100, 50);
          p.point(x, y);
        }
      }
    }
  };

  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(10);
  };

  p.draw = () => {
    fill();
    p.noLoop();
  };
};
