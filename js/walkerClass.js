class Walker {
  constructor(clickFactor) {
    this.factorX = clickFactor[0];
    this.factorY = clickFactor[1];
    this.x = this.factorX * canvasResolution;
    this.y = this.factorY * canvasResolution;
    this.initialX = this.x;
    this.initialY = this.y;
    this.tx = random(15000, 30000);
    this.ty = random(60000, 90000);
    this.randomColor = int(random(0, 3));
    this.randomGravResetChance = int(random(300, 1000));
    this.color = color(colors[this.randomColor]);
    this.color.setAlpha(brushAlpha);
    this.originalColorJittered = this.jitterColor(this.color);
    this.finalColor;
    this.brushComputedSize = brushSize * brushSizeMultiplier;
    this.jitteredSize;
    this.jitteredComputedSize = [
      this.brushComputedSize + this.jitterSize(this.brushComputedSize),
      this.brushComputedSize + this.jitterSize(this.brushComputedSize)
    ];
    this.finalSize;
    this.sectionStep = 1;
    this.steps = 0;
    this.spacing = brushSpacing;
    this.brushImg;
    this.textureSize;
    this.brushComputedStep = [];
    if (brushType === 'custom' && brushImgs.length > 0 && useTextureSize) {
      this.brushImg = brushImgs[floor(random(0, brushImgs.length))];
      this.brushComputedStep[0] = this.brushImg.width * this.spacing;
      this.brushComputedStep[1] = this.brushImg.height * this.spacing;
    } else {
      this.brushComputedStep[0] = this.brushComputedSize * this.spacing;
      this.brushComputedStep[1] = this.brushComputedStep[0];
    }
  }

  jitterColor(col) {
    push();
    colorMode(HSL, 255);
    let jitteredColor = color(
      hue(col) + random(-jitterHue, jitterHue),
      saturation(col) + random(-jitterSaturation, jitterSaturation),
      lightness(col) + random(-jitterLightness, jitterLightness),
      alpha(col) + random(-jitterAlpha, jitterAlpha)
    );
    pop();
    return jitteredColor;
  }

  jitterSize(size) {
    return random(-jitterSize, jitterSize) * size;
  }

  render() {
    if (this.x < 0 || this.x > walkersBuffer.width || this.y < 0 || this.y > walkersBuffer.height) return;

    push();
    noFill();
    noStroke();
    colorMode(HSL, 255);
    imageMode(CENTER);
    angleMode(DEGREES);
    translate(-walkersBuffer.width / 2, -walkersBuffer.height / 2);
    translate(this.x, this.y);

    switch(jitterColorMode) {
      case 'per point':
        this.finalColor = this.jitterColor(this.color);
        break;
      case 'per stroke':
        this.finalColor = this.originalColorJittered;
        break;
      case 'both':
        this.finalColor = this.jitterColor(this.originalColorJittered);
        break;
      default:
        break;
    }

    switch(jitterTransformMode) {
      case 'per point':
        if (nonUniformSizeJitter) {
          this.finalSize = [
            this.brushComputedSize + this.jitterSize(this.brushComputedSize),
            this.brushComputedSize + this.jitterSize(this.brushComputedSize)
          ];
        } else {
          this.jitteredSize = this.brushComputedSize + this.jitterSize(this.brushComputedSize); 
          this.finalSize = [this.jitteredSize, this.jitteredSize];
        }
        break;
      case 'per stroke':
        if (nonUniformSizeJitter) {
          this.finalSize = [
            this.jitteredComputedSize[0],
            this.jitteredComputedSize[1]
          ];
        } else {
          this.finalSize = [this.jitteredComputedSize[0], this.jitteredComputedSize[0]];
        }
        break;
      case 'both':
        if (nonUniformSizeJitter) {
          this.finalSize = [
            this.brushComputedSize + this.jitterSize(this.jitteredComputedSize[0]),
            this.brushComputedSize + this.jitterSize(this.jitteredComputedSize[1])
          ];
        } else {
          this.jitteredSize = this.brushComputedSize + this.jitterSize(this.jitteredComputedSize[0]); 
          this.finalSize = [this.jitteredSize, this.jitteredSize];
        }
        break;
      default:
        break;
    }

    if (rotateBrush) {
      rotate(random(360));
    }

    if (brushImgs.length > 0 && brushType === 'custom') {
      if (tintBrush) {
        tint(this.finalColor);
      }
      if (useTextureSize) {
        this.brushImg = brushImgs[floor(random(0, brushImgs.length))];
        image(this.brushImg, 0, 0, this.brushImg.width, this.brushImg.height);
      } else {
        image(brushImgs[floor(random(0, brushImgs.length))], 0, 0, this.finalSize[0], this.finalSize[1]);
      }
    } else {
      switch(brushShape) {
        case 'ellipse (solid)':
          fill(this.finalColor);
          ellipse(0, 0, this.finalSize[0], this.finalSize[1]);
          break;
        case 'ellipse (stroked)':
          strokeWeight(1);
          stroke(this.finalColor);
          ellipse(0, 0, this.finalSize[0], this.finalSize[1]);
          break;
        case 'square (solid)':
          fill(this.finalColor);
          rect(0, 0, this.finalSize[0], this.finalSize[1]);
          break;
        case 'square (stroked)':
          strokeWeight(1);
          stroke(this.finalColor);
          rect(0, 0, this.finalSize[0], this.finalSize[1]);
          break;
        case 'triangle (solid)':
          fill(this.finalColor);
          triangle(-(this.finalSize[0] / 2), this.finalSize[1] / 2, 0, -(this.finalSize[1] / 2), this.finalSize[0] / 2, this.finalSize[1] / 2);
          break;
        case 'triangle (stroked)':
          strokeWeight(1);
          stroke(this.finalColor);
          triangle(-(this.finalSize[0] / 2), this.finalSize[1] / 2, 0, -(this.finalSize[1] / 2), this.finalSize[0] / 2, this.finalSize[1] / 2);
          break;
        default:
          break;
      }
    }

    pop();
  }

  step() {
    if (this.x < 0 || this.x > walkersBuffer.width || this.y < 0 || this.y > walkersBuffer.height) return;

    let stepx, stepy;

    switch(walkersMode) {
      case 'random walk':
        stepx = random(-1, 1) * this.brushComputedStep[0];
        stepy = random(-1, 1) * this.brushComputedStep[1];
        break;
      case 'perlin noise':
        noiseDetail(6, 0.5);
        stepx = map(noise(this.tx), 0, 1, -1, 1) * this.brushComputedStep[0];
        stepy = map(noise(this.ty), 0, 1, -1, 1) * this.brushComputedStep[1];
        this.tx += 0.01 * this.brushComputedStep[0];
        this.ty += 0.01 * this.brushComputedStep[1];
        break;
      case 'gravity':
        if (this.sectionStep === this.randomGravResetChance) {
          this.x = this.initialX;
          this.y = this.initialY;
          this.randomGravResetChance = int(random(300, 1000));
          this.sectionStep = 1;
        }

        if (this.sectionStep / this.randomGravResetChance > walkersGravFalloffPercent) {
          stepx = random(-0.3, 0.3) * this.brushComputedStep[0];
          stepy = random(0.2, 0.4) * this.brushComputedStep[1];
        } else {
          stepx = random(-1, 1) * this.brushComputedStep[0];

          if (random(0, 1) < 0.2) {
            stepy = random(0, 0.5) * this.brushComputedStep[1];
          } else {
            stepy = 0;
          }
        }

        this.sectionStep++;
        break;
      default:
        break;
    }

    this.x += stepx;
    this.y += stepy;

    this.steps++;
  }

  updateValues() {
    this.x = this.factorX * canvasResolution;
    this.y = this.factorY * canvasResolution;
    this.initialX = this.x;
    this.initialY = this.y;
    this.color = color(colors[this.randomColor]);
    this.color.setAlpha(brushAlpha);
    this.brushComputedSize = brushSize * brushSizeMultiplier;
    if (brushType === 'custom' && brushImgs.length > 0 && useTextureSize) {
      this.brushImg = brushImgs[floor(random(0, brushImgs.length))];
      this.brushComputedStep[0] = this.brushImg.width * this.spacing;
      this.brushComputedStep[1] = this.brushImg.height * this.spacing;
    } else {
      this.brushComputedStep[0] = this.brushComputedSize * this.spacing;
      this.brushComputedStep[1] = this.brushComputedStep[0];
    }
    this.sectionStep = 1;
    this.steps = 0;
    this.spacing = brushSpacing;
    if (jitterColorMode === 'per stroke' || jitterColorMode === 'both') {
      this.originalColorJittered = this.jitterColor(this.color);
    }
    if (jitterTransformMode === 'per stroke' || jitterTransformMode === 'both') {
      this.jitteredComputedSize = [
        this.brushComputedSize + this.jitterSize(this.brushComputedSize),
        this.brushComputedSize + this.jitterSize(this.brushComputedSize)
      ];
    }
  }
}

