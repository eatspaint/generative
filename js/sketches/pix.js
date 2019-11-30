export default (p) => {
  const fill = () => {
    p.loadPixels();
    for (let i = 0; i < p.pixels.length; i += 4) {
      p.pixels[i] = p.random(0, 256);
      p.pixels[i + 1] = p.random(0, 256);
      p.pixels[i + 2] = p.random(0, 256);
      p.pixels[i + 3] = 255;
    };
    p.updatePixels(0, 0, p.width, p.height);
  };

  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.pixelDensity(1);
    p.frameRate(10);
  };

  p.draw = () => {
    fill();
    // p.noLoop();
  };
};
