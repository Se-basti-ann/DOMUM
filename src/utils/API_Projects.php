<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

$host = "190.8.176.241";
$db = "domumarq_arquitectura_portfolio";
$user = "domumarq_test";
$pass = "pw6?oq@S";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'] ?? '', '/'));
$id = $request[0] ?? null;

// Endpoint especial para debugging
if ($method === 'GET' && $id === 'debug') {
    debugTable($pdo);
    exit;
}

switch ($method) {
    case 'GET':
        if ($id) {
            getProject($pdo, $id);
        } else {
            getAllProjects($pdo);
        }
        break;
    
    case 'POST':
        createProject($pdo);
        break;
        
    case 'PUT':
        if ($id) {
            updateProject($pdo, $id);
        } else {
            http_response_code(400);
            echo json_encode(["error" => "ID is required for update"]);
        }
        break;
    
    case 'DELETE':
        if ($id) { // Corregido: era "id ($id)" en lugar de "if ($id)"
            deleteProject($pdo, $id);            
        } else {
            http_response_code(400);
            echo json_encode(["error" => "ID is required for delete"]);
        }
        break;
    
    default:
        http_response_code(405);
        echo json_encode(["error" => "Method not allowed"]);
        break;
}

function debugTable($pdo) {
    try {
        $stmt = $pdo->query("DESCRIBE projects");
        $structure = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $stmt = $pdo->query("SELECT * FROM projects LIMIT 1");
        $sample = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            "table_structure" => $structure,
            "sample_row" => $sample,
            "column_names" => array_keys($sample ?: [])
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function getAllProjects($pdo) {
    try {
        $stmt = $pdo->query("SELECT * FROM projects ORDER BY `COL 11` DESC, `COL 12` DESC");
        $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $mappedResults = mapGenericColumns($resultados);

        echo json_encode($mappedResults);
    } catch (PDOException $e) {
        try {
            $stmt = $pdo->query("
                SELECT 
                    id, title, description, content, category, year, 
                    location, client, image_url, gallery, 
                    created_at, updated_at, slug, meters
                FROM projects 
                ORDER BY created_at DESC, updated_at DESC
            ");
            $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($resultados as &$proyecto) {
                $proyecto['gallery'] = processGalleryOutput($proyecto['gallery'] ?? '');
            }

            echo json_encode($resultados);
        } catch (PDOException $e2) {
            http_response_code(500);
            echo json_encode(["error" => $e2->getMessage()]);
        }
    }
}

function getProject($pdo, $id) {
    try {
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE `COL 1` = ?");
        $stmt->execute([$id]);
        $project = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($project) {
            $mappedProject = mapGenericColumns([$project])[0];
            echo json_encode($mappedProject);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Project not found"]);
        }
    } catch (PDOException $e) {
        try {
            $stmt = $pdo->prepare("
                SELECT 
                    id, title, description, content, category, year, 
                    location, client, image_url, gallery, 
                    created_at, updated_at, slug, meters
                FROM projects 
                WHERE id = ?
            ");
            $stmt->execute([$id]);
            $project = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($project) {
                $project['gallery'] = processGalleryOutput($project['gallery'] ?? '');
                echo json_encode($project);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Project not found"]);
            }
        } catch (PDOException $e2) {
            http_response_code(500);
            echo json_encode(["error" => $e2->getMessage()]);
        }
    }
}

function createProject($pdo) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['title']) || !isset($input['description'])) {
            http_response_code(400);
            echo json_encode(["error" => "Title and description are required"]);
            return;
        }
        
        // Verificar si las columnas existen
        $stmt = $pdo->query("DESCRIBE projects");
        $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        $id = generateUUID();
        $now = date('Y-m-d H:i:s');
        
        // Procesar gallery - asegurar que sea JSON válido
        $gallery = processGalleryInput($input['gallery'] ?? []);
        
        // Log para debugging
        error_log("Creating project with gallery: " . $gallery);
        
        // Intentar primero con columnas genéricas
        try {
            $stmt = $pdo->prepare("
                INSERT INTO projects (
                    `COL 1`, `COL 2`, `COL 3`, `COL 4`, `COL 5`, `COL 6`, 
                    `COL 7`, `COL 8`, `COL 9`, `COL 10`, `COL 11`, `COL 12`, `COL 13`, `COL 14`
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $id,                                    // COL 1 - id
                $input['title'] ?? '',                  // COL 2 - title
                $input['description'] ?? '',            // COL 3 - description
                $input['content'] ?? '',                // COL 4 - content
                $input['category'] ?? '',               // COL 5 - category
                $input['year'] ?? '',                   // COL 6 - year
                $input['location'] ?? '',               // COL 7 - location
                $input['client'] ?? '',                 // COL 8 - client
                $input['image_url'] ?? '',              // COL 9 - image_url
                $gallery,                               // COL 10 - gallery
                $now,                                   // COL 11 - created_at
                $now,                                   // COL 12 - updated_at
                $input['slug'] ?? '',                   // COL 13 - slug
                $input['meters'] ?? ''                  // COL 14 - meters
            ]);
        } catch (PDOException $e) {
            // Si falla, intentar con nombres normales
            $columnMap = [
                'id' => $id,
                'title' => $input['title'] ?? '',
                'description' => $input['description'] ?? '',
                'content' => $input['content'] ?? '',
                'category' => $input['category'] ?? '',
                'year' => $input['year'] ?? '',
                'location' => $input['location'] ?? '',
                'client' => $input['client'] ?? '',
                'image_url' => $input['image_url'] ?? '',
                'gallery' => $gallery,
                'created_at' => $now,
                'updated_at' => $now,
                'slug' => $input['slug'] ?? '',
                'meters' => $input['meters'] ?? ''
            ];
            
            $insertColumns = [];
            $insertValues = [];
            $insertData = [];
            
            foreach ($columnMap as $column => $value) {
                if (in_array($column, $columns)) {
                    $insertColumns[] = $column;
                    $insertValues[] = '?';
                    $insertData[] = $value;
                }
            }
            
            $sql = "INSERT INTO projects (" . implode(', ', $insertColumns) . ") VALUES (" . implode(', ', $insertValues) . ")";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($insertData);
        }

        http_response_code(201);
        echo json_encode(["success" => true, "id" => $id]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function updateProject($pdo, $id) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['title']) || !isset($input['description'])) {
            http_response_code(400);
            echo json_encode(["error" => "Title and description are required"]);
            return;
        }
        
        $now = date('Y-m-d H:i:s');
        
        // Procesar gallery - asegurar que sea JSON válido
        $gallery = processGalleryInput($input['gallery'] ?? []);
        
        // Log para debugging
        error_log("Updating project with gallery: " . $gallery);
        error_log("Input data: " . json_encode($input));
        
        // Intentar primero con columnas genéricas
        try {
            $stmt = $pdo->prepare("
                UPDATE projects 
                SET `COL 2` = ?, `COL 3` = ?, `COL 4` = ?, `COL 5` = ?, `COL 6` = ?, 
                    `COL 7` = ?, `COL 8` = ?, `COL 9` = ?, `COL 10` = ?, `COL 12` = ?, 
                    `COL 13` = ?, `COL 14` = ?
                WHERE `COL 1` = ?
            ");
            
            $stmt->execute([
                $input['title'],                        // COL 2 - title
                $input['description'],                  // COL 3 - description
                $input['content'] ?? '',                // COL 4 - content
                $input['category'] ?? '',               // COL 5 - category
                $input['year'] ?? '',                   // COL 6 - year
                $input['location'] ?? '',               // COL 7 - location
                $input['client'] ?? '',                 // COL 8 - client
                $input['image_url'] ?? '',              // COL 9 - image_url
                $gallery,                               // COL 10 - gallery
                $now,                                   // COL 12 - updated_at
                $input['slug'] ?? '',                   // COL 13 - slug
                $input['meters'] ?? '',                 // COL 14 - meters
                $id                                     // WHERE COL 1 = id
            ]);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(["success" => true]);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "No rows updated. Project may not exist."]);
            }
        } catch (PDOException $e) {
            // Si falla, intentar con nombres normales
            $stmt = $pdo->query("DESCRIBE projects");
            $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
            
            $updateColumns = [];
            $updateData = [];
            
            $columnMap = [
                'title' => $input['title'],
                'description' => $input['description'],
                'content' => $input['content'] ?? '',
                'category' => $input['category'] ?? '',
                'year' => $input['year'] ?? '',
                'location' => $input['location'] ?? '',
                'client' => $input['client'] ?? '',
                'image_url' => $input['image_url'] ?? '',
                'gallery' => $gallery,
                'updated_at' => $now,
                'slug' => $input['slug'] ?? '',
                'meters' => $input['meters'] ?? ''
            ];
            
            foreach ($columnMap as $column => $value) {
                if (in_array($column, $columns)) {
                    $updateColumns[] = "$column = ?";
                    $updateData[] = $value;
                }
            }
            
            $updateData[] = $id; // Para el WHERE
            
            $sql = "UPDATE projects SET " . implode(', ', $updateColumns) . " WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($updateData);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(["success" => true]);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "No rows updated. Project may not exist."]);
            }
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function deleteProject($pdo, $id) {
    try {
        // Intentar obtener información del proyecto primero con columnas genéricas
        try {
            $stmt = $pdo->prepare("SELECT `COL 9`, `COL 10` FROM projects WHERE `COL 1` = ?");
            $stmt->execute([$id]);
            $project = $stmt->fetch(PDO::FETCH_ASSOC);
            $imageUrl = $project['COL 9'] ?? '';
            $gallery = $project['COL 10'] ?? '';
        } catch (PDOException $e) {
            // Si falla, intentar con nombres normales
            $stmt = $pdo->prepare("SELECT image_url, gallery FROM projects WHERE id = ?");
            $stmt->execute([$id]);
            $project = $stmt->fetch(PDO::FETCH_ASSOC);
            $imageUrl = $project['image_url'] ?? '';
            $gallery = $project['gallery'] ?? '';
        }
        
        // Eliminar imagen principal si no es externa
        if ($imageUrl && strpos($imageUrl, 'pexels.com') === false && strpos($imageUrl, 'domumarquitectura.com') !== false) {
            $imagePath = str_replace('https://domumarquitectura.com/assets/', '/home/domumarq/public_html/assets/', $imageUrl);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }
        
        // Eliminar imágenes de la galería
        if ($gallery) {
            $galleryArray = processGalleryOutput($gallery);
            foreach ($galleryArray as $galleryUrl) {
                if ($galleryUrl && strpos($galleryUrl, 'pexels.com') === false && strpos($galleryUrl, 'domumarquitectura.com') !== false) {
                    $galleryPath = str_replace('https://domumarquitectura.com/assets/', '/home/domumarq/public_html/assets/', $galleryUrl);
                    if (file_exists($galleryPath)) {
                        unlink($galleryPath);
                    }
                }
            }
        }

        // Eliminar el proyecto - intentar primero con columnas genéricas
        try {
            $stmt = $pdo->prepare("DELETE FROM projects WHERE `COL 1` = ?");
            $stmt->execute([$id]);
        } catch (PDOException $e) {
            // Si falla, intentar con nombres normales
            $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ?");
            $stmt->execute([$id]);
        }
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(["success" => true]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Project not found"]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function processGalleryInput($gallery) {
    // Si ya es un string JSON válido, devolverlo
    if (is_string($gallery)) {
        $decoded = json_decode($gallery, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $gallery;
        }
    }
    
    // Si es un array, convertirlo a JSON
    if (is_array($gallery)) {
        return json_encode($gallery);
    }
    
    // Si es null o vacío, devolver array vacío como JSON
    return json_encode([]);
}

function processGalleryOutput($gallery) {
    if (empty($gallery)) {
        return [];
    }
    
    // Si ya es un array, devolverlo
    if (is_array($gallery)) {
        return $gallery;
    }
    
    // Si es un string, intentar parsearlo como JSON
    if (is_string($gallery)) {
        $decoded = json_decode($gallery, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            return $decoded;
        }
        
        // Si no es JSON válido, intentar como string separado por comas
        if (strpos($gallery, ',') !== false) {
            return array_map('trim', explode(',', $gallery));
        }
        
        // Si es un solo string, devolverlo como array
        return [$gallery];
    }
    
    return [];
}

function mapGenericColumns($results) {
    $columnMap = [
        'COL 1' => 'id',
        'COL 2' => 'title', 
        'COL 3' => 'description',
        'COL 4' => 'content',
        'COL 5' => 'category',
        'COL 6' => 'year',
        'COL 7' => 'location',
        'COL 8' => 'client',
        'COL 9' => 'image_url',
        'COL 10' => 'gallery',
        'COL 11' => 'created_at',
        'COL 12' => 'updated_at',
        'COL 13' => 'slug',
        'COL 14' => 'meters'
    ];
    
    $mappedResults = [];
    foreach ($results as $row) {
        $mappedRow = [];
        foreach ($row as $key => $value) {
            $newKey = $columnMap[$key] ?? $key;
            if ($newKey === 'gallery') {
                $mappedRow[$newKey] = processGalleryOutput($value);
            } else {
                $mappedRow[$newKey] = $value;
            }
        }
        $mappedResults[] = $mappedRow;
    }
    
    return $mappedResults;
}

function generateUUID() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}
?>