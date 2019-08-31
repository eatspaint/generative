import p5 from 'p5';

const sketch = (p) => {
  // The height/width of a triangle
  let size = 100;
  // Multiplied by Perlin noise value (0..1), determines scale of jitter
  let noiseImpact = 0.9;
  // Maximum allowed variance from hueRoot
  let maxHueVariance = 60;

  p.setup = () => {
    p.colorMode(p.HSL);
    let width = p.windowWidth - (p.windowWidth % size);
    let height = p.windowHeight - (p.windowHeight % size);
    p.createCanvas(width, height);
    p.frameRate(10);
  };

  p.draw = () => {
    p.background(255);

    let mouseXAngle = (p.mouseX / p.width) * 360;
    let mouseYAngle = ((p.height - p.mouseY) / p.height) * maxHueVariance;

    for (let i = 0; i * size < p.width; i++) {
      let x = i * size;
      for (let j = 0; j * size < p.height; j++) {
        let y = j * size;
        let jitter = size * (noiseImpact * p.noise(x, y, p.frameCount));
        let x1 = p.width - x;
        let x2 = x1 - (size - jitter);
        let x3 = x1;
        let y1 = p.height - y;
        let y2 = y1;
        let y3 = y1 - (size - jitter);
        let hueNoise = p.sin(p.noise(y, x, p.frameCount) * 360);
        let hue = (mouseXAngle + (mouseYAngle * hueNoise)) % 360;
        p.fill(hue, 100, 50);
        p.stroke(hue, 100, 50);
        p.triangle(x1, y1, x2, y2, x3, y3);
      }
    }
    // noLoop();
  };
};

const P5 = new p5(sketch);