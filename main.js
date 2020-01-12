// eslint-disable-next-line import/extensions,import/named
import { TOOLS_NAMES, KEYS, TOOLS } from './library.js';

const LOCAL_STORAGE = {
  CURRENT_COLOR: 'currentColor',
  PREV_COLOR: 'prevColor',
  CURRENT_TOOL_NAME: 'currentAction',
  CANVAS_URL: 'canvasUrl',
  IS_EXISTS_IMAGE: 'isExistsImage',
};

const frameNumber = document.querySelector('.previewListNumber');

const paintBucketButtonElement = document.getElementById('editor__actionItem--floodFill');
const pencilButtonElement = document.getElementById('editor__actionItem--pencil');
const colorButtonElement = document.getElementById('editor__actionItem--chooseColorButton');
const strokeButtonElement = document.getElementById('editor__actionItem--stroke');
const canvasSizeSelectElement = document.getElementById('sizeSelect');
const eraserButtonElement = document.getElementById('eraser');
const sizePenButtonsElement = document.getElementById('sizePenButtons');
const paintAllPixelsButtonElement = document.getElementById('paintAllPixels');
const previewListUlElement = document.getElementById('previewListUl');
const editorPreviewListLi = document.querySelector('.editor__previewListLi');
const addFrameButtonElement = document.getElementById('addFrameButton');
const clearButtonElement = document.getElementById('clearButton');
const chooseColorInput = document.getElementById('editor__actionItem--chooseColor');
const currentColorButton = document.getElementById('editor__colorItem--current');
const colorPrevButton = document.getElementById('editor__colorItem--prev');
const rangeInputElement = document.getElementById('rangeInput');
const animationFps = document.getElementById('animationFps');


let pointerSize = 1;
const CANVAS_SIZE = 512;

const canvas = document.querySelector('.editor__canvas');
const ctx = canvas.getContext('2d');

const canvasFrame = document.querySelector('.editor__canvasFrame');
let ctx2 = canvasFrame.getContext('2d');

const canvasAnimation = document.getElementById('canvasAnimation');
const ctxAnimation = canvasAnimation.getContext('2d');

const dataStraightLine = {
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
};


// eslint-disable-next-line no-shadow
function createFrameData(imgData, element, index, ctx) {
  const frameData = {
    imgData,
    element,
    index,
    ctx,
  };

  return frameData;
}

let counterImageDataForAnimation = 0;
let rangeValue = rangeInputElement.value;
animationFps.textContent = `${rangeValue}fps`;

const framesData = [];
let activeIdxFrameData = 0;

let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

const startIndex = 0;
const startFrameData = createFrameData(imgData, editorPreviewListLi, startIndex, ctx2);

framesData.push(startFrameData);
activeIdxFrameData = framesData.length - 1;

// editorPreviewListLi.classList.toggle('activeJs');

frameNumber.textContent = framesData[activeIdxFrameData].index + 1;

let currentColor = null;
let prevColor = null;


let canvasResolutionSize = canvasSizeSelectElement.value;
canvas.width = canvasResolutionSize;
canvas.height = canvasResolutionSize;

let canvasScale = CANVAS_SIZE / canvasResolutionSize;

let currentToolName = localStorage.getItem(LOCAL_STORAGE.CURRENT_TOOL_NAME);

function changeShowActiveElement(element) {
  element.classList.toggle('activeJs');
}

changeShowActiveElement(framesData[activeIdxFrameData].element);

function initializeCurrentToolName() {
  if (!currentToolName) {
    currentToolName = TOOLS_NAMES.PENCIL;
    localStorage.setItem(LOCAL_STORAGE.CURRENT_TOOL_NAME, currentToolName);
  }

  const currentToolData = TOOLS[currentToolName];
  const { element: currentToolElement } = currentToolData;

  currentToolElement.classList.toggle('editor__actionItem--active');
  currentToolElement.click();
}

function initializeCurrentColor() {
  currentColor = localStorage.getItem(LOCAL_STORAGE.CURRENT_COLOR);

  if (currentColor === null) {
    const color = '#008000';
    localStorage.setItem(LOCAL_STORAGE.CURRENT_COLOR, color);
    currentColor = color;
  }

  currentColorButton.style.background = `linear-gradient(to right, ${currentColor} 20%, white 20%)`;
}

function initializePrevColor() {
  prevColor = localStorage.getItem(LOCAL_STORAGE.PREV_COLOR);

  if (prevColor === null) {
    const color = '#8b008b';
    localStorage.setItem(LOCAL_STORAGE.PREV_COLOR, color);
    prevColor = color;
  }

  colorPrevButton.style.background = `linear-gradient(to right, ${prevColor} 20%, white 20%)`;
}

initializeCurrentToolName();
initializeCurrentColor();
initializePrevColor();

// eslint-disable-next-line no-shadow
function paintOverClosedArea(pointX, pointY, prevColor, nextColor) {
  const pixel = ctx.getImageData(pointX, pointY, 1, 1).data;

  const red = pixel[0];
  const green = pixel[1];
  const blue = pixel[2];
  // eslint-disable-next-line no-param-reassign
  nextColor = `#rgb(${red}, ${green}, ${blue})`;

  if (nextColor === prevColor) {
    // eslint-disable-next-line max-len
    if (pointX > 0 && pointX < canvasResolutionSize && pointY > 0 && pointY < canvasResolutionSize) {
      ctx.fillStyle = currentColor;
      ctx.fillRect(pointX, pointY, 1, 1);

      paintOverClosedArea(pointX, pointY - 1, prevColor, nextColor);
      paintOverClosedArea(pointX, pointY + 1, prevColor, nextColor);
      paintOverClosedArea(pointX + 1, pointY, prevColor, nextColor);
      paintOverClosedArea(pointX - 1, pointY, prevColor, nextColor);
    }
  }
}


function handleClickColorButton() {
  chooseColorInput.classList.add('editor__actionItem--chooseColor--input--active');
  chooseColorInput.click();
}

function changeTool(newToolName) {
  const currentToolData = TOOLS[currentToolName];
  const { element: currentToolElement } = currentToolData;

  const newToolData = TOOLS[newToolName];
  const { element: newtToolElement } = newToolData;

  currentToolElement.blur();
  currentToolElement.classList.toggle('editor__actionItem--active');
  currentToolName = newToolName;
  newtToolElement.classList.toggle('editor__actionItem--active');

  localStorage.setItem(LOCAL_STORAGE.CURRENT_TOOL_NAME, currentToolName);
}

function handleClickPencilButton() {
  changeTool(TOOLS_NAMES.PENCIL);
}

function handleClickPaintBucketButton() {
  changeTool(TOOLS_NAMES.PAINT_BUCKET);
}

// color functionality

function changeColor(nextColor) {
  prevColor = currentColor;
  currentColor = nextColor;

  localStorage.setItem(LOCAL_STORAGE.CURRENT_COLOR, currentColor);
  localStorage.setItem(LOCAL_STORAGE.PREV_COLOR, prevColor);

  colorPrevButton.style.background = `linear-gradient(to right, ${prevColor} 20%, white 20%)`;
  currentColorButton.style.background = `linear-gradient(to right, ${currentColor} 20%, white 20%)`;
}

function handleSelectColor() {
  changeTool(TOOLS_NAMES.COLOR);
  changeColor(chooseColorInput.value);
  chooseColorInput.classList.remove('editor__actionItem--chooseColor--input--active');
}


function handleApplyPrevColor() {
  changeColor(prevColor);
}


// Keyboard shortcuts functionality

function handleKeydownKeyboardShortcuts(event) {
  const pressedKey = event.keyCode;

  if (!pressedKey) {
    return;
  }

  switch (pressedKey.toString()) {
    case KEYS.KEY_B:
      handleClickPaintBucketButton();
      break;
    case KEYS.KEY_P:
      handleClickPencilButton();
      break;
    case KEYS.KEY_C:
      chooseColorInput.click();
      break;
    default: {
      break;
    }
  }
}


function handleSizeChange() {
  framesData[activeIdxFrameData] = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const newCanvasSize = canvasSizeSelectElement.value;
  canvasResolutionSize = newCanvasSize;

  canvas.width = newCanvasSize;
  canvas.height = newCanvasSize;

  canvasScale = CANVAS_SIZE / newCanvasSize;

  ctx.putImageData(framesData[activeIdxFrameData].imgData, 0, 0);
}


function handleClickStrokeButton() {
  changeTool(TOOLS_NAMES.STROKE);
}

function handleClickEraserButton() {
  changeTool(TOOLS_NAMES.ERASER);
}

function handleClickPaintAllPixelsButton() {
  changeTool(TOOLS_NAMES.PAINT_ALL_PIXELS);
}


function handleClickSizePenButton(event) {
  const { tagName } = event.target;
  const { target } = event;

  if (tagName === 'BUTTON') {
    pointerSize = target.dataset.size;
  }
}


function renderNumberFrame() {
  const listOfItems = previewListUlElement.children;

  for (let i = 0; i < listOfItems.length; i += 1) {
    const currentElement = listOfItems[i].querySelector('.previewListNumber');
    currentElement.textContent = i + 1;
  }
}

function drawingFrame(data) {
  framesData[activeIdxFrameData].ctx.putImageData(data, 0, 0);
}

function refactorFramesData() {
  framesData.forEach((item, idx) => {
    item.index = idx;
  });
}

function refactorElementDataset() {
  const elements = previewListUlElement.children;

  for (let i = 0; i < elements.length; i += 1) {
    elements[i].dataset.counter = String(i);
  }
}


function changeActiveElement(idx) {
  activeIdxFrameData = idx;

  ctx.putImageData(framesData[activeIdxFrameData].imgData, 0, 0);
}


function copyFrameElement(element) {
  changeShowActiveElement(framesData[activeIdxFrameData].element);

  const copyElement = element.cloneNode(true);

  const copiedDataset = Number(copyElement.dataset.counter);
  const newDataset = copiedDataset + 1;
  copyElement.dataset.counter = newDataset;

  const newCanvasFrame = copyElement.querySelector('canvas');
  ctx2 = newCanvasFrame.getContext('2d');

  const copyFrameImgData = framesData[copiedDataset].imgData;

  const newFrameData = createFrameData(copyFrameImgData, copyElement, newDataset, ctx2);
  framesData.splice(newDataset, 0, newFrameData);
  refactorFramesData();

  previewListUlElement.insertBefore(copyElement, element.nextSibling); // insert element after the pressed element
  refactorElementDataset();

  changeActiveElement(newDataset);

  drawingFrame(copyFrameImgData);

  renderNumberFrame();

  changeShowActiveElement(framesData[activeIdxFrameData].element);
}


function deleteFrameElement(element) {
  const numberElement = element.dataset.counter;

  element.remove();
  framesData.splice(numberElement, 1);

  refactorElementDataset();
  refactorFramesData();

  const lastElement = previewListUlElement.children[previewListUlElement.children.length - 1];

  changeActiveElement(lastElement.dataset.counter);

  renderNumberFrame();
}


function handleClickPreviewListElement(event) {
  const liElement = event.target.closest('li');
  const idxElement = Number(liElement.dataset.counter);
  const buttonElement = event.target.closest('button');
  const targetTag = event.target.tagName;

  if (targetTag === 'CANVAS') {
    changeShowActiveElement(framesData[activeIdxFrameData].element);
    changeActiveElement(idxElement);
    changeShowActiveElement(framesData[activeIdxFrameData].element);
  }

  if (buttonElement !== null && buttonElement.dataset.property === 'copy') {
    copyFrameElement(liElement, ctx2);
  }

  if (buttonElement !== null && buttonElement.dataset.property === 'delete') {
    deleteFrameElement(liElement);
  }
}


function handleClickAddFrameButton() {
  changeShowActiveElement(framesData[activeIdxFrameData].element);

  const newElement = editorPreviewListLi.cloneNode(true);
  newElement.dataset.counter = activeIdxFrameData + 1;
  const idxElement = Number(newElement.dataset.counter);
  previewListUlElement.appendChild(newElement);

  const buttonDelete = newElement.querySelector('.editor__previewListButton--delete');
  buttonDelete.classList.remove('buttonDisabled');

  let lastIdxFrameData = framesData.length - 1;
  const lastFrameImgData = framesData[lastIdxFrameData].imgData;
  const newCanvasFrame = newElement.querySelector('canvas');
  ctx2 = newCanvasFrame.getContext('2d');

  const newFrameData = createFrameData(lastFrameImgData, newElement, idxElement, ctx2);
  framesData.push(newFrameData);
  lastIdxFrameData = framesData.length - 1;

  changeActiveElement(lastIdxFrameData);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  framesData[activeIdxFrameData].imgData = imgData;

  renderNumberFrame();
  changeShowActiveElement(framesData[activeIdxFrameData].element);
}


function handleClickClearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  framesData[activeIdxFrameData].imgData = imgData;

  drawingFrame(framesData[activeIdxFrameData].imgData);
}


function mouseMovePencil(event) {
  const startAndCurrentX = Math.round(event.offsetX / canvasScale);
  const startAndCurrentY = Math.round(event.offsetY / canvasScale);

  const pencilCenterShift = pointerSize / 2;

  ctx.lineWidth = pointerSize;
  ctx.strokeStyle = currentColor;
  ctx.stroke();
  ctx.fillStyle = currentColor;
  ctx.fillRect(startAndCurrentX - pencilCenterShift, startAndCurrentY - pencilCenterShift,
    pointerSize, pointerSize);
  ctx.lineTo(startAndCurrentX, startAndCurrentY);
}


function mouseMoveStraightLine(event) {
  dataStraightLine.currentX = event.offsetX / canvasScale;
  dataStraightLine.currentY = event.offsetY / canvasScale;

  ctx.putImageData(framesData[activeIdxFrameData].imgData, 0, 0);

  const pencilCenterShift = pointerSize / 2;

  ctx.beginPath();
  ctx.lineWidth = pointerSize;
  ctx.strokeStyle = currentColor;
  // eslint-disable-next-line max-len
  ctx.fillRect(dataStraightLine.currentX - pencilCenterShift, dataStraightLine.currentY - pencilCenterShift,
    pointerSize, pointerSize);
  ctx.moveTo(dataStraightLine.currentX, dataStraightLine.currentY);
  ctx.lineTo(dataStraightLine.startX, dataStraightLine.startY);
  ctx.stroke();
}


function erasingDrawnMouseMove(event) {
  const currentX = event.offsetX / canvasScale;
  const currentY = event.offsetY / canvasScale;

  ctx.clearRect(currentX, currentY, pointerSize, pointerSize);
}


function handleMouseMoveCanvas(event) {
  switch (currentToolName) {
    case 'PENCIL':
      mouseMovePencil(event);
      break;
    case 'STROKE':
      mouseMoveStraightLine(event);
      break;
    case 'ERASER':
      erasingDrawnMouseMove(event);
      break;
    default:
      break;
  }
}

function pencilDrawing(event) {
  const startAndCurrentX = Math.round(event.offsetX / canvasScale);
  const startAndCurrentY = Math.round(event.offsetY / canvasScale);

  const pencilCenterShift = pointerSize / 2;

  ctx.beginPath();
  ctx.fillStyle = currentColor;
  ctx.fillRect(startAndCurrentX - pencilCenterShift, startAndCurrentY - pencilCenterShift,
    pointerSize, pointerSize);
  ctx.moveTo(startAndCurrentX, startAndCurrentY);
}


function drawingPaintBucket(event) {
  const startX = Math.round(event.offsetX / canvasScale);
  const startY = Math.round(event.offsetY / canvasScale);

  const pixel = ctx.getImageData(startX, startY, 1, 1).data;
  const red = pixel[0];
  const green = pixel[1];
  const blue = pixel[2];

  const colorPixel = `#rgb(${red}, ${green}, ${blue})`;

  const nextColor = null;
  // eslint-disable-next-line no-use-before-define
  paintOverClosedArea(startX, startY, colorPixel, nextColor);

  imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  framesData[activeIdxFrameData].imgData = imgData;

  drawingFrame(framesData[activeIdxFrameData].imgData);
}

function setStartingPointForStraightLine(event) {
  dataStraightLine.startX = event.offsetX / canvasScale;
  dataStraightLine.startY = event.offsetY / canvasScale;
}

function erasingDrawn(event) {
  const currentX = event.offsetX / canvasScale;
  const currentY = event.offsetY / canvasScale;

  ctx.clearRect(currentX, currentY, pointerSize, pointerSize);

  canvas.style.cursor = 'url("assets/eraser-cursor.png"), default;';
}


function drawingPaintAllPixels() {
  ctx.fillStyle = currentColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  framesData[activeIdxFrameData].imgData = imgData;

  drawingFrame(framesData[activeIdxFrameData].imgData);
}

function handleMousedownCanvas(event) {
  switch (currentToolName) {
    case 'PENCIL':
      pencilDrawing(event);
      break;
    case 'PAINT_BUCKET':
      drawingPaintBucket(event);
      break;
    case 'STROKE':
      setStartingPointForStraightLine(event);
      break;
    case 'ERASER':
      erasingDrawn(event);
      break;
    case 'PAINT_ALL_PIXELS':
      drawingPaintAllPixels();
      break;
    default:
      break;
  }
  canvas.addEventListener('mousemove', handleMouseMoveCanvas);
}

function pencilDrawingMouseUp() {
  canvas.removeEventListener('mousemove', handleMouseMoveCanvas);

  ctx.stroke();
  imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  framesData[activeIdxFrameData].imgData = imgData;

  drawingFrame(framesData[activeIdxFrameData].imgData);
}

function mouseUpStraightLine() {
  canvas.removeEventListener('mousemove', handleMouseMoveCanvas);

  const pencilCenterShift = pointerSize / 2;
  ctx.beginPath();
  ctx.fillStyle = currentColor;
  // eslint-disable-next-line max-len
  ctx.fillRect(dataStraightLine.startX - pencilCenterShift, dataStraightLine.startY - pencilCenterShift,
    pointerSize, pointerSize);

  imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  framesData[activeIdxFrameData].imgData = imgData;

  drawingFrame(framesData[activeIdxFrameData].imgData);
}

function erasingDrawnMouseUp() {
  canvas.removeEventListener('mousemove', handleMouseMoveCanvas);

  imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  framesData[activeIdxFrameData].imgData = imgData;

  drawingFrame(framesData[activeIdxFrameData].imgData);
}

function handleMouseupCanvas() {
  canvas.removeEventListener('mousemove', handleMouseMoveCanvas);

  switch (currentToolName) {
    case 'PENCIL':
      pencilDrawingMouseUp();
      break;
    case 'STROKE':
      mouseUpStraightLine();
      break;
    case 'ERASER':
      erasingDrawnMouseUp();
      break;
    default:
      break;
  }
}


// --------  animation --------

function showAnimation() {
  if (counterImageDataForAnimation === framesData.length || framesData[counterImageDataForAnimation] === undefined) {
    counterImageDataForAnimation = 0;
  }

  ctxAnimation.putImageData(framesData[counterImageDataForAnimation].imgData, 0, 0);
  counterImageDataForAnimation += 1;

  setTimeout(() => (requestAnimationFrame(showAnimation)), 1000 / rangeValue);
}

showAnimation();


function handleChangeAndRenderFps() {
  rangeValue = rangeInputElement.value;
  animationFps.textContent = `${rangeValue}fps`;
}


previewListUlElement.addEventListener('click', handleClickPreviewListElement);
addFrameButtonElement.addEventListener('click', handleClickAddFrameButton);
canvas.addEventListener('mousedown', handleMousedownCanvas);
canvas.addEventListener('mouseup', handleMouseupCanvas);
pencilButtonElement.addEventListener('click', handleClickPencilButton);
chooseColorInput.addEventListener('change', handleSelectColor);
sizePenButtonsElement.addEventListener('click', handleClickSizePenButton);
colorPrevButton.addEventListener('click', handleApplyPrevColor);
paintBucketButtonElement.addEventListener('click', handleClickPaintBucketButton);
document.addEventListener('keydown', handleKeydownKeyboardShortcuts);
canvasSizeSelectElement.addEventListener('change', handleSizeChange);
colorButtonElement.addEventListener('click', handleClickColorButton);
clearButtonElement.addEventListener('click', handleClickClearCanvas);
strokeButtonElement.addEventListener('click', handleClickStrokeButton);
eraserButtonElement.addEventListener('click', handleClickEraserButton);
paintAllPixelsButtonElement.addEventListener('click', handleClickPaintAllPixelsButton);
rangeInputElement.addEventListener('change', handleChangeAndRenderFps);
