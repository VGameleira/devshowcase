<?php
/**
 * Conexão com o banco de dados usando PDO.
 *
 * As credenciais são carregadas do arquivo .env
 * para manter dados sensíveis fora do código fonte.
 */
class Database
{
    private string $host;
    private string $dbName;
    private string $username;
    private string $password;
    private string $charset;
    private bool $isDev;

    public ?PDO $conn = null;

    public function __construct()
    {
        // Carrega as variáveis de ambiente do arquivo .env
        // (que está na pasta backend/ e ignorado pelo git)
        $envFile = __DIR__ . '/../.env';
        $env = file_exists($envFile) ? parse_ini_file($envFile) : [];

        $this->host    = $env['DB_HOST']    ?? 'localhost';
        $this->dbName  = $env['DB_NAME']    ?? 'devshowcase_db';
        $this->username = $env['DB_USER']   ?? 'root';
        $this->password = $env['DB_PASS']   ?? '';
        $this->charset  = $env['DB_CHARSET'] ?? 'utf8mb4';
        $this->isDev    = ($env['ENVIRONMENT'] ?? 'production') === 'development';
    }

    /**
     * Abre (ou reusa) a conexão PDO e retorna a instância.
     */
    public function getConnection(): ?PDO
    {
        if ($this->conn !== null) {
            return $this->conn;
        }

        try {
            $dsn = sprintf(
                'mysql:host=%s;dbname=%s;charset=%s',
                $this->host,
                $this->dbName,
                $this->charset
            );

            $this->conn = new PDO($dsn, $this->username, $this->password, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);

            $this->conn->exec("SET NAMES {$this->charset} COLLATE {$this->charset}_unicode_ci");
        } catch (PDOException $e) {
            error_log('[Database] Erro na conexão: ' . $e->getMessage());

            // Em produção, mostra só uma mensagem genérica
            if ($this->isDev) {
                echo json_encode([
                    'error'   => true,
                    'message' => 'Erro na conexão com o banco de dados.',
                    'detail'  => $e->getMessage(),
                ]);
            } else {
                echo json_encode([
                    'error'   => true,
                    'message' => 'Erro interno do servidor.',
                ]);
            }
            exit;
        }

        return $this->conn;
    }
}
