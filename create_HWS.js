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

        context.lineWidth = 5;
        context.lineCap = 'round';
        context.strokeStyle = '#fff';

        context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        context.stroke();
        context.beginPath();
        context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
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

        // console.log(imageData);
        console.log(imageData.length);
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

    // Event listeners
    canvas.addEventListener('mousedown', startPosition);
    canvas.addEventListener('mouseup', endPosition);
    canvas.addEventListener('mousemove', draw);

    // 清除和保存按鈕的事件監聽
    const clearButton = document.getElementById('clear_canvas');
    const saveButton = document.getElementById('save_canvas');

    clearButton.addEventListener('click', clearCanvas);
    saveButton.addEventListener('click', saveCanvas);
    setBlackBackground();
});
