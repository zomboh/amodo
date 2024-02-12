function appendLoadBrushImgInfo(el) {
  let html = `
    <div class='loadBrushImgInfo'>
      <p class='loadBrushImgInfoContent'>
        No texture(s) loaded yet.
      </p>
    </div>
  `;
  el.style.flexFlow = 'column nowrap';
  el.insertAdjacentHTML('beforeend', html);
}

function calculateCanvasOuterCoords() {
  canvasPosition.xMax = canvasPosition.x + ((canvasResolution / 2) * zoomFactor);
  canvasPosition.xMin = canvasPosition.x - ((canvasResolution / 2) * zoomFactor);
  canvasPosition.yMax = canvasPosition.y + ((canvasResolution / 2) * zoomFactor);
  canvasPosition.yMin = canvasPosition.y - ((canvasResolution / 2) * zoomFactor);

  if (canvasPosition.xMax < 0 || canvasPosition.xMin > width || canvasPosition.yMax < 0 || canvasPosition.yMin > height) {
    if (document.getElementsByClassName('appInfoItemCanvas')[0]) return;
    renderAppInfoCanvas();
  } else {
    if (document.getElementsByClassName('appInfoItemCanvas')[0]) {
      appInfoCanvasEl = document.getElementsByClassName('appInfoItemCanvas')[0];
      appInfoCanvasEl.remove();
    }
  }
}

function centerCanvas() {
  canvasPosition = JSON.parse(JSON.stringify(initialCanvasPosition));
  ctrlCenterCanvas.disable();
}

function clamp(val, min, max) {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

function clearWalkers() {
  walkersBuffer.begin();
  clear();
  walkersBuffer.end();
  walkers = [];
  ctrlRedrawWalkers.disable();
}

function doBlendMode(blendModeName) {
  switch (blendModeName) {
    case 'BLEND':
      blendMode(BLEND);
      break;
    case 'MULTIPLY':
      blendMode(MULTIPLY);
      break;
    case 'ADD':
      blendMode(ADD);
      break;
    case 'SCREEN':
      blendMode(SCREEN);
      break;
    case 'REMOVE':
      blendMode(REMOVE);
      break;
    default:
      blendMode(BLEND);
      break;
  }
}

function handleBgImage(file) {
  if (file.type === 'image') {
    loadImage(file.data, handleBgImageSuccess);
  }
}

function handleBgImageSuccess(img) {
  // TODO: should bgImg be an object with a 'visible' prop?
  bgImg = img;
  bgImgVisible = true;
  redrawBackground();
  ctrlToggleBgImg.enable();
}

function handleBrushImage(file) {
  if (file.type === 'image') {
    loadImage(file.data, handleBrushImageSuccess);
  }
}

function handleBrushImageSuccess(img) {
  brushImgs.push(img);
  document.querySelector('.loadBrushImgInfoContent').classList.add('success');
  document.querySelector('.loadBrushImgInfoContent').textContent = 'Texture(s) succesfully loaded';
  redrawWalkers();
}

function handleMMB() {
  if (pressingMouse && mouseButton === CENTER) {
    canvasPosition.x = lastCanvasPosition.x - (capturedMouse[0] - mouseX);
    canvasPosition.y = lastCanvasPosition.y - (capturedMouse[1] - mouseY);
    if (canvasPosition.x !== initialCanvasPosition.x) ctrlCenterCanvas.enable();
  }
}

function keyPressed() {
  if (helpContainerEl.style.display === 'flex' && keyCode === ESCAPE) {
    helpContainerEl.style.display = 'none';
  }
}

function loadGUISettings() {
  if (localStorage['lil-gui-settings']) {
    if (!localStorage['amodo-version'] || localStorage['amodo-version'] !== VERSION) {
      localStorage.removeItem('amodo-version');
      localStorage.removeItem('lil-gui-settings');
      return false;
    } else {
      guiSettings = localStorage.getItem('lil-gui-settings');
      guiSettings = JSON.parse(guiSettings);
      gui.load(guiSettings);
      ctrlReloadGUISettings.enable();
      return true;
    }
  } else {
    return false;
  }
}

function mousePressed(e) {
  if (e.target.classList.contains('helpContainer')) {
    helpContainerEl.style.display = 'none';
  }
  if (e.target.tagName !== 'CANVAS') return;
  pressingMouse = true;
  if (mouseButton === CENTER) {
    capturedMouse = [mouseX, mouseY];
    lastCanvasPosition = JSON.parse(JSON.stringify(canvasPosition));
  }
}

function mouseReleased(e) {
  if (mouseButton === LEFT) {
    clickFactor = [
      map(mouseX - canvasPosition.x, (-canvasResolution / 2) * zoomFactor, (canvasResolution / 2) * zoomFactor, 0, 1),
      map(mouseY - canvasPosition.y, (-canvasResolution / 2) * zoomFactor, (canvasResolution / 2) * zoomFactor, 0, 1)
    ];

    if (clickFactor[0] < 0 || clickFactor[0] > 1 || clickFactor[1] < 0 || clickFactor[1] > 1) return;

    if (e.target.tagName !== 'CANVAS') return;
    walkers.push(new Walker(clickFactor));
    ctrlRedrawWalkers.enable();
  }
  pressingMouse = false;
}

function mouseWheel(e) {
  if (e.target.tagName === 'CANVAS') {
    if ((e.delta > 0 && zoomFactor === 0.1) || (e.delta < 0 && zoomFactor === 3)) return false;
    if (e.delta > 0) {
      zoomFactor -= 0.1;
    } else {
      zoomFactor += 0.1;
    }
    zoomFactor = clamp(parseFloat(zoomFactor.toPrecision(2)), 0.1, 3);
    if (zoomFactor === 1) {
      ctrlResetZoom.disable();
    } else {
      ctrlResetZoom.enable();
    }
    renderAppInfoZoom();
    return false;
  }
}

function openHelp() {
  helpContainerEl.style.display = 'flex';
  document.activeElement.blur(); // Needed so ESC works after opening help
}

function popNotification(controller, msg) {
  if (!controller || !msg) return;

  let el = controller.domElement;
  if (el && msg) {
    el.style.setProperty('position', 'relative');

    let notification = document.createElement('div');
    notification.textContent = msg;
    notification.classList.add('notification');

    el.appendChild(notification);
    setTimeout(function() { el.removeChild(notification); }, 1000);
  }
}

function prependSVGIcon(el, iconId, extraClass='') {
  let html = `
    <svg class="SVGIcon ${extraClass}" width="24px" height="24px" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg">
    ${iconId}
    </svg>
  `;
  el.insertAdjacentHTML('afterbegin', html);
}

function redrawBackground() {
  if (bgBuffer.width !== canvasResolution || bgBuffer.height !== canvasResolution) {
    bgBuffer.resize(canvasResolution, canvasResolution);
  }
  bgBuffer.begin();
  clear();
  background(bgColor);
  if (bgImg && bgImgVisible) {
    image(bgImg, 0, 0, bgBuffer.width, bgBuffer.height);
  }
  bgBuffer.end();
}

function redrawWalkers() {
  if (walkersBuffer.width !== canvasResolution || walkersBuffer.height !== canvasResolution) {
    walkersBuffer.resize(canvasResolution, canvasResolution);
  }

  walkersBuffer.begin();
  clear();
  walkersBuffer.end();

  if (walkers.length > 0) {
    for (let i = 0; i < walkers.length; i++) {
      walkers[i].updateValues();
    }
  }
}

function reloadGUISettings() {
  loadGUISettings();
  popNotification(ctrlReloadGUISettings, 'Settings reloaded!');
}

// TODO: clean up this mess
function renderAppInfoCanvas() {
  appInfoCanvasHTML = `
    <div class="appInfoItem appInfoItemCanvas">
      <p>
        Looks like your canvas is outside the working area!
      </p>
        <button class="button appInfoItemButton" onclick="centerCanvas()" role="button">
          Center Canvas
        </button>
    </div>
  `;
  appInfoEl.insertAdjacentHTML('beforeend', appInfoCanvasHTML);
  prependSVGIcon(appInfoEl.querySelector('.appInfoItemCanvas button'), SVGCenterAlign);
}

function renderAppInfoZoom() {
  if (document.getElementsByClassName('appInfoItemZoom')[0]) {
    appInfoZoomEl = document.getElementsByClassName('appInfoItemZoom')[0];
    appInfoZoomEl.remove();
  }

  if (zoomFactor !== 1) {
  appInfoZoomHTML = `
    <div class="appInfoItem appInfoItemZoom">
      <p>
        Current zoom: <strong>x${zoomFactor}</strong> <em>(Real size: ${canvasResolution}x${canvasResolution}px)</em>
      </p>
        <button class="button appInfoItemButton" onclick="resetZoom()" role="button">
          Reset zoom
        </button>
    </div>
  `;
  appInfoEl.insertAdjacentHTML('afterbegin', appInfoZoomHTML);
  }

  if (document.getElementsByClassName('appInfoItemZoom')[0]) {
    prependSVGIcon(appInfoEl.querySelector('button'), SVGZoomCancel);
  }
}

function resetGUISettings() {
  gui.reset();
  popNotification(ctrlResetGUISettings, 'Settings reset!');
}

function resetZoom() {
  zoomFactor = 1;
  ctrlResetZoom.disable();
  if (document.getElementsByClassName('appInfoItemZoom')[0]) {
    appInfoZoomEl = document.getElementsByClassName('appInfoItemZoom')[0];
    appInfoZoomEl.remove();
  }
}

function saveImg() {
  exportBuffer.resize(canvasResolution, canvasResolution);
  exportBuffer.begin();
  clear();
  if (renderBgOnSave) {
    image(bgBuffer, 0, 0, canvasResolution, canvasResolution);
  }
  image(walkersBuffer, 0, 0, canvasResolution, canvasResolution);
  exportBuffer.end();
  saveCanvas(exportBuffer);
}

function saveGUISettings(notify = false) {
  guiSettings = gui.save();
  guiSettings = JSON.stringify(guiSettings);
  localStorage.setItem('lil-gui-settings', guiSettings);
  localStorage.setItem('amodo-version', VERSION);
  if (localStorage.getItem('lil-gui-settings') && localStorage.getItem('amodo-version')) {
    if (notify) {
      popNotification(ctrlSaveGUISettings, 'Settings saved!');
    }
    ctrlReloadGUISettings.enable();
  }
}

function toggleBgImg() {
  if (bgImg) {
  bgImgVisible = !bgImgVisible;
  }
  redrawBackground();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initialCanvasPosition = {
    x: width / 2,
    xMin: (width / 2) - ((canvasResolution / 2) * zoomFactor),
    xMax: (width / 2) + ((canvasResolution / 2) * zoomFactor),
    y: height / 2,
    yMin: (height / 2) - ((canvasResolution / 2) * zoomFactor),
    yMax: (height / 2) + ((canvasResolution / 2) * zoomFactor)
  };
  centerCanvas();
}

