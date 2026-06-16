<?php
/**
 * Middleware simples de autenticação via token.
 *
 * Inclua este arquivo no início dos endpoints protegidos.
 * Ele verifica se o header Authorization: Bearer <token>
 * corresponde ao token armazenado na sessão.
 */

function requireAuth(): array
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Pega o token do header Authorization
    $authHeader = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? '';

    if (!preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => true, 'message' => 'Token não informado.']);
        exit;
    }

    $token = $matches[1];

    // Verifica se o token bate com o da sessão
    if (!isset($_SESSION['token']) || !hash_equals($_SESSION['token'], $token)) {
        http_response_code(401);
        echo json_encode(['error' => true, 'message' => 'Token inválido ou expirado.']);
        exit;
    }

    return [
        'id'   => $_SESSION['user_id'],
        'nome' => $_SESSION['user_nome'],
    ];
}
