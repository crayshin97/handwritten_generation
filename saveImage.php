<?php
header('Content-Type: application/json');

$requestData = json_decode(file_get_contents('php://input'), true);

if (isset($requestData['imageData'])) {
    $imageData = $requestData['imageData'];
    
    $imageData = str_replace('data:image/png;base64,', '', $imageData);
    $imageData = str_replace(' ', '+', $imageData);
    
    $imageBuffer = base64_decode($imageData);
    
    $imagePath = __DIR__ . '/savedImages/canvas_image.png';

    // Additional settings
    $backgroundColor = '#000';  // 黑色背景
    $penColor = '#fff';         // 白色筆

    $image = imagecreatefromstring($imageBuffer);
    $width = imagesx($image);
    $height = imagesy($image);

    $canvas = imagecreatetruecolor($width, $height);
    $background = imagecolorallocate($canvas, hexdec(substr($backgroundColor, 1, 2)), hexdec(substr($backgroundColor, 3, 2)), hexdec(substr($backgroundColor, 5, 2)));
    imagefilledrectangle($canvas, 0, 0, $width, $height, $background);

    $pen = imagecolorallocate($canvas, hexdec(substr($penColor, 1, 2)), hexdec(substr($penColor, 3, 2)), hexdec(substr($penColor, 5, 2)));
    imagecopy($canvas, $image, 0, 0, 0, 0, $width, $height);

    imagepng($canvas, $imagePath);

    imagedestroy($canvas);
    imagedestroy($image);

    echo json_encode(['message' => 'Image saved successfully']);

    exit; // Ensure no additional content is sent
} else {
    echo json_encode(['message' => 'Invalid request']);
    exit;
}
?>
