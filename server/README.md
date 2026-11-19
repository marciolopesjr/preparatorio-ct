# Monitor de acessos (PHP + SQLite)

Backend do coletor em `src/lib/tracker.ts`. Dois arquivos públicos:

- `collect.php` — recebe lotes de eventos (POST JSON).
- `admin.php` — painel de leitura (HTTP Basic Auth).

## Rodar local

```bash
# 1. senha do painel (guarde o hash, não a senha)
export CT_ADMIN_HASH="$(php -r 'echo password_hash("troque-esta-senha", PASSWORD_DEFAULT);')"

# 2. servidor PHP
php -S 127.0.0.1:8090 -t server

# 3. frontend (o Vite faz proxy de /collect.php para a porta 8090)
npm run dev
```

Painel: <http://127.0.0.1:8090/admin.php> (usuário padrão `admin`).

## Produção

1. Só `collect.php` e `admin.php` precisam ser públicos. **Mova o SQLite para fora do webroot**:
   `CT_DB=/var/lib/ct-monitor/events.sqlite`.
2. Sirva sempre em HTTPS — Basic Auth sem TLS expõe a senha.
3. Se o site for estático em outro domínio, defina `CT_ALLOWED_ORIGIN` com a origem exata:
   `CT_ALLOWED_ORIGIN=https://seusite.com` e gere o build com
   `VITE_COLLECT_URL=https://api.seusite.com/collect.php npm run build`.
4. Faça backup do `.sqlite` (e dos `-wal`/`-shm`) ou rode `sqlite3 events.sqlite '.backup ...'`.

## Variáveis

| Variável | Padrão | Para quê |
|---|---|---|
| `CT_DB` | `./data/events.sqlite` | caminho do banco |
| `CT_ADMIN_USER` | `admin` | usuário do painel |
| `CT_ADMIN_HASH` | — (obrigatório) | saída de `password_hash()` |
| `CT_ALLOWED_ORIGIN` | vazio | libera CORS para o domínio do site |
| `CT_RATE` | — | veja `config.php` (`rate_per_minute`) |

## Funil

Eventos de conversão emitidos pelo frontend (usados no painel):

| Evento | Origem |
|---|---|
| `cta_click` | qualquer elemento com `data-track="nome"` |
| `pix_modal_open` | modal de checkout aberto (kit + preço) |
| `pix_copy` | copiou o código EMV ou a chave |
| `kit_switch` | trocou Básico ↔ Premium no modal |
| `whatsapp_click` | avançou para o passo do comprovante |

Para instrumentar um CTA novo, basta adicionar `data-track="nome-do-cta"` no `<button>`/`<a>`.

## Segurança aplicada

- PDO com prepared statements; `INSERT OR IGNORE` deduplica por `event_id`.
- Corpo limitado a 256 KB, máx. 50 eventos por lote, campos validados por regex.
- `props` limitado a 8 KB e sempre decodificado/escapado na exibição (sem XSS).
- Rate limit por IP (600 eventos/min) e índice em `(ip, received_at)`.
- Painel com Basic Auth (`password_verify`), painel falha fechado sem hash, CSP restritiva, `no-store`.
- Login padrão `admin` — troque via `CT_ADMIN_USER`/`CT_ADMIN_HASH`.

## LGPD

Os dados incluem IP, UA, client hints e identificador persistente de visitante. Isso é dado pessoal:
informe no aviso de privacidade, colete base legal/consentimento quando exigido e defina prazo de retenção
(ex.: `DELETE FROM events WHERE received_at < date('now','-90 days')`).

## Limitações conhecidas

- Captura é client-side: adblockers e scripts desativados não são contabilizados.
- Eventos gerados depois do `visibilitychange` (ex.: `exit`) vão no próximo carregamento.
- Sem geolocalização por IP: apenas o país do header `CF-IPCountry` (Cloudflare), se existir.
