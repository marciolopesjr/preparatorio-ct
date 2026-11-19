<?php
declare(strict_types=1);

ini_set('display_errors', '0');
require __DIR__ . '/db.php';

header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store');
header("Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'");

if ($CONFIG['admin_hash'] === '') {
    http_response_code(503);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Configure CT_ADMIN_HASH. Ex.:\nCT_ADMIN_HASH=\$(php -r 'echo password_hash(\"sua-senha\", PASSWORD_DEFAULT);')\n";
    exit;
}

$givenUser = (string) ($_SERVER['PHP_AUTH_USER'] ?? '');
$givenPass = (string) ($_SERVER['PHP_AUTH_PW'] ?? '');
if (!hash_equals($CONFIG['admin_user'], $givenUser) || !password_verify($givenPass, $CONFIG['admin_hash'])) {
    header('WWW-Authenticate: Basic realm="monitor", charset="UTF-8"');
    http_response_code(401);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Autenticação necessária.';
    exit;
}

function e(mixed $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$db = ct_db();

$name = preg_match('/^[a-z][a-z0-9_]{0,39}$/', (string) ($_GET['name'] ?? '')) === 1 ? (string) $_GET['name'] : '';
$visitor = preg_match('/^[A-Za-z0-9-]{8,64}$/', (string) ($_GET['visitor'] ?? '')) === 1 ? (string) $_GET['visitor'] : '';
$page = max(1, (int) ($_GET['page'] ?? 1));
$perPage = 100;

$where = [];
$args = [];
if ($name !== '') {
    $where[] = 'name = ?';
    $args[] = $name;
}
if ($visitor !== '') {
    $where[] = 'visitor = ?';
    $args[] = $visitor;
}
$whereSql = $where === [] ? '' : ' WHERE ' . implode(' AND ', $where);

$total = ct_count($db, 'SELECT COUNT(*) FROM events' . $whereSql, $args);
$pages = max(1, (int) ceil($total / $perPage));
$page = min($page, $pages);
$rows = $db->prepare('SELECT * FROM events' . $whereSql . ' ORDER BY id DESC LIMIT ' . $perPage . ' OFFSET ' . (($page - 1) * $perPage));
$rows->execute($args);
$events = $rows->fetchAll();

$stats = [
    'Visitas' => ct_count($db, "SELECT COUNT(*) FROM events WHERE name = 'page_view'"),
    'Visitantes' => ct_count($db, 'SELECT COUNT(DISTINCT visitor) FROM events'),
    'Sessões' => ct_count($db, 'SELECT COUNT(DISTINCT session) FROM events'),
    'Eventos hoje (UTC)' => ct_count($db, 'SELECT COUNT(*) FROM events WHERE received_at >= ?', [gmdate('Y-m-d\T00:00:00\Z')]),
];
$topEvents = $db->query('SELECT name, COUNT(*) AS total FROM events GROUP BY name ORDER BY total DESC LIMIT 10')->fetchAll();
$topSections = $db->query("SELECT json_extract(props, '$.section') AS section, COUNT(*) AS total FROM events WHERE name = 'section_view' GROUP BY section ORDER BY total DESC LIMIT 10")->fetchAll();

$visitorsWhere = static function (string $condition, array $args = []) use ($db): int {
    return ct_count($db, 'SELECT COUNT(DISTINCT visitor) FROM events WHERE ' . $condition, $args);
};

$funnel = [
    ['Chegou na página', $visitorsWhere('1 = 1')],
    ['Rolou 50%', $visitorsWhere("name = 'scroll_depth' AND json_extract(props, '$.pct') >= 50")],
    ['Viu a oferta (kits)', $visitorsWhere("name = 'section_view' AND json_extract(props, '$.section') = 'kits'")],
    ['Clicou em um CTA', $visitorsWhere("name = 'cta_click'")],
    ['Abriu o Pix', $visitorsWhere("name = 'pix_modal_open'")],
    ['Copiou o código Pix', $visitorsWhere("name = 'pix_copy'")],
    ['Foi pro WhatsApp', $visitorsWhere("name = 'whatsapp_click'")],
];
$funnelTop = max(1, $funnel[0][1]);

$bySource = $db->query(
    "SELECT COALESCE(json_extract(props, '$.utm.utm_source'), json_extract(props, '$.referrerHost'), '(direto)') AS source,
            COUNT(DISTINCT visitor) AS visitors
     FROM events WHERE name = 'page_view' GROUP BY source ORDER BY visitors DESC LIMIT 10",
)->fetchAll();

$byDevice = $db->query(
    "SELECT CASE WHEN json_extract(props, '$.viewport.w') < 768 THEN 'mobile' ELSE 'desktop' END AS device,
            COUNT(DISTINCT visitor) AS visitors
     FROM events WHERE name = 'page_view' GROUP BY device ORDER BY visitors DESC",
)->fetchAll();

$topCtas = $db->query(
    "SELECT json_extract(props, '$.cta') AS cta, COUNT(*) AS clicks, COUNT(DISTINCT visitor) AS visitors
     FROM events WHERE name = 'cta_click' GROUP BY cta ORDER BY clicks DESC LIMIT 10",
)->fetchAll();

$byKit = $db->query(
    "SELECT json_extract(props, '$.kit') AS kit, COUNT(DISTINCT visitor) AS visitors
     FROM events WHERE name = 'pix_modal_open' GROUP BY kit ORDER BY visitors DESC",
)->fetchAll();

$query = static function (array $overrides): string {
    $base = array_filter(['name' => $_GET['name'] ?? '', 'visitor' => $_GET['visitor'] ?? '', 'page' => $_GET['page'] ?? '']);
    return '?' . http_build_query(array_filter(array_merge($base, $overrides), static fn ($v) => $v !== '' && $v !== null));
};
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Monitor de acessos</title>
<style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 24px; background: #0d1117; color: #d5dae2; font: 14px/1.5 ui-monospace, "SF Mono", Menlo, Consolas, monospace; }
    h1, h2 { font-size: 15px; font-weight: 600; margin: 0 0 12px; color: #f0f3f7; }
    a { color: #6cb6ff; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 24px; }
    .card { background: #161b22; border: 1px solid #263041; border-radius: 10px; padding: 12px 14px; }
    .card b { display: block; font-size: 24px; color: #f0f3f7; }
    .card span { color: #8b96a7; font-size: 12px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
    @media (max-width: 800px) { .grid { grid-template-columns: 1fr; } }
    .panel { background: #161b22; border: 1px solid #263041; border-radius: 10px; padding: 14px; }
    .bar { display: flex; justify-content: space-between; gap: 8px; padding: 3px 0; border-bottom: 1px dashed #222b38; font-size: 12px; }
    .bar:last-child { border-bottom: 0; }
    form { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
    input, select, button { background: #0d1117; color: #d5dae2; border: 1px solid #303a4a; border-radius: 6px; padding: 6px 8px; font: inherit; }
    button { cursor: pointer; background: #1f6feb; border-color: #1f6feb; color: #fff; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #222b38; vertical-align: top; }
    th { color: #8b96a7; font-weight: 500; position: sticky; top: 0; background: #161b22; }
    tbody tr:hover { background: #131922; }
    .muted { color: #8b96a7; }
    .meter { height: 6px; background: #1c2430; border-radius: 3px; overflow: hidden; margin: 4px 0 8px; }
    .meter i { display: block; height: 100%; background: linear-gradient(90deg, #1f6feb, #58a6ff); }
    .tag { display: inline-block; background: #1c2430; border-radius: 4px; padding: 0 6px; font-size: 11px; }
    details summary { cursor: pointer; color: #6cb6ff; font-size: 11px; }
    pre { white-space: pre-wrap; word-break: break-word; background: #0d1117; border: 1px solid #222b38; border-radius: 6px; padding: 8px; margin: 6px 0 0; max-height: 320px; overflow: auto; font-size: 11px; }
    .pager { display: flex; gap: 12px; margin-top: 12px; align-items: center; }
    td.wrap { max-width: 420px; }
</style>
</head>
<body>
<h1>Monitor de acessos</h1>

<div class="cards">
<?php foreach ($stats as $label => $value): ?>
    <div class="card"><b><?= e(number_format($value, 0, ',', '.')) ?></b><span><?= e($label) ?></span></div>
<?php endforeach; ?>
</div>

<div class="grid">
    <div class="panel">
        <h2>Eventos mais frequentes</h2>
        <?php foreach ($topEvents as $row): ?>
            <div class="bar"><a href="<?= e($query(['name' => $row['name'], 'page' => 1])) ?>"><?= e($row['name']) ?></a><span class="muted"><?= e($row['total']) ?></span></div>
        <?php endforeach; ?>
    </div>
    <div class="panel">
        <h2>Seções mais vistas</h2>
        <?php if ($topSections === []): ?><p class="muted">Sem dados ainda.</p><?php endif; ?>
        <?php foreach ($topSections as $row): ?>
            <div class="bar"><span><?= e($row['section'] ?? '—') ?></span><span class="muted"><?= e($row['total']) ?></span></div>
        <?php endforeach; ?>
    </div>
</div>

<div class="grid" style="grid-template-columns: 1.4fr 1fr;">
    <div class="panel">
        <h2>Funil de conversão (visitantes únicos)</h2>
        <?php foreach ($funnel as $index => [$label, $value]): $pct = round(($value / $funnelTop) * 100); $drop = $index > 0 ? $funnel[$index - 1][1] - $value : 0; ?>
            <div class="bar">
                <span><?= e($label) ?></span>
                <span class="muted"><?= e($value) ?> · <?= e($pct) ?>%<?php if ($drop > 0): ?> <span style="color:#f0883e">(-<?= e($drop) ?>)</span><?php endif; ?></span>
            </div>
            <div class="meter"><i style="width: <?= e($pct) ?>%"></i></div>
        <?php endforeach; ?>
    </div>
    <div class="panel">
        <h2>Origem</h2>
        <?php if ($bySource === []): ?><p class="muted">Sem dados.</p><?php endif; ?>
        <?php foreach ($bySource as $row): ?>
            <div class="bar"><span><?= e($row['source'] ?? '(direto)') ?></span><span class="muted"><?= e($row['visitors']) ?> visitantes</span></div>
        <?php endforeach; ?>
        <h2 style="margin-top:16px">Dispositivo</h2>
        <?php foreach ($byDevice as $row): ?>
            <div class="bar"><span><?= e($row['device']) ?></span><span class="muted"><?= e($row['visitors']) ?> visitantes</span></div>
        <?php endforeach; ?>
    </div>
</div>

<div class="grid">
    <div class="panel">
        <h2>CTAs mais clicados</h2>
        <?php if ($topCtas === []): ?><p class="muted">Sem dados.</p><?php endif; ?>
        <?php foreach ($topCtas as $row): ?>
            <div class="bar"><span><?= e($row['cta'] ?? '—') ?></span><span class="muted"><?= e($row['clicks']) ?> cliques · <?= e($row['visitors']) ?> visitantes</span></div>
        <?php endforeach; ?>
    </div>
    <div class="panel">
        <h2>Kit aberto no checkout</h2>
        <?php if ($byKit === []): ?><p class="muted">Sem dados.</p><?php endif; ?>
        <?php foreach ($byKit as $row): ?>
            <div class="bar"><span><?= e($row['kit'] ?? '—') ?></span><span class="muted"><?= e($row['visitors']) ?> visitantes</span></div>
        <?php endforeach; ?>
    </div>
</div>

<div class="panel">
    <h2>Eventos</h2>
    <form method="get" action="">
        <select name="name" aria-label="Evento">
            <option value="">Todos os eventos</option>
            <?php foreach ($topEvents as $row): ?>
                <option value="<?= e($row['name']) ?>"<?= $row['name'] === $name ? ' selected' : '' ?>><?= e($row['name']) ?></option>
            <?php endforeach; ?>
        </select>
        <input name="visitor" value="<?= e($visitor) ?>" placeholder="visitante (id)" size="30">
        <button type="submit">Filtrar</button>
        <?php if ($name !== '' || $visitor !== ''): ?><a href="?" style="align-self:center">limpar</a><?php endif; ?>
        <span class="muted" style="align-self:center"><?= e($total) ?> eventos</span>
    </form>

    <table>
        <thead>
            <tr>
                <th>Hora (UTC)</th>
                <th>Evento</th>
                <th>Visitante</th>
                <th>Path</th>
                <th>IP</th>
                <th>Dados</th>
            </tr>
        </thead>
        <tbody>
        <?php foreach ($events as $row): $props = json_decode($row['props'], true); ?>
            <tr>
                <td class="muted"><?= e(substr((string) $row['received_at'], 11, 8)) ?></td>
                <td><span class="tag"><?= e($row['name']) ?></span></td>
                <td><a href="<?= e($query(['visitor' => $row['visitor'], 'page' => 1])) ?>" title="<?= e($row['visitor']) ?>"><?= e(substr((string) $row['visitor'], 0, 8)) ?></a></td>
                <td class="wrap"><?= e($row['path']) ?></td>
                <td class="muted"><?= e($row['ip']) ?><?= $row['country'] ? ' ' . e($row['country']) : '' ?></td>
                <td>
                    <details>
                        <summary>ver</summary>
                        <pre><?= e(json_encode($props, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: '{}') ?></pre>
                        <pre>UA: <?= e($row['ua']) ?><?= $row['referrer'] ? "\nReferrer: " . e($row['referrer']) : '' ?><?= $row['session'] ? "\nSessão: " . e($row['session']) : '' ?></pre>
                    </details>
                </td>
            </tr>
        <?php endforeach; ?>
        <?php if ($events === []): ?>
            <tr><td colspan="6" class="muted">Nenhum evento.</td></tr>
        <?php endif; ?>
        </tbody>
    </table>

    <?php if ($pages > 1): ?>
        <div class="pager">
            <?php if ($page > 1): ?><a href="<?= e($query(['page' => $page - 1])) ?>">← anterior</a><?php endif; ?>
            <span class="muted">página <?= e($page) ?> de <?= e($pages) ?></span>
            <?php if ($page < $pages): ?><a href="<?= e($query(['page' => $page + 1])) ?>">próxima →</a><?php endif; ?>
        </div>
    <?php endif; ?>
</div>
</body>
</html>
