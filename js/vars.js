//
// amodo
// a random walker powered texture generator
//

const VERSION = '1.0.0';

// dom
const helpContainerEl = document.getElementsByClassName('helpContainer')[0];
const closeHelpButton = document.getElementsByClassName('closeHelpButton')[0];
closeHelpButton.addEventListener('click', () => { helpContainerEl.style.display = 'none'; });
const versionEl = document.getElementsByClassName('version');
versionEl.forEach((item) => {
  item.textContent = 'v' + VERSION;
});
const mainCanvasEl = document.getElementById('mainCanvas');
const appInfoEl = document.getElementsByClassName('appInfo')[0];
let appInfoZoomEl = false;

// vars
let appInfoCanvasHTML = false;
let appInfoZoomHTML = false;
let bgBuffer = false;
let baseBgColor = [20, 20, 20];
let bgColor = [11, 12, 12];
let bgImg = false;
let bgImgVisible = false;
let blendModeName = 'BLEND';
let brushAlpha = 255;
let brushImgs = [];
let brushSize = 1;
let brushSizeMultiplier = 1;
let brushSpacing = 1;
let brushShape = 'ellipse (solid)';
let brushType = 'shape';
let canvasPosition;
let canvasResolution = 256;
let capturedMouse;
let clickFactor;
let colors = [
  [37, 44, 44],
  [249, 240, 107],
  [106, 196, 170]
];
let exportBuffer = false;
let guiSettings = false;
let initialCanvasPosition;
let inputBgImage;
let inputBrushImage;
let jitterAlpha = 0;
let jitterHue = 0;
let jitterLightness = 0;
let jitterColorMode = 'per point';
let jitterTransformMode = 'per point';
let jitterSaturation = 0;
let jitterSize = 0;
let lastCanvasPosition;
let loadedGUISettings;
let maxSteps = 2000;
let maxStepsMultiplier = 1;
let pressingMouse = false;
let renderBgOnSave = false;
let rotateBrush = true;
let textureSizes = [64, 128, 256, 512, 1024, 2048, 4096, 8192];
let tintBrush = true;
let nonUniformSizeJitter = false;
let useTextureSize = false;
let walkers = [];
let walkersGravFalloffPercent = 0.9;
let walkersMode = 'random walk';
let walkersBuffer = false;
let zoomFactor = 1;

