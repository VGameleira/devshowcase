<?php
/**
 * Upload de imagem para um projeto.
 *
 * Aceita apenas PNG, JPG, JPEG, GIF, WEBP.
 * A imagem é salva em /backend/uploads/ com um nome único.
 *
 * Exemplo de uso (form-data):
 *   POST /upload.php
 *   project_id: 5
 *   imagem: (arquivo)
 *
 * Retorna a URL relativa da imagem salva.
 */

require_once __DIR__ . '/../config/headers.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/middleware.php';

$user = requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Método não permitido.']);
    exit;
}

// ─── Validações ──────────────────────────────────────────────────────────────

$projectId = isset($_POST['project_id']) ? (int) $_POST['project_id'] : 0;
if (!$projectId) {
    http_response_code(400);
    echo json_encode(['error' => true, 'message' => 'ID do projeto é obrigatório.']);
    exit;
}

if (!isset($_FILES['imagem']) || $_FILES['imagem']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => true, 'message' => 'Nenhuma imagem enviada ou erro no upload.']);
    exit;
}

$file = $_FILES['imagem'];

// Extensões permitidas
$allowedExts = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($ext, $allowedExts)) {
    http_response_code(400);
    echo json_encode(['error' => true, 'message' => 'Formato de imagem não permitido. Use PNG, JPG, GIF ou WEBP.']);
    exit;
}

// Limite de 5MB
$maxSize = 5 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => true, 'message' => 'Imagem muito grande. Máximo permitido: 5MB.']);
    exit;
}

// ─── Salva o arquivo ─────────────────────────────────────────────────────────

$uploadDir = __DIR__ . '/../uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Nome único pra evitar colisão
$newName = 'project_' . $projectId . '_' . time() . '.' . $ext;
$destino = $uploadDir . $newName;

if (!move_uploaded_file($file['tmp_name'], $destino)) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => 'Erro ao salvar a imagem no servidor.']);
    exit;
}

// ─── Atualiza o projeto com o caminho da imagem ───────────────────────────────

$database = new Database();
$db = $database->getConnection();

$imageUrl = 'uploads/' . $newName;
$stmt = $db->prepare('UPDATE projects SET imagem = :imagem WHERE id = :id');
$stmt->execute([':imagem' => $imageUrl, ':id' => $projectId]);

http_response_code(200);
echo json_encode([
    'error'   => false,
    'message' => 'Imagem enviada com sucesso.',
    'url'     => $imageUrl,
]);
