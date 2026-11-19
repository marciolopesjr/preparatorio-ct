<?php
declare(strict_types=1);

// Configuração por variáveis de ambiente. Nada de senha em texto aqui.
return [
    // SQLite: mantenha fora do diretório público em produção.
    'db' => getenv('CT_DB') ?: dirname(__DIR__) . '/data/events.sqlite',
    'admin_user' => getenv('CT_ADMIN_USER') ?: 'admin',
    // Gere com: php -r 'echo password_hash("sua-senha", PASSWORD_DEFAULT), PHP_EOL;'
    'admin_hash' => getenv('CT_ADMIN_HASH') ?: '',
    // Só preencha se o frontend for servido de outro domínio (ex.: site estático + API PHP).
    'allowed_origin' => getenv('CT_ALLOWED_ORIGIN') ?: '',
    'max_body_bytes' => 262144,
    'max_events' => 50,
    'max_props_bytes' => 8192,
    'rate_per_minute' => 600,
];
