<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
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
        http_response_code(405);
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
        $bucket = $_POST['bucket'] ?? 'project-images';
        $isGallery = isset($_POST['isGallery']) && $_POST['isGallery'] === 'true';

        // Tipos permitidos
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($file['type'], $allowedTypes)) {
            throw new Exception('Tipo de archivo no válido. Solo JPG, PNG, GIF o WEBP.');
        }

        // Tamaño máximo 10MB para proyectos (pueden ser imágenes más grandes)
        $maxSize = 10 * 1024 * 1024;
        if ($file['size'] > $maxSize) {
            throw new Exception('La imagen es demasiado grande. Máximo 10MB.');
        }

        // Determinar carpeta de destino según el tipo
        if ($isGallery) {
            $uploadDir = __DIR__ . "/uploads/project-gallery/";
        } else {
            $uploadDir = __DIR__ . "/uploads/{$bucket}/";
        }

        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0755, true)) {
                throw new Exception("No se pudo crear el directorio de destino");
            }
        }

        // Nombre único con prefijo según el tipo
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $prefix = $isGallery ? "gallery_" : "project_";
        $fileName = uniqid($prefix) . '_' . time() . '.' . $extension;
        $filePath = $uploadDir . $fileName;

        // Guardar archivo
        if (!move_uploaded_file($file['tmp_name'], $filePath)) {
            throw new Exception('Error al guardar la imagen en el servidor');
        }

        // Optimizar imagen si es necesario
        optimizeImage($filePath);
        resizeImageIfNeeded($filePath);

        // URL pública según el tipo
        if ($isGallery) {
            $publicUrl = "https://domumarquitectura.com/assets/uploads/project-gallery/{$fileName}";
        } else {
            $publicUrl = "https://domumarquitectura.com/assets/uploads/{$bucket}/{$fileName}";
        }

        http_response_code(201);
        echo json_encode([
            "success" => true,
            "url" => $publicUrl,
            "fileName" => $fileName,
            "isGallery" => $isGallery
        ]);

    } catch (Exception $e) {
        http_response_code(400);
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
        if (strpos($imageUrl, 'pexels.com') !== false || 
            strpos($imageUrl, 'unsplash.com') !== false ||
            strpos($imageUrl, 'supabase.co') !== false) {
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
        http_response_code(400);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

// Función auxiliar para eliminar múltiples imágenes de galería
function deleteGalleryImages() {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $imageUrls = $input['urls'] ?? [];

        if (empty($imageUrls) || !is_array($imageUrls)) {
            throw new Exception('Array de URLs de imágenes requerido');
        }

        $results = [];
        $errors = [];

        foreach ($imageUrls as $imageUrl) {
            try {
                // No borrar imágenes externas
                if (strpos($imageUrl, 'pexels.com') !== false || 
                    strpos($imageUrl, 'unsplash.com') !== false ||
                    strpos($imageUrl, 'supabase.co') !== false) {
                    $results[] = ["url" => $imageUrl, "status" => "skipped", "message" => "Imagen externa"];
                    continue;
                }

                // Convertir URL a ruta interna
                $imagePath = str_replace(
                    "https://domumarquitectura.com/assets/",
                    __DIR__ . "/",
                    $imageUrl
                );

                // Seguridad extra
                $realBase = realpath(__DIR__ . "/uploads");
                $realPath = realpath($imagePath);

                if ($realPath === false || strpos($realPath, $realBase) !== 0) {
                    $errors[] = ["url" => $imageUrl, "error" => "Ruta no válida"];
                    continue;
                }

                if (file_exists($realPath)) {
                    if (unlink($realPath)) {
                        $results[] = ["url" => $imageUrl, "status" => "deleted"];
                    } else {
                        $errors[] = ["url" => $imageUrl, "error" => "No se pudo eliminar"];
                    }
                } else {
                    $results[] = ["url" => $imageUrl, "status" => "not_found"];
                }

            } catch (Exception $e) {
                $errors[] = ["url" => $imageUrl, "error" => $e->getMessage()];
            }
        }

        echo json_encode([
            "success" => true,
            "results" => $results,
            "errors" => $errors,
            "total_processed" => count($imageUrls),
            "successful_deletions" => count(array_filter($results, function($r) { return $r['status'] === 'deleted'; }))
        ]);

    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

// Función para optimizar imágenes (opcional)
function optimizeImage($filePath, $quality = 85) {
    $imageInfo = getimagesize($filePath);
    if (!$imageInfo) return false;

    $mimeType = $imageInfo['mime'];
    
    switch ($mimeType) {
        case 'image/jpeg':
            $image = imagecreatefromjpeg($filePath);
            if ($image) {
                imagejpeg($image, $filePath, $quality);
                imagedestroy($image);
                return true;
            }
            break;
            
        case 'image/png':
            $image = imagecreatefrompng($filePath);
            if ($image) {
                // Para PNG, convertir calidad de 0-100 a 0-9
                $pngQuality = floor(($quality / 100) * 9);
                imagepng($image, $filePath, $pngQuality);
                imagedestroy($image);
                return true;
            }
            break;
            
        case 'image/webp':
            if (function_exists('imagecreatefromwebp')) {
                $image = imagecreatefromwebp($filePath);
                if ($image) {
                    imagewebp($image, $filePath, $quality);
                    imagedestroy($image);
                    return true;
                }
            }
            break;
    }
    
    return false;
}

// Función para redimensionar imágenes si son muy grandes
function resizeImageIfNeeded($filePath, $maxWidth = 1920, $maxHeight = 1080) {
    $imageInfo = getimagesize($filePath);
    if (!$imageInfo) return false;

    $currentWidth = $imageInfo[0];
    $currentHeight = $imageInfo[1];
    
    // Si la imagen ya es del tamaño correcto o menor, no hacer nada
    if ($currentWidth <= $maxWidth && $currentHeight <= $maxHeight) {
        return true;
    }

    $mimeType = $imageInfo['mime'];
    
    // Calcular nuevas dimensiones manteniendo la proporción
    $ratio = min($maxWidth / $currentWidth, $maxHeight / $currentHeight);
    $newWidth = intval($currentWidth * $ratio);
    $newHeight = intval($currentHeight * $ratio);

    // Crear imagen desde el archivo original
    switch ($mimeType) {
        case 'image/jpeg':
            $sourceImage = imagecreatefromjpeg($filePath);
            break;
        case 'image/png':
            $sourceImage = imagecreatefrompng($filePath);
            break;
        case 'image/webp':
            if (function_exists('imagecreatefromwebp')) {
                $sourceImage = imagecreatefromwebp($filePath);
            } else {
                return false;
            }
            break;
        default:
            return false;
    }

    if (!$sourceImage) return false;

    // Crear nueva imagen redimensionada
    $resizedImage = imagecreatetruecolor($newWidth, $newHeight);
    
    // Preservar transparencia para PNG
    if ($mimeType === 'image/png') {
        imagealphablending($resizedImage, false);
        imagesavealpha($resizedImage, true);
        $transparent = imagecolorallocatealpha($resizedImage, 255, 255, 255, 127);
        imagefilledrectangle($resizedImage, 0, 0, $newWidth, $newHeight, $transparent);
    }

    // Redimensionar
    imagecopyresampled($resizedImage, $sourceImage, 0, 0, 0, 0, $newWidth, $newHeight, $currentWidth, $currentHeight);

    // Guardar imagen redimensionada
    $result = false;
    switch ($mimeType) {
        case 'image/jpeg':
            $result = imagejpeg($resizedImage, $filePath, 85);
            break;
        case 'image/png':
            $result = imagepng($resizedImage, $filePath, 6);
            break;
        case 'image/webp':
            if (function_exists('imagewebp')) {
                $result = imagewebp($resizedImage, $filePath, 85);
            }
            break;
    }

    // Limpiar memoria
    imagedestroy($sourceImage);
    imagedestroy($resizedImage);

    return $result;
}
?>