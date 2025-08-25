<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
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
            getBlog($pdo, $id);
        } else {
            getAllBlogs($pdo);
        }
        break;
    
    case 'POST':
        createBlog($pdo);
        break;
    
    case 'PUT':
        if ($id) {
            updateBlog($pdo, $id);
        } else {
            echo json_encode(["error" => "ID is required for update"]);
        }
        break;
    
    case 'DELETE':
        if ($id) {
            deleteBlog($pdo, $id);
        } else {
            echo json_encode(["error" => "ID is required for delete"]);
        }
        break;
    
    default:
        echo json_encode(["error" => "Method not allowed"]);
        break;
}

function debugTable($pdo) {
    try {
        // Mostrar estructura de la tabla
        $stmt = $pdo->query("DESCRIBE blogs");
        $structure = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Mostrar una fila de ejemplo
        $stmt = $pdo->query("SELECT * FROM blogs LIMIT 1");
        $sample = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            "table_structure" => $structure,
            "sample_row" => $sample,
            "column_names" => array_keys($sample ?: [])
        ]);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function getAllBlogs($pdo) {
    try {
        // Primero intentar con columnas genéricas
        $stmt = $pdo->query("SELECT * FROM blogs ORDER BY `COL 6` DESC, `COL 7` DESC");
        $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Mapear columnas genéricas a nombres reales
        $mappedResults = mapGenericColumns($resultados);
        
        echo json_encode($mappedResults);
    } catch (PDOException $e) {
        // Si falla, intentar con nombres normales
        try {
            $stmt = $pdo->query("
                SELECT 
                    id, title, content, excerpt, image_url, 
                    published_at, created_at, updated_at, 
                    author, category, slug 
                FROM blogs 
                ORDER BY published_at DESC, created_at DESC
            ");
            $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($resultados);
        } catch (PDOException $e2) {
            echo json_encode(["error" => $e2->getMessage()]);
        }
    }
}

function getBlog($pdo, $id) {
    try {
        // Primero intentar con columnas genéricas
        $stmt = $pdo->prepare("SELECT * FROM blogs WHERE `COL 1` = ?");
        $stmt->execute([$id]);
        $blog = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($blog) {
            // Mapear columnas genéricas a nombres reales
            $mappedBlog = mapGenericColumns([$blog])[0];
            echo json_encode($mappedBlog);
        } else {
            echo json_encode(["error" => "Blog not found"]);
        }
    } catch (PDOException $e) {
        // Si falla, intentar con nombres normales
        try {
            $stmt = $pdo->prepare("
                SELECT 
                    id, title, content, excerpt, image_url, 
                    published_at, created_at, updated_at, 
                    author, category, slug 
                FROM blogs 
                WHERE id = ?
            ");
            $stmt->execute([$id]);
            $blog = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($blog) {
                echo json_encode($blog);
            } else {
                echo json_encode(["error" => "Blog not found"]);
            }
        } catch (PDOException $e2) {
            echo json_encode(["error" => $e2->getMessage()]);
        }
    }
}

// Función para procesar fechas de manera segura
function processPublishedDate($dateInput) {
    if (!$dateInput) {
        return date('Y-m-d H:i:s');
    }
    
    // Si ya es una fecha en formato YYYY-MM-DD, agregarle la hora
    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateInput)) {
        return $dateInput . ' 12:00:00'; // Usar mediodía para evitar problemas de zona horaria
    }
    
    // Si tiene formato ISO con T, extraer solo la fecha y agregar mediodía
    if (strpos($dateInput, 'T') !== false) {
        $dateOnly = explode('T', $dateInput)[0];
        return $dateOnly . ' 12:00:00';
    }
    
    // Si ya tiene fecha y hora, usarla tal como está
    if (preg_match('/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/', $dateInput)) {
        return $dateInput;
    }
    
    // Como último recurso, intentar parsear la fecha
    try {
        $timestamp = strtotime($dateInput);
        if ($timestamp !== false) {
            return date('Y-m-d H:i:s', $timestamp);
        }
    } catch (Exception $e) {
        // Si todo falla, usar la fecha actual
        return date('Y-m-d H:i:s');
    }
    
    return date('Y-m-d H:i:s');
}

function createBlog($pdo) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['title']) || !isset($input['content'])) {
            echo json_encode(["error" => "Title and content are required"]);
            return;
        }
        
        // Verificar si las columnas existen
        $stmt = $pdo->query("DESCRIBE blogs");
        $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        $id = generateUUID();
        $now = date('Y-m-d H:i:s');
        
        // Procesar la fecha de publicación de manera segura
        $publishedAt = processPublishedDate($input['published_at'] ?? null);
        
        // Log para debugging
        error_log("Creating blog with published_at: " . $publishedAt);
        error_log("Original input: " . ($input['published_at'] ?? 'null'));
        
        // Intentar primero con columnas genéricas
        try {
            $stmt = $pdo->prepare("
                INSERT INTO blogs (
                    `COL 1`, `COL 2`, `COL 3`, `COL 4`, `COL 5`, 
                    `COL 6`, `COL 7`, `COL 8`, `COL 9`, `COL 10`, `COL 11`
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $id,                                    // COL 1 - id
                $input['title'] ?? '',                  // COL 2 - title
                $input['content'] ?? '',                // COL 3 - content
                $input['excerpt'] ?? '',                // COL 4 - excerpt
                $input['image_url'] ?? '',              // COL 5 - image_url
                $publishedAt,                           // COL 6 - published_at
                $now,                                   // COL 7 - created_at
                $now,                                   // COL 8 - updated_at
                $input['author'] ?? '',                 // COL 9 - author
                $input['category'] ?? '',               // COL 10 - category
                $input['slug'] ?? ''                    // COL 11 - slug
            ]);
        } catch (PDOException $e) {
            // Si falla, intentar con nombres normales
            $columnMap = [
                'id' => $id,
                'title' => $input['title'] ?? '',
                'content' => $input['content'] ?? '',
                'excerpt' => $input['excerpt'] ?? '',
                'image_url' => $input['image_url'] ?? '',
                'published_at' => $publishedAt,
                'created_at' => $now,
                'updated_at' => $now,
                'author' => $input['author'] ?? '',
                'category' => $input['category'] ?? '',
                'slug' => $input['slug'] ?? ''
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
            
            $sql = "INSERT INTO blogs (" . implode(', ', $insertColumns) . ") VALUES (" . implode(', ', $insertValues) . ")";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($insertData);
        }

        echo json_encode(["success" => true, "id" => $id]);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function updateBlog($pdo, $id) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['title']) || !isset($input['content'])) {
            echo json_encode(["error" => "Title and content are required"]);
            return;
        }
        
        $now = date('Y-m-d H:i:s');
        
        // Procesar la fecha de publicación de manera segura
        $publishedAt = processPublishedDate($input['published_at'] ?? null);
        
        // Log para debugging
        error_log("Updating blog with published_at: " . $publishedAt);
        error_log("Original input: " . ($input['published_at'] ?? 'null'));
        error_log("Input data: " . json_encode($input));
        
        // Intentar primero con columnas genéricas
        try {
            $stmt = $pdo->prepare("
                UPDATE blogs 
                SET `COL 2` = ?, `COL 3` = ?, `COL 4` = ?, `COL 5` = ?, 
                    `COL 6` = ?, `COL 8` = ?, `COL 9` = ?, `COL 10` = ?, `COL 11` = ?
                WHERE `COL 1` = ?
            ");
            
            $stmt->execute([
                $input['title'],                        // COL 2 - title
                $input['content'],                      // COL 3 - content
                $input['excerpt'] ?? '',                // COL 4 - excerpt
                $input['image_url'] ?? '',              // COL 5 - image_url
                $publishedAt,                           // COL 6 - published_at
                $now,                                   // COL 8 - updated_at
                $input['author'] ?? '',                 // COL 9 - author
                $input['category'] ?? '',               // COL 10 - category
                $input['slug'] ?? '',                   // COL 11 - slug
                $id                                     // WHERE COL 1 = id
            ]);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["error" => "No rows updated. Blog may not exist."]);
            }
        } catch (PDOException $e) {
            // Si falla, intentar con nombres normales
            $stmt = $pdo->query("DESCRIBE blogs");
            $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
            
            $updateColumns = [];
            $updateData = [];
            
            $columnMap = [
                'title' => $input['title'],
                'content' => $input['content'],
                'excerpt' => $input['excerpt'] ?? '',
                'image_url' => $input['image_url'] ?? '',
                'published_at' => $publishedAt,
                'updated_at' => $now,
                'author' => $input['author'] ?? '',
                'category' => $input['category'] ?? '',
                'slug' => $input['slug'] ?? ''
            ];
            
            foreach ($columnMap as $column => $value) {
                if (in_array($column, $columns)) {
                    $updateColumns[] = "$column = ?";
                    $updateData[] = $value;
                }
            }
            
            $updateData[] = $id; // Para el WHERE
            
            $sql = "UPDATE blogs SET " . implode(', ', $updateColumns) . " WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($updateData);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["error" => "No rows updated. Blog may not exist."]);
            }
        }
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function deleteBlog($pdo, $id) {
    try {
        // Intentar obtener información del blog primero con columnas genéricas
        try {
            $stmt = $pdo->prepare("SELECT `COL 5` FROM blogs WHERE `COL 1` = ?");
            $stmt->execute([$id]);
            $blog = $stmt->fetch(PDO::FETCH_ASSOC);
            $imageUrl = $blog['COL 5'] ?? '';
        } catch (PDOException $e) {
            // Si falla, intentar con nombres normales
            $stmt = $pdo->prepare("SELECT image_url FROM blogs WHERE id = ?");
            $stmt->execute([$id]);
            $blog = $stmt->fetch(PDO::FETCH_ASSOC);
            $imageUrl = $blog['image_url'] ?? '';
        }
        
        // Eliminar imagen si no es de Pexels
        if ($imageUrl && strpos($imageUrl, 'pexels.com') === false) {
            $imagePath = str_replace('https://domumarquitectura.com/assets/', '/home/domumarq/public_html/assets/', $imageUrl);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        // Eliminar el blog - intentar primero con columnas genéricas
        try {
            $stmt = $pdo->prepare("DELETE FROM blogs WHERE `COL 1` = ?");
            $stmt->execute([$id]);
        } catch (PDOException $e) {
            // Si falla, intentar con nombres normales
            $stmt = $pdo->prepare("DELETE FROM blogs WHERE id = ?");
            $stmt->execute([$id]);
        }
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["error" => "Blog not found"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function mapGenericColumns($results) {
    $columnMap = [
        'COL 1' => 'id',
        'COL 2' => 'title', 
        'COL 3' => 'content',
        'COL 4' => 'excerpt',
        'COL 5' => 'image_url',
        'COL 6' => 'published_at',
        'COL 7' => 'created_at',
        'COL 8' => 'updated_at',
        'COL 9' => 'author',
        'COL 10' => 'category',
        'COL 11' => 'slug'
    ];
    
    $mappedResults = [];
    foreach ($results as $row) {
        $mappedRow = [];
        foreach ($row as $key => $value) {
            $newKey = $columnMap[$key] ?? $key;
            $mappedRow[$newKey] = $value;
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