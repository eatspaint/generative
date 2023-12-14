export default (p) => {
  const xResolution = p.windowWidth;
  const yResolution = p.windowHeight;
  let xImg;
  let yImg;
  let cImg;

  let ready = false;
  let outputImg;

  const prepareImages = () => {
    xImg.resize(xResolution, yResolution);
    yImg.resize(xResolution, yResolution);
    cImg.resize(xResolution, yResolution);

    // xImg.filter(p.GRAY);
    // yImg.filter(p.GRAY);

    xImg.loadPixels();
    yImg.loadPixels();
    cImg.loadPixels();

    outputImg.loadPixels();
  }

  const processImages = () => {
    for (let i = 0; i < (outputImg.pixels.length / 4); i++) {
      // Find x & y coords within resolution based on pixel brightness
      let x = p.floor(p.map(getPixVal(xImg, i), 0, 765, 0, xResolution));
      let y = p.floor(p.map(getPixVal(yImg, i), 0, 765, 0, yResolution));
      // Use x/y coords to find a specific pixel index for sampling
      let pixel = p.floor(x + (y * xResolution));
      // Lookup the color of said pixel
      let color = getColor(cImg.pixels, (pixel * 4));
      setPix(color, (i * 4));
    }

    outputImg.updatePixels();
  };

  // get sum of RGB space for pixel; output range: (0..765)
  const getPixVal = (img, i) => {
    const idx = i * 4;
    return img.pixels[idx] + img.pixels[idx + 1] + img.pixels[idx + 2];
  };

  const getColor = (pixels, i) => pixels.slice(i, i + 4);

  const setPix = (color, i) => {
    const [r, g, b, a] = color;
    outputImg.pixels[i] = r;
    outputImg.pixels[i + 1] = g;
    outputImg.pixels[i + 2] = b;
    outputImg.pixels[i + 3] = a;
  };

  p.preload = () => {
    outputImg = p.createImage(xResolution, yResolution);
  };

  let status = 'Requesting first image...';
  p.setup = () => {
    p.colorMode(p.HSL);
    p.angleMode(p.DEGREES);
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(10);

    let [xImgPrompt, yImgPrompt, cImgPrompt] = [undefined, undefined, undefined];

    // proper window.location.search isn't defined since we're using a hash router
    const search = window.location.href.split('?')[1]

    if (search) {
      [xImgPrompt, yImgPrompt, cImgPrompt] = search.split('-');
      console.log([xImgPrompt, yImgPrompt, cImgPrompt]);
    }

    const baseUrl = 'https://source.unsplash.com/random';
    // Slightly offsetting resolutions ensures we don't get the same img cached when hitting unsplash
    const xUrl = `${baseUrl}/${xResolution}x${yResolution + 1}${xImgPrompt ? `?${xImgPrompt}` : ''}`
    const yUrl = `${baseUrl}/${xResolution + 1}x${yResolution}${yImgPrompt ? `?${yImgPrompt}` : ''}`
    const cUrl = `${baseUrl}/${xResolution}x${yResolution}${cImgPrompt ? `?${cImgPrompt}` : ''}`

    // Nested callbacks to prevent ios blocking parallel requests
    xImg = p.loadImage(xUrl, () => {
      status = 'Requesting second image...';
      p.loop();
      yImg = p.loadImage(yUrl, () => {
        status = 'Requesting third image...';
        p.loop();
        cImg = p.loadImage(cUrl, () => {
          prepareImages();
          processImages();
          ready = true;
          p.loop();
        });
      });
    });
  };

  p.draw = () => {
    p.background(255);
    if (!ready) {
      p.textSize(30);
      p.textAlign(p.CENTER);
      p.text(status, p.windowWidth / 2, (p.windowHeight / 2) + 15);
      p.noLoop();
    } else {
      p.image(outputImg, 0, 0, p.windowWidth, p.windowHeight);
      p.noLoop();
    }
  };
};
