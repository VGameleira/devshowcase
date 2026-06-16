<?php
/**
 * Login da API — retorna um token de acesso.
 *
 * O token é gerado com random_bytes e guardado em sessão.
 * As próximas requisições devem enviar esse token
 * no header Authorization: Bearer <token>.
 */

require_once __DIR__ . '/../config/headers.php';
require_once __DIR__ . '/../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Método não permitido.']);
    exit;
}

// Pega o JSON enviado pelo frontend
$data = json_decode(file_get_contents('php://input'));

if (empty($data->email) || empty($data->senha)) {
    http_response_code(400);
    echo json_encode(['error' => true, 'message' => 'Email e senha são obrigatórios.']);
    exit;
}

$query = 'SELECT id, nome, senha FROM users WHERE email = :email LIMIT 1';
$stmt  = $db->prepare($query);
$stmt->bindParam(':email', $data->email);
$stmt->execute();

$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Usuário existe?
if (!$user) {
    // Por segurança, não revelamos se o email existe ou não
    http_response_code(401);
    echo json_encode(['error' => true, 'message' => 'Credenciais inválidas.']);
    exit;
}

// Senha confere?
if (!password_verify($data->senha, $user['senha'])) {
    http_response_code(401);
    echo json_encode(['error' => true, 'message' => 'Credenciais inválidas.']);
    exit;
}

// Tudo certo — gera um token de acesso
// Num cenário real, usaríamos JWT. Aqui usamos um token simples
// armazenado em sessão, que é suficiente para este porte de projeto.
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
session_regenerate_id(true);

$token = bin2hex(random_bytes(32));
$_SESSION['token']    = $token;
$_SESSION['user_id']  = $user['id'];
$_SESSION['user_nome'] = $user['nome'];

http_response_code(200);
echo json_encode([
    'error'   => false,
    'message' => 'Login realizado com sucesso.',
    'token'   => $token,
    'user'    => [
        'id'   => $user['id'],
        'nome' => $user['nome'],
    ],
]);
