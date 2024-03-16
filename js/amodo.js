// p5

function setup() {
  // general
  frameRate(60);
  pixelDensity(1);

  // canvas
  const mainCanvas = createCanvas(windowWidth, windowHeight, WEBGL, document.getElementById('mainCanvas'));
  initialCanvasPosition = {
    x: width / 2,
    xMax: (width / 2) + ((canvasResolution / 2) * zoomFactor),
    xMin: (width / 2) - ((canvasResolution / 2) * zoomFactor),
    y: height / 2,
    yMax: (height / 2) + ((canvasResolution / 2) * zoomFactor),
    yMin: (height / 2) - ((canvasResolution / 2) * zoomFactor),
  };
  canvasPosition = JSON.parse(JSON.stringify(initialCanvasPosition));
  lastCanvasPosition = JSON.parse(JSON.stringify(initialCanvasPosition));

  // framebuffers
  bgBuffer = createFramebuffer({ height: canvasResolution, width: canvasResolution });
  redrawBackground();
  walkersBuffer = createFramebuffer({ format: FLOAT, height: canvasResolution, width: canvasResolution });
  exportBuffer = createFramebuffer();

  // inputs
  inputBgImage = createFileInput(handleBgImage);
  inputBgImage.elt.classList.add('inputBgImage');
  inputBrushImage = createFileInput(handleBrushImage, true);
  inputBrushImage.elt.classList.add('inputBrushImage');
  inputBrushImage.elt.addEventListener('change', () => { brushImgs = [] });

  // settings
  if (walkersBuffer) { // TODO: investigate why loadGUISettings() needs walkersBuffer
    // TODO: clean the loading/saving, give info to user
    loadedGUISettings = loadGUISettings();
    if (!loadedGUISettings) saveGUISettings();
  }
  ctrlSettingsFolder.close();
}

function draw() {
  translate(-width / 2, -height / 2);

  handleMMB();
  calculateCanvasOuterCoords();

  background(baseBgColor);

  imageMode(CENTER);
  image(bgBuffer, int(canvasPosition.x), int(canvasPosition.y), canvasResolution * zoomFactor, canvasResolution * zoomFactor);

  walkersBuffer.begin();
  for (let i = 0; i < walkers.length; i++) {
    for (let j = 0; j < 5000 / walkers.length; j++) {
      if (walkers[i].steps < maxSteps * maxStepsMultiplier) {
        walkers[i].render();
        walkers[i].step();
      }
    }
  }
  walkersBuffer.end();

  push();
  imageMode(CENTER);
  doBlendMode(blendModeName);
  image(walkersBuffer, int(canvasPosition.x), int(canvasPosition.y), canvasResolution * zoomFactor, canvasResolution * zoomFactor);
  pop();
}

