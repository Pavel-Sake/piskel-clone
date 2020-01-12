

// eslint-disable-next-line no-use-before-define
export { TOOLS_NAMES, KEYS, TOOLS };

const paintAllPixelsButtonElement = document.getElementById('paintAllPixels');
const transformButtonElement = document.getElementById('editor__actionItem--transform');
const paintBucketButtonElement = document.getElementById('editor__actionItem--floodFill');
const pencilButtonElement = document.getElementById('editor__actionItem--pencil');
const colorButtonElement = document.getElementById('editor__actionItem--chooseColorButton');
const strokeButtonElement = document.getElementById('editor__actionItem--stroke');
const eraserButtonElement = document.getElementById('eraser');

const KEYS = {
  KEY_B: '66',
  KEY_P: '80',
  KEY_C: '67',
};
const TOOLS_NAMES = {
  PAINT_BUCKET: 'PAINT_BUCKET',
  PENCIL: 'PENCIL',
  COLOR: 'COLOR',
  STROKE: 'STROKE',
  ERASER: 'ERASER',
  PAINT_ALL_PIXELS: 'PAINT_ALL_PIXELS',
  TRANSFORM: 'TRANSFORM',
};


const TOOLS = {
  PAINT_BUCKET: {
    name: 'paint bucket',
    element: paintBucketButtonElement,
  },
  PENCIL: {
    name: 'pencil',
    element: pencilButtonElement,
  },
  COLOR: {
    name: 'color',
    element: colorButtonElement,
  },
  STROKE: {
    name: 'stroke',
    element: strokeButtonElement,
  },
  ERASER: {
    name: 'eraser',
    element: eraserButtonElement,
  },
  PAINT_ALL_PIXELS: {
    name: 'paintAllPixels',
    element: paintAllPixelsButtonElement,
  },
  TRANSFORM: {
    name: 'transform',
    element: transformButtonElement,
  },
};
