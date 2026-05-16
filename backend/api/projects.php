<?php
include_once '../config/headers.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Listar Projetos
        $id = isset($_GET['id']) ? $_GET['id'] : die();
        $query = "SELECT * FROM projects";
        if($id) {
            $query .= " WHERE id = :id LIMIT 1";
        }
        $query .= " ORDER BY created_at DESC";
        
        $stmt = $db->prepare($query);
        if($id) $stmt->bindParam(':id', $id);
        $stmt->execute();
        
        $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($projects);
        break;

    case 'POST':
        // Criar Projeto
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->titulo) && !empty($data->descricao)) {
            $query = "INSERT INTO projects SET titulo=:titulo, descricao=:descricao, tecnologias=:tecnologias, categoria=:categoria, link_github=:link_github, link_demo=:link_demo, destaque=:destaque, status=:status";
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":titulo", $data->titulo);
            $stmt->bindParam(":descricao", $data->descricao);
            $stmt->bindParam(":tecnologias", $data->tecnologias);
            $stmt->bindParam(":categoria", $data->categoria);
            $stmt->bindParam(":link_github", $data->link_github);
            $stmt->bindParam(":link_demo", $data->link_demo);
            $stmt->bindParam(":destaque", $data->destaque);
            $stmt->bindParam(":status", $data->status);
            
            if($stmt->execute()) {
                http_response_code(201);
                echo json_encode(["message" => "Projeto criado com sucesso."]);
            } else {
                http_response_code(503);
                echo json_encode(["message" => "Erro ao criar projeto."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Dados incompletos."]);
        }
        break;

    case 'DELETE':
        // Deletar Projeto
        $data = json_decode(file_get_contents("php://input"));
        if(!empty($data->id)) {
            $query = "DELETE FROM projects WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":id", $data->id);
            
            if($stmt->execute()) {
                http_response_code(200);
                echo json_encode(["message" => "Projeto deletado."]);
            }
        }
        break;
        
    // (O PUT seria semelhante ao POST, adicionando o WHERE id = :id)
}
?>