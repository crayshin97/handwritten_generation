document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    let painting = false;

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

    canvas.addEventListener('touchstart', startPosition);
    canvas.addEventListener('touchend', endPosition);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchstart', startPosition);
    canvas.addEventListener('touchend', endPosition);
    canvas.addEventListener('touchmove', draw);

    // 清除和保存按鈕的事件監聽
    const clearButton = document.getElementById('clear_canvas');
    const saveButton = document.getElementById('save_canvas');

    clearButton.addEventListener('click', clearCanvas);
    saveButton.addEventListener('click', saveCanvas);
    setBlackBackground();
});
