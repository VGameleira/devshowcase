<?php
include_once '../config/headers.php';
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->senha)) {
    $query = "SELECT id, nome, senha FROM users WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $data->email);
    $stmt->execute();
    
    if($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if(password_verify($data->senha, $row['senha'])) {
            // Em produção, gere um JWT. Aqui usamos um token simples para exemplo.
            $token = base64_encode(random_bytes(32)); 
            http_response_code(200);
            echo json_encode([
                "message" => "Login realizado com sucesso.",
                "token" => $token,
                "user" => ["id" => $row['id'], "nome" => $row['nome']]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Credenciais inválidas."]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Usuário não encontrado."]);
    }
}
?>