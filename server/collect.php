<?php
declare(strict_types=1);

ini_set('display_errors', '0');
require __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

if ($CONFIG['allowed_origin'] !== '') {
    header('Access-Control-Allow-Origin: ' . $CONFIG['allowed_origin']);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

function ct_fail(int $status, string $error): never
{
    http_response_code($status);
    echo json_encode(['ok' => false, 'error' => $error]);
    exit;
}

function ct_id(mixed $value): ?string
{
    return is_string($value) && preg_match('/^[A-Za-z0-9-]{8,64}$/', $value) === 1 ? $value : null;
}

$method = $_SERVER['REQUEST_METHOD'] ?? '';
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($method !== 'POST') {
    ct_fail(405, 'method_not_allowed');
}

$raw = file_get_contents('php://input', false, null, 0, $CONFIG['max_body_bytes'] + 1);
if ($raw === false || strlen($raw) > $CONFIG['max_body_bytes']) {
    ct_fail(413, 'payload_too_large');
}

$payload = json_decode($raw, true);
if (!is_array($payload) || !isset($payload['events']) || !is_array($payload['events'])) {
    ct_fail(400, 'invalid_payload');
}

$events = array_values($payload['events']);
if ($events === [] || count($events) > $CONFIG['max_events']) {
    ct_fail(400, 'invalid_event_count');
}

$ip = filter_var($_SERVER['REMOTE_ADDR'] ?? '', FILTER_VALIDATE_IP) ?: null;
$country = strtoupper((string) ($_SERVER['HTTP_CF_IPCOUNTRY'] ?? ''));
$country = preg_match('/^[A-Z]{2}$/', $country) === 1 ? $country : null;
$userAgent = substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 400);
$referrer = substr((string) ($_SERVER['HTTP_REFERER'] ?? ''), 0, 500);
$now = gmdate('Y-m-d\TH:i:s\Z');

$db = ct_db();

if ($ip !== null) {
    $since = gmdate('Y-m-d\TH:i:s\Z', time() - 60);
    $recent = ct_count($db, 'SELECT COUNT(*) FROM events WHERE ip = ? AND received_at >= ?', [$ip, $since]);
    if ($recent >= $CONFIG['rate_per_minute']) {
        ct_fail(429, 'rate_limited');
    }
}

$insert = $db->prepare(
    'INSERT OR IGNORE INTO events (event_id, name, ts, received_at, visitor, session, path, ip, country, ua, referrer, props)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
);

$stored = 0;
$skipped = 0;
$db->beginTransaction();
foreach ($events as $event) {
    $name = is_array($event) && is_string($event['name'] ?? null) ? $event['name'] : '';
    $eventId = is_array($event) ? ct_id($event['id'] ?? null) : null;
    if (preg_match('/^[a-z][a-z0-9_]{0,39}$/', $name) !== 1 || $eventId === null) {
        $skipped++;
        continue;
    }

    $props = $event['props'] ?? [];
    if (!is_array($props)) {
        $props = [];
    }
    $propsJson = json_encode($props, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($propsJson === false || strlen($propsJson) > $CONFIG['max_props_bytes']) {
        $skipped++;
        continue;
    }

    $timestamp = is_string($event['ts'] ?? null) && strtotime($event['ts']) !== false
        ? gmdate('Y-m-d\TH:i:s\Z', (int) strtotime($event['ts']))
        : $now;
    $path = is_string($event['path'] ?? null) ? substr($event['path'], 0, 512) : null;

    $insert->execute([
        $eventId,
        $name,
        $timestamp,
        $now,
        ct_id($event['visitor'] ?? null),
        ct_id($event['session'] ?? null),
        $path,
        $ip,
        $country,
        $userAgent,
        $referrer,
        $propsJson,
    ]);
    $stored += $insert->rowCount();
}
$db->commit();

echo json_encode(['ok' => true, 'stored' => $stored, 'skipped' => $skipped]);
