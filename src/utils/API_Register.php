<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = "190.8.176.241";
$db = "domumarq_arquitectura_portfolio";
$user = "domumarq_test";
$pass = "pw6?oq@S";

$input = json_decode(file_get_contents("php://input"), true);
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$password = trim($input['password'] ?? '');

if (!$name || !$email || !$password) {
    echo json_encode(["success" => false, "error" => "Todos los campos son obligatorios"]);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Comprobar si el email ya existe
    $check = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
    $check->execute([$email]);
    if ($check->fetch()) {
        echo json_encode(["success" => false, "error" => "El correo ya está registrado"]);
        exit;
    }

    // Hashear con md5 (para mantener compatibilidad con login actual)
    $hashedPassword = md5($password);

    $stmt = $pdo->prepare("INSERT INTO usuarios (NAME, email, PASSWORD, create_at) VALUES (?, ?, ?, NOW())");
    $stmt->execute([$name, $email, $hashedPassword]);

    echo json_encode([
        "success" => true,
        "message" => "Usuario registrado con éxito",
        "user" => [
            "id" => $pdo->lastInsertId(),
            "name" => $name,
            "email" => $email
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
