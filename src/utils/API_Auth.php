<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Habilitar logging para debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "190.8.176.241";
$db = "domumarq_arquitectura_portfolio";
$user = "domumarq_test";
$pass = "pw6?oq@S";

// Log de la solicitud entrante
file_put_contents('login_log.txt', date('Y-m-d H:i:s') . " - Solicitud recibida\n", FILE_APPEND);

$input = json_decode(file_get_contents("php://input"), true);
$email = isset($input['email']) ? trim($input['email']) : '';
$password = isset($input['password']) ? trim($input['password']) : '';

file_put_contents('login_log.txt', "Email: $email, Password: [PROTEGIDO]\n", FILE_APPEND);

if (!$email || !$password) {
    file_put_contents('login_log.txt', "Error: Campos vacíos\n", FILE_APPEND);
    echo json_encode(["success" => false, "error" => "Email y contraseña son obligatorias"]);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Cambiar la consulta para asegurar que obtenemos el campo password
    $stmt = $pdo->prepare("SELECT id, email, name, password FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $userData = $stmt->fetch();

    if ($userData) {
        file_put_contents('login_log.txt', "Usuario encontrado: " . print_r($userData, true) . "\n", FILE_APPEND);
        
        // Verificar si el campo password existe y tiene valor
        if (!isset($userData['password']) || empty($userData['password'])) {
            file_put_contents('login_log.txt', "Error: Campo password vacío o no existe\n", FILE_APPEND);
            echo json_encode(["success" => false, "error" => "Error en la base de datos: campo password vacío"]);
            exit;
        }
        
        file_put_contents('login_log.txt', "Contraseña BD: " . $userData['password'] . "\n", FILE_APPEND);
        file_put_contents('login_log.txt', "MD5 de entrada: " . md5($password) . "\n", FILE_APPEND);
        
        // Verificar con MD5
        if (md5($password) === $userData['password']) {
            file_put_contents('login_log.txt', "Autenticación exitosa\n", FILE_APPEND);
            echo json_encode([
                "success" => true,
                "user" => [
                    "id" => $userData['id'],
                    "email" => $userData['email'],
                    "name" => $userData['name']
                ]
            ]);
        } else {
            file_put_contents('login_log.txt', "Error: Contraseña incorrecta\n", FILE_APPEND);
            echo json_encode(["success" => false, "error" => "Credenciales incorrectas"]);
        }
    } else {
        file_put_contents('login_log.txt', "Error: Usuario no encontrado\n", FILE_APPEND);
        echo json_encode(["success" => false, "error" => "Credenciales incorrectas"]);
    }

} catch (PDOException $e) {
    file_put_contents('login_log.txt', "Error BD: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(["success" => false, "error" => "Error de conexión: " . $e->getMessage()]);
}
?>