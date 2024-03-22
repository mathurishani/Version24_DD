// Get canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set default drawing settings
let currentColor = '#000000';
let currentTool = 'pencil';
let isDrawing = false;
let brushSize = 2; // Default brush size

// Function to handle mouse down event
function startDrawing(e) {
  isDrawing = true;
  draw(e);
}

// Function to handle mouse move event
function draw(e) {
  if (!isDrawing) return;

  const x = e.clientX - canvas.getBoundingClientRect().left;
  const y = e.clientY - canvas.getBoundingClientRect().top;

  ctx.strokeStyle = currentColor;
  ctx.lineWidth = brushSize; // Set brush size

  if (currentTool === 'pencil') {
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  } else if (currentTool === 'eraser') {
    ctx.clearRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
  }
}

// Function to handle mouse up event
function stopDrawing() {
  isDrawing = false;
  ctx.beginPath();
}

// Function to change drawing tool
function changeTool(tool) {
  currentTool = tool;
  if (tool === 'pencil') {
    canvas.style.cursor = 'url("pencil.cur"), auto'; // Change cursor to pencil icon
  } else if (tool === 'eraser') {
    canvas.style.cursor = 'url("eraser.cur"), auto'; // Change cursor to eraser icon
  } else {
    canvas.style.cursor = 'default'; // Default cursor
  }
}

// Function to handle brush size change
function changeBrushSize() {
  brushSize = brushSizeInput.value;
}

// Function to clear canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Color picker event listener
const colorPicker = document.getElementById('colorPicker');
colorPicker.addEventListener('input', () => {
  currentColor = colorPicker.value;
});

// Brush size input event listener
const brushSizeInput = document.getElementById('brushSize');
brushSizeInput.addEventListener('input', changeBrushSize);
