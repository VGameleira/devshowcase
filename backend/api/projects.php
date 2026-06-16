<?php
/**
 * API de Projetos — CRUD completo.
 *
 * GET    /projects.php       → Lista todos os projetos
 * GET    /projects.php?id=X  → Retorna um projeto específico
 * POST   /projects.php       → Cria um novo projeto (requer token)
 * PUT    /projects.php       → Atualiza um projeto existente (requer token)
 * DELETE /projects.php       → Remove um projeto (requer token)
 */

require_once __DIR__ . '/../config/headers.php';
require_once __DIR__ . '/../config/database.php';

$database = new Database();
$db       = $database->getConnection();
$method   = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // ──────────────────────────────────────────────
    // LISTAR / DETALHAR
    // ──────────────────────────────────────────────
    case 'GET':
        $id = isset($_GET['id']) ? (int) $_GET['id'] : null;

        if ($id) {
            // Projeto específico
            $stmt = $db->prepare('SELECT * FROM projects WHERE id = :id LIMIT 1');
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $project = $stmt->fetch();

            if (!$project) {
                http_response_code(404);
                echo json_encode(['error' => true, 'message' => 'Projeto não encontrado.']);
                exit;
            }

            http_response_code(200);
            echo json_encode($project);
        } else {
            // Lista completa, do mais recente primeiro
            $stmt = $db->query('SELECT * FROM projects ORDER BY created_at DESC');
            $projects = $stmt->fetchAll();

            http_response_code(200);
            echo json_encode($projects);
        }
        break;

    // ──────────────────────────────────────────────
    // CRIAR
    // ──────────────────────────────────────────────
    case 'POST':
        require_once __DIR__ . '/middleware.php';
        requireAuth();

        $data = json_decode(file_get_contents('php://input'));

        if (empty($data->titulo) || empty($data->descricao)) {
            http_response_code(400);
            echo json_encode(['error' => true, 'message' => 'Título e descrição são obrigatórios.']);
            exit;
        }

        $stmt = $db->prepare('
            INSERT INTO projects (titulo, descricao, tecnologias, categoria, link_github, link_demo, destaque, status)
            VALUES (:titulo, :descricao, :tecnologias, :categoria, :link_github, :link_demo, :destaque, :status)
        ');

        $stmt->execute([
            ':titulo'      => $data->titulo,
            ':descricao'   => $data->descricao,
            ':tecnologias' => $data->tecnologias ?? '',
            ':categoria'   => $data->categoria   ?? '',
            ':link_github' => $data->link_github ?? '',
            ':link_demo'   => $data->link_demo   ?? '',
            ':destaque'    => !empty($data->destaque) ? 1 : 0,
            ':status'      => $data->status ?? 'ativo',
        ]);

        http_response_code(201);
        echo json_encode([
            'error'   => false,
            'message' => 'Projeto criado com sucesso.',
            'id'      => $db->lastInsertId(),
        ]);
        break;

    // ──────────────────────────────────────────────
    // ATUALIZAR
    // ──────────────────────────────────────────────
    case 'PUT':
        require_once __DIR__ . '/middleware.php';
        requireAuth();

        $data = json_decode(file_get_contents('php://input'));

        if (empty($data->id)) {
            http_response_code(400);
            echo json_encode(['error' => true, 'message' => 'ID do projeto é obrigatório.']);
            exit;
        }

        $stmt = $db->prepare('
            UPDATE projects
            SET titulo = :titulo,
                descricao = :descricao,
                tecnologias = :tecnologias,
                categoria = :categoria,
                link_github = :link_github,
                link_demo = :link_demo,
                destaque = :destaque,
                status = :status
            WHERE id = :id
        ');

        $stmt->execute([
            ':id'          => (int) $data->id,
            ':titulo'      => $data->titulo,
            ':descricao'   => $data->descricao,
            ':tecnologias' => $data->tecnologias ?? '',
            ':categoria'   => $data->categoria   ?? '',
            ':link_github' => $data->link_github ?? '',
            ':link_demo'   => $data->link_demo   ?? '',
            ':destaque'    => !empty($data->destaque) ? 1 : 0,
            ':status'      => $data->status ?? 'ativo',
        ]);

        http_response_code(200);
        echo json_encode(['error' => false, 'message' => 'Projeto atualizado com sucesso.']);
        break;

    // ──────────────────────────────────────────────
    // DELETAR
    // ──────────────────────────────────────────────
    case 'DELETE':
        require_once __DIR__ . '/middleware.php';
        requireAuth();

        $data = json_decode(file_get_contents('php://input'));

        if (empty($data->id)) {
            http_response_code(400);
            echo json_encode(['error' => true, 'message' => 'ID do projeto é obrigatório.']);
            exit;
        }

        $stmt = $db->prepare('DELETE FROM projects WHERE id = :id');
        $stmt->execute([':id' => (int) $data->id]);

        http_response_code(200);
        echo json_encode(['error' => false, 'message' => 'Projeto removido com sucesso.']);
        break;

    // ──────────────────────────────────────────────
    // MÉTODO NÃO SUPORTADO
    // ──────────────────────────────────────────────
    default:
        http_response_code(405);
        echo json_encode(['error' => true, 'message' => 'Método não permitido.']);
        break;
}
