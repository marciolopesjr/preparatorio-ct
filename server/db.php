<?php
declare(strict_types=1);

$CONFIG = require __DIR__ . '/config.php';

function ct_db(): PDO
{
    global $CONFIG;
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $config = $CONFIG;
    $dir = dirname($config['db']);
    if (!is_dir($dir)) {
        mkdir($dir, 0770, true);
    }
    $pdo = new PDO('sqlite:' . $config['db'], null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    $pdo->exec('PRAGMA journal_mode = WAL');
    $pdo->exec('PRAGMA synchronous = NORMAL');
    $pdo->exec('PRAGMA busy_timeout = 3000');
    foreach ([
        "CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            ts TEXT NOT NULL,
            received_at TEXT NOT NULL,
            visitor TEXT,
            session TEXT,
            path TEXT,
            ip TEXT,
            country TEXT,
            ua TEXT,
            referrer TEXT,
            props TEXT NOT NULL DEFAULT '{}'
        )",
        'CREATE INDEX IF NOT EXISTS idx_events_received ON events(received_at)',
        'CREATE INDEX IF NOT EXISTS idx_events_name ON events(name)',
        'CREATE INDEX IF NOT EXISTS idx_events_visitor ON events(visitor)',
        'CREATE INDEX IF NOT EXISTS idx_events_session ON events(session)',
        'CREATE INDEX IF NOT EXISTS idx_events_ip_time ON events(ip, received_at)',
    ] as $sql) {
        $pdo->exec($sql);
    }
    return $pdo;
}

function ct_count(PDO $db, string $sql, array $args = []): int
{
    $statement = $db->prepare($sql);
    $statement->execute($args);
    return (int) $statement->fetchColumn();
}
