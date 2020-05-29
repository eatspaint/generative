export default (p) => {
  const xResolution = p.windowWidth * p.pixelDensity();
  const yResolution = p.windowHeight * p.pixelDensity();
  let xImg;
  let yImg;
  let cImg;

  let outputImg;

  const prepareImages = () => {
    xImg.resize(xResolution, yResolution);
    yImg.resize(xResolution, yResolution);
    cImg.resize(xResolution, yResolution);
  
    xImg.filter(p.GRAY);
    yImg.filter(p.GRAY);
  
    xImg.loadPixels();
    yImg.loadPixels();
    cImg.loadPixels();
  
    outputImg.loadPixels();
  }

  // This makes the process loop a little harder to read, but saves a ton of calc time
  const xComp = xResolution / 255;
  const yComp = yResolution * yResolution / 255;

  const processImages = () => {
    for (let i = 0; i < (outputImg.pixels.length / 4); i++) {
      let x = p.floor(getPixVal(xImg, i) * xComp);
      let y = p.floor(getPixVal(yImg, i) * yComp);
      let pixel = p.floor(x + y);

      // Lookup the color of said pixel
      let color = getColor(cImg.pixels, (pixel * 4));
      setPix(color, (i * 4));
    }

    outputImg.updatePixels();
  };

  const getPixVal = (img, i) => (
    img.pixels[i * 4]
  );

  const getColor = (pixels, i) => pixels.slice(i, i + 4);

  const setPix = (color, i) => {
    const [r, g, b, a] = color;
    outputImg.pixels[i] = r;
    outputImg.pixels[i + 1] = g;
    outputImg.pixels[i + 2] = b;
    outputImg.pixels[i + 3] = a;
  };

  p.preload = () => {
    // Slightly offsetting resolutions ensures we don't get the same img cached when hitting unsplash
    xImg = p.loadImage(`https://source.unsplash.com/random/${xResolution}x${yResolution + 1}`);
    yImg = p.loadImage(`https://source.unsplash.com/random/${xResolution + 1}x${yResolution}`);
    cImg = p.loadImage(`https://source.unsplash.com/random/${xResolution}x${yResolution}`);

    outputImg = p.createImage(xResolution, yResolution);
  };

  p.setup = () => {
    p.colorMode(p.HSL);
    p.angleMode(p.DEGREES);
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(10);

    prepareImages();
    processImages();
  };

  p.draw = () => {
    p.image(outputImg, 0, 0, p.windowWidth, p.windowHeight);
    p.noLoop();
  };
};
