<?php
/**
 * Cabeçalhos CORS e Content-Type para a API.
 *
 * Como o frontend React roda em porta diferente (ou domínio diferente)
 * no desenvolvimento, precisamos liberar o acesso cross-origin.
 * Em produção, troque o * pelo domínio real do frontend.
 */

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Max-Age: 3600');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// As requisições OPTIONS são usadas pelo navegador pra "negociar"
// as permissões CORS antes da requisição de verdade.
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
