const canvas = document.getElementById('canvas');
var context;
let painting = false;

function updateCanvasSize() {
    const currentImageData = context.getImageData(0, 0, canvas.width, canvas.height);  // 保留原本內容
    const height = document.getElementById('canvas_height').value;
    const width = document.getElementById('canvas_width').value;

    canvas.height = parseInt(height);
    canvas.width = parseInt(width);

    setBlackBackground();
    context.putImageData(currentImageData, 0, 0);
}

function startPosition(e) {
    painting = true;
    draw(e);
}
function endPosition() {
    painting = false;
    context.beginPath();
}
function draw(e) {
    if (!painting) return;

    // 防止手機上的滾動等干擾
    e.preventDefault();

    context.lineWidth = 5;
    context.lineCap = 'round';
    context.strokeStyle = '#fff';

    // 在觸摸事件中使用 e.touches[0].clientX 和 e.touches[0].clientY
    // 在滑鼠事件中使用 e.clientX 和 e.clientY
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;

    context.lineTo(x - canvas.offsetLeft, y - canvas.offsetTop);
    context.stroke();
    context.beginPath();
    context.moveTo(x - canvas.offsetLeft, y - canvas.offsetTop);
}

function setBlackBackground() {
    context.fillStyle = '#000';  // 黑色背景
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    setBlackBackground();
}

function saveCanvas() {
    const imageData = canvas.toDataURL('image/png');

    fetch('./saveImage.php', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData}),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Image saved: ", data.message);
    })
    .catch(error => {
        console.error('Error saving image:', error);
    });
}
document.addEventListener('DOMContentLoaded', function () {
    context = canvas.getContext('2d');
    painting = false;
    setBlackBackground();
    updateCanvasSize();

    canvas.addEventListener('touchstart', startPosition);
    canvas.addEventListener('touchend', endPosition);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
    // 按鈕的事件監聽
    const resetSizeButton = document.getElementById('reset_size');
    const clearButton = document.getElementById('clear_canvas');
    const saveButton = document.getElementById('save_canvas');

    resetSizeButton.addEventListener('click', updateCanvasSize);
    clearButton.addEventListener('click', clearCanvas);
    saveButton.addEventListener('click', saveCanvas);
});   
