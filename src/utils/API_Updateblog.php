<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        uploadImage();
        break;

    case 'DELETE':
        deleteImage();
        break;

    default:
        echo json_encode(["error" => "Método no permitido"]);
        break;
}

function uploadImage() {
    try {
        // Validar si llegó el archivo
        if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('No se pudo subir la imagen');
        }

        $file = $_FILES['image'];
        $bucket = $_POST['bucket'] ?? 'blog-images';

        // Tipos permitidos
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($file['type'], $allowedTypes)) {
            throw new Exception('Tipo de archivo no válido. Solo JPG, PNG, GIF o WEBP.');
        }

        // Tamaño máximo 5MB
        $maxSize = 5 * 1024 * 1024;
        if ($file['size'] > $maxSize) {
            throw new Exception('La imagen es demasiado grande. Máximo 5MB.');
        }

        // Carpeta de destino
        $uploadDir = __DIR__ . "/uploads/{$bucket}/";
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                throw new Exception("No se pudo crear el directorio de destino");
            }
        }

        // Nombre único
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $fileName = uniqid("img_") . '_' . time() . '.' . $extension;
        $filePath = $uploadDir . $fileName;

        // Guardar archivo
        if (!move_uploaded_file($file['tmp_name'], $filePath)) {
            throw new Exception('Error al guardar la imagen en el servidor');
        }

        // URL pública
        $publicUrl = "https://domumarquitectura.com/assets/uploads/{$bucket}/{$fileName}";

        echo json_encode([
            "success" => true,
            "url" => $publicUrl,
            "fileName" => $fileName
        ]);

    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function deleteImage() {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $imageUrl = $input['url'] ?? '';

        if (empty($imageUrl)) {
            throw new Exception('URL de imagen requerida');
        }

        // No borrar imágenes externas
        if (strpos($imageUrl, 'pexels.com') !== false) {
            echo json_encode(["success" => true, "message" => "Imagen externa, no se elimina"]);
            return;
        }

        // Convertir URL a ruta interna
        $imagePath = str_replace(
            "https://domumarquitectura.com/assets/",
            __DIR__ . "/",
            $imageUrl
        );

        // Seguridad extra: evitar salir del directorio "assets/uploads"
        $realBase = realpath(__DIR__ . "/uploads");
        $realPath = realpath($imagePath);

        if ($realPath === false || strpos($realPath, $realBase) !== 0) {
            throw new Exception('Ruta de imagen no válida');
        }

        if (file_exists($realPath)) {
            if (unlink($realPath)) {
                echo json_encode(["success" => true, "message" => "Imagen eliminada correctamente"]);
            } else {
                throw new Exception('No se pudo eliminar la imagen');
            }
        } else {
            echo json_encode(["success" => true, "message" => "Imagen no encontrada"]);
        }

    } catch (Exception $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>
