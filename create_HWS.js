const canvas = document.getElementById('canvas');
const symbolSelect = document.getElementById('symbol_select');
const otherInput = document.getElementById('other_input');
const context = canvas.getContext('2d');
const drawings = [];
let painting = false;
let penSize = 2;

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

    context.lineWidth = penSize;
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
    // 獲取當前時間戳
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份加1是因為月份是從0開始的
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
    
    var symbolSelectValue = symbolSelect.value;
    if(symbolSelectValue === "其他"){
        if(otherInput.value === ""){
            alert("其他不能空白");
            return;
        }
        symbolSelectValue = otherInput.value; 
    }
    
    const filename = `${symbolSelectValue}_${timestamp}`;
    drawings.push({imageData, filename});
    console.log(drawings);
    clearCanvas();
}
function downloadAll() {
    const zip = new JSZip();

    drawings.forEach((drawing, index) => {
        const base64Data = drawing.imageData.split(',')[1];
        zip.file(`${drawing.filename}.png`, base64Data, { base64: true });
    });

    zip.generateAsync({ type: 'blob' })
        .then((blob) => {
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = 'drawings.zip';
            downloadLink.click();

            drawings.length = 0;
        })
        .catch(error => {
            console.log("Error generating ZIP:", error);
        });
}

function updatePenSize(event) {
    const penSizeValue = document.querySelector('#canvas_penSize_value');

    penSize = parseInt(event.target.value, 10);
    penSizeValue.textContent = event.target.value;
}

function showOtherInput() {
    const otherDiv = document.getElementById('other_div');
    if(symbolSelect.value === "其他")
        otherDiv.style.display = "block";
    else{
        otherDiv.style.display = "none";
        otherInput.value = "";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    painting = false;
    setBlackBackground();
    updateCanvasSize();

    // 建立手寫板寫入方式
    canvas.addEventListener('touchstart', startPosition);  // 觸控操作
    canvas.addEventListener('touchend', endPosition);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('mousedown', startPosition);  // 滑鼠操作
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);

    const resetSizeButton = document.getElementById('reset_size');   // 重設大小
    const clearButton = document.getElementById('clear_canvas');     // 清除
    const saveButton = document.getElementById('save_canvas');       // 儲存
    const downloadButton = document.getElementById('download_image') // 下載
    const canvasPenSize = document.querySelector('#canvas_penSize'); // 畫筆大小


    resetSizeButton.addEventListener('click', updateCanvasSize);
    clearButton.addEventListener('click', clearCanvas);
    saveButton.addEventListener('click', saveCanvas);
    downloadButton.addEventListener('click', downloadAll);
    canvasPenSize.addEventListener('input', (event) => {updatePenSize(event)});

    fetch('symbol_option.txt')  // 取得選項值
        .then(response => response.text())
        .then(data => {
            console.log(data);
            const options = data.split('\n');
            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.text = option.trim();
                symbolSelect.add(optionElement);
            });
            const optionElement = document.createElement('option');
            optionElement.text = "其他";  // 加入固定的選項
            symbolSelect.add(optionElement);
        })
        .catch(error => {
            console.log("Error loading symbol_option.txt: ", error);
        });
    symbolSelect.addEventListener("change", showOtherInput);
});   
