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
$id = $input['id'] ?? '';
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$password = trim($input['password'] ?? '');

if (!$id || !$name || !$email) {
    echo json_encode(["success" => false, "error" => "ID, nombre y email son obligatorios"]);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($password) {
        $hashedPassword = md5($password);
        $stmt = $pdo->prepare("UPDATE usuarios SET NAME=?, email=?, PASSWORD=? WHERE id=?");
        $stmt->execute([$name, $email, $hashedPassword, $id]);
    } else {
        $stmt = $pdo->prepare("UPDATE usuarios SET NAME=?, email=? WHERE id=?");
        $stmt->execute([$name, $email, $id]);
    }

    echo json_encode(["success" => true, "message" => "Usuario actualizado"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
