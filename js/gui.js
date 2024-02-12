const GUI = lil.GUI;
const gui = new GUI({ title: 'Parameters' });

let guiParams = {
  bgColor: bgColor,
  blendMode: blendModeName,
  brushAlpha: brushAlpha,
  brushShape: brushShape,
  brushSize: brushSize,
  brushSizeMultiplier: brushSizeMultiplier,
  brushSpacing: brushSpacing,
  brushType: brushType,
  centerCanvas: function() { centerCanvas(); },
  clearWalkers: function() { clearWalkers(); },
  color1: colors[0],
  color2: colors[1],
  color3: colors[2],
  jitterAlpha: jitterAlpha,
  jitterHue: jitterHue,
  jitterLightness: jitterLightness,
  jitterColorMode: jitterColorMode,
  jitterTransformMode: jitterTransformMode,
  jitterSaturation: jitterSaturation,
  jitterSize: jitterSize,
  loadBgImg: function() { inputBgImage.elt.click(); },
  loadBrushImg: function() { inputBrushImage.elt.click(); },
  maxSteps: maxSteps,
  maxStepsMultiplier: maxStepsMultiplier,
  nonUniformSizeJitter: nonUniformSizeJitter,
  openHelp: function() { openHelp(); },
  redrawWalkers: function() { redrawWalkers(); },
  reloadGUISettings: function() { reloadGUISettings(); },
  renderBgOnSave: renderBgOnSave,
  resetGUISettings: function() { resetGUISettings(); },
  resetZoom: function() { resetZoom(); },
  resolution: canvasResolution,
  rotateBrush: rotateBrush,
  saveGUISettings: function() { saveGUISettings(true); },
  saveImg: function() { saveImg(); },
  tintBrush: tintBrush,
  toggleBgImg: function() { toggleBgImg(); },
  useTextureSize: useTextureSize,
  walkersMode: walkersMode,
  walkersGravFalloffPercent: walkersGravFalloffPercent,
}

// gui
const ctrlOpenHelp = gui
  .add(guiParams, 'openHelp')
  .name('Open help');
const ctrlTextureFolder = gui.addFolder('Texture size');
ctrlTextureFolder
  .add(guiParams, 'resolution', textureSizes)
  .name('Texture size')
  .onChange( value => { 
    canvasResolution = value;
    if (zoomFactor !== 1) {
      renderAppInfoZoom();
    };
    redrawBackground();
    redrawWalkers();
  });
const ctrlBackgroundFolder = gui.addFolder('Background');
ctrlBackgroundFolder
  .addColor(guiParams, 'bgColor', 255)
  .name('Background color')
  .onChange( () => {
    redrawBackground();
  });
const ctrlLoadBgImg = ctrlBackgroundFolder
  .add(guiParams, 'loadBgImg')
  .name('Load background image');
const ctrlToggleBgImg = ctrlBackgroundFolder
  .add(guiParams, 'toggleBgImg')
  .name('Toggle background image')
  .disable();
const ctrlWalkersFolder = gui.addFolder('Walkers');
ctrlWalkersFolder
  .add(guiParams, 'walkersMode', ['random walk', 'perlin noise', 'gravity'])
  .name('Walkers mode')
  .onChange( value => { 
    walkersMode = value;
    ctrlWalkersGravFalloffPercent.show(value === 'gravity');
    redrawWalkers();
  });
const ctrlWalkersGravFalloffPercent = ctrlWalkersFolder
  .add(guiParams, 'walkersGravFalloffPercent', 0, 1, 0.1)
  .name('Gravity falloff start %')
  .onChange( value => {
    walkersGravFalloffPercent = value;
    redrawWalkers();
  })
  .hide();
ctrlWalkersFolder
  .add(guiParams, 'maxSteps', 100, 10000, 50)
  .name('Max steps')
  .onChange( value => {
    maxSteps = value;
    redrawWalkers();
  });
ctrlWalkersFolder
  .add(guiParams, 'maxStepsMultiplier', 1, 20, 1)
  .name('Max steps multiplier')
  .onChange( value => {
    maxStepsMultiplier = value;
    redrawWalkers();
  });
const ctrlRedrawWalkers = ctrlWalkersFolder
  .add(guiParams, 'redrawWalkers')
  .name('Redraw walkers')
  .disable();
const ctrlClearWalkers = ctrlWalkersFolder
  .add(guiParams, 'clearWalkers')
  .name('Clear walkers');
const ctrlColorFolder = ctrlWalkersFolder.addFolder('Colors');
ctrlColorFolder
  .addColor(guiParams, 'color1', 255)
  .name('Color 1')
  .onChange( () => { redrawWalkers(); } );
ctrlColorFolder
  .addColor(guiParams, 'color2', 255)
  .name('Color 2')
  .onChange( () => { redrawWalkers(); } );
ctrlColorFolder.addColor(guiParams, 'color3', 255)
  .name('Color 3')
  .onChange( () => { redrawWalkers(); } );
const ctrlBrushFolder = gui.addFolder('Brush');
ctrlBrushFolder
  .add(guiParams, 'brushType', ['shape', 'custom'])
  .name('Brush type')
  .onChange( value => {
    brushType = value;
    ctrlBrushShape.show(value === 'shape');
    ctrlLoadBrushImg.show(value === 'custom');
    ctrlTintBrush.show(value === 'custom');
    ctrlUseTextureSize.show(value === 'custom');
    if (brushImgs.length > 0) {
      redrawWalkers();
    }
  });
const ctrlLoadBrushImg = ctrlBrushFolder
  .add(guiParams, 'loadBrushImg')
  .name('Load brush texture(s)')
  .hide();
const ctrlTintBrush = ctrlBrushFolder
  .add(guiParams, 'tintBrush')
  .name('Tint brush')
  .onChange( value => {
    tintBrush = value;
    redrawWalkers();
  })
  .hide();
const ctrlUseTextureSize = ctrlBrushFolder
  .add(guiParams, 'useTextureSize')
  .name('Use texture size')
  .onChange( value => {
    useTextureSize = value;
    redrawWalkers();
  })
  .hide();
const ctrlBrushShape = ctrlBrushFolder
  .add(guiParams, 'brushShape', ['ellipse (solid)', 'ellipse (stroked)', 'square (solid)', 'square (stroked)', 'triangle (solid)', 'triangle (stroked)'])
  .name('Brush shape')
  .onChange( value => {
    brushShape = value;
    redrawWalkers();
  });
const ctrlBrushSize = ctrlBrushFolder
  .add(guiParams, 'brushSize', 1, 50, 1)
  .name('Brush size')
  .onChange( value => {
    brushSize = value;
    redrawWalkers();
  });
const ctrlBrushSizeMultiplier = ctrlBrushFolder
  .add(guiParams, 'brushSizeMultiplier', 1, 3, 0.1)
  .name('Brush size multiplier')
  .onChange( value => {
    brushSizeMultiplier = value;
    redrawWalkers();
  });
ctrlBrushFolder
  .add(guiParams, 'brushSpacing', 0.1, 30, 0.1)
  .name('Brush spacing')
  .onChange( value => {
    brushSpacing = value;
    redrawWalkers();
  });
ctrlBrushFolder
  .add(guiParams, 'brushAlpha', 0, 255, 1)
  .name('Brush alpha')
  .onChange( value => {
    brushAlpha = value;
    redrawWalkers();
  });
ctrlBrushFolder
  .add(guiParams, 'rotateBrush')
  .name('Rotate every step')
  .onChange( value => {
    rotateBrush = value;
    redrawWalkers();
  });
const ctrlJitterFolder = ctrlBrushFolder.addFolder('Jitter');
ctrlJitterFolder
  .add(guiParams, 'jitterColorMode', ['per point', 'per stroke', 'both'])
  .name('Jitter color mode')
  .onChange( value => {
    jitterColorMode = value;
    redrawWalkers();
  });
ctrlJitterFolder
  .add(guiParams, 'jitterHue', 0, 255, 1)
  .name('Jitter hue')
  .onChange( value => {
    jitterHue = value;
    redrawWalkers();
  });
ctrlJitterFolder
  .add(guiParams, 'jitterSaturation', 0, 255, 1)
  .name('Jitter saturation')
  .onChange( value => {
    jitterSaturation = value;
    redrawWalkers();
  });
ctrlJitterFolder
  .add(guiParams, 'jitterLightness', 0, 255, 1)
  .name('Jitter lightness')
  .onChange( value => {
    jitterLightness = value;
    redrawWalkers();
  });
ctrlJitterFolder
  .add(guiParams, 'jitterAlpha', 0, 255, 1)
  .name('Jitter alpha')
  .onChange( value => {
    jitterAlpha = value;
    redrawWalkers();
  });
ctrlJitterFolder
  .add(guiParams, 'jitterTransformMode', ['per point', 'per stroke', 'both'])
  .name('Jitter transform mode')
  .onChange( value => {
    jitterTransformMode = value;
    redrawWalkers();
  });
const ctrlJitterSize = ctrlJitterFolder
  .add(guiParams, 'jitterSize', 0, 30, 0.1)
  .name('Jitter size')
  .onChange( value => {
    jitterSize = value;
    redrawWalkers();
  });
const ctrlNonUniformSizeJitter = ctrlJitterFolder
  .add(guiParams, 'nonUniformSizeJitter')
  .name('Non-uniform size jitter')
  .onChange( value => {
    nonUniformSizeJitter = value;
    redrawWalkers();
  });
const ctrlCanvasFolder = gui.addFolder('Canvas');
ctrlCanvasFolder
  .add(guiParams, 'blendMode', ['BLEND', 'MULTIPLY', 'ADD', 'SCREEN', 'REMOVE'])
  .name('Blend mode')
  .onChange( value => {
    blendModeName = value;
  });
const ctrlCenterCanvas = ctrlCanvasFolder
  .add(guiParams, 'centerCanvas')
  .name('Center canvas')
  .disable();
const ctrlResetZoom = ctrlCanvasFolder
  .add(guiParams, 'resetZoom')
  .name('Reset zoom')
  .disable();
const ctrlSettingsFolder = gui.addFolder('Settings');
const ctrlResetGUISettings = ctrlSettingsFolder
  .add(guiParams, 'resetGUISettings')
  .name('Reset to default');
const ctrlReloadGUISettings = ctrlSettingsFolder
  .add(guiParams, 'reloadGUISettings')
  .name('Reload saved settings')
  .disable();
const ctrlSaveGUISettings = ctrlSettingsFolder
  .add(guiParams, 'saveGUISettings')
  .name('Save current settings');
const ctrlFileFolder = gui.addFolder('File');
ctrlFileFolder
  .add(guiParams, 'renderBgOnSave')
  .name('Render background')
  .onChange( value => {
    renderBgOnSave = value;
  });
const ctrlSaveImg = ctrlFileFolder
  .add(guiParams, 'saveImg')
  .name('Save to .png file');

gui.onFinishChange( e => {
  if (brushType === 'custom' && useTextureSize) {
    ctrlBrushSize.disable();
    ctrlBrushSizeMultiplier.disable();
    ctrlJitterSize.disable();
    ctrlNonUniformSizeJitter.disable();
  } else {
    ctrlBrushSize.enable();
    ctrlBrushSizeMultiplier.enable();
    ctrlJitterSize.enable();
    ctrlNonUniformSizeJitter.enable();
  }
});

// icons
prependSVGIcon(document.querySelector('.closeHelpButton'), SVGXmark);
document.querySelector('.closeHelpButton').classList.add('destructiveAction');

prependSVGIcon(ctrlOpenHelp.domElement.querySelector('button'), SVGHelpCircle);
prependSVGIcon(ctrlTextureFolder.domElement.querySelector('.title'), SVGAngleTool);
prependSVGIcon(ctrlBackgroundFolder.domElement.querySelector('.title'), SVGMediaImage);
prependSVGIcon(ctrlLoadBgImg.domElement.querySelector('button'), SVGFolder);
prependSVGIcon(ctrlToggleBgImg.domElement.querySelector('button'), SVGEye);
prependSVGIcon(ctrlWalkersFolder.domElement.querySelector('.title'), SVGWalk);
prependSVGIcon(ctrlRedrawWalkers.domElement.querySelector('button'), SVGRefresh);
prependSVGIcon(ctrlClearWalkers.domElement.querySelector('button'), SVGXmark);
ctrlClearWalkers.domElement.querySelector('button').classList.add('destructiveAction');
prependSVGIcon(ctrlColorFolder.domElement.querySelector('.title'), SVGColor);
prependSVGIcon(ctrlBrushFolder.domElement.querySelector('.title'), SVGBrush);
prependSVGIcon(ctrlLoadBrushImg.domElement.querySelector('button'), SVGFolder);
prependSVGIcon(ctrlJitterFolder.domElement.querySelector('.title'), SVGArrowsRandom);
prependSVGIcon(ctrlCanvasFolder.domElement.querySelector('.title'), SVGFrameAltEmpty);
prependSVGIcon(ctrlCenterCanvas.domElement.querySelector('button'), SVGCenterAlign);
prependSVGIcon(ctrlResetZoom.domElement.querySelector('button'), SVGZoomCancel);
prependSVGIcon(ctrlSettingsFolder.domElement.querySelector('.title'), SVGSettings);
prependSVGIcon(ctrlResetGUISettings.domElement.querySelector('button'), SVGXmark);
ctrlResetGUISettings.domElement.querySelector('button').classList.add('destructiveAction');
prependSVGIcon(ctrlReloadGUISettings.domElement.querySelector('button'), SVGRefresh);
prependSVGIcon(ctrlSaveGUISettings.domElement.querySelector('button'), SVGFloppyDisk);
prependSVGIcon(ctrlFileFolder.domElement.querySelector('.title'), SVGFloppyDisk);
prependSVGIcon(ctrlSaveImg.domElement.querySelector('button'), SVGFloppyDisk);

// info
appendLoadBrushImgInfo(ctrlLoadBrushImg.domElement);
const loadBrushImgInfo = document.querySelector('.loadBrushImgInfo');
