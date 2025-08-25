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

if (!$id) {
    echo json_encode(["success" => false, "error" => "ID es obligatorio"]);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("DELETE FROM usuarios WHERE id=?");
    $stmt->execute([$id]);

    echo json_encode(["success" => true, "message" => "Usuario eliminado"]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
