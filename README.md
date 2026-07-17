# Shield - Discord Security Bot

Shield is a Discord bot designed to protect your server from spam, scams, and suspicious activity. It combines automatic image scanning, user scam reporting, AutoMod integration, and flexible per-guild moderation settings.

## Features

- **Automatic Image Scanning**: Detects messages containing only images (no text) and takes action based on configurable thresholds
- **Configurable Thresholds**: Set an exact image count or a "greater than" threshold to trigger the scanner
- **Auto-Timeout**: Automatically times out users who trigger the image scanner
- **Role Exclusions**: Exclude trusted roles from image scanning
- **User Scam Reporting**: Trusted users reply to a scam message with `!scam` to report it; moderators receive an alert with action buttons
- **Scam Report Rate Limiting**: Per-guild cooldown, per-user cooldown, and a per-user hourly cap on `!scam` reports, with immune roles that bypass all three
- **Scam Report Action Roles**: Grant roles the ability to delete, timeout, or ban via reports, in addition to the equivalent native Discord permission
- **AutoMod Tracking**: Monitors Discord AutoMod notification channels and forwards alerts to your log channel with moderation buttons
- **Full History Check**: `%check` runs a full channel-history scan against Global Rules only (admin only, global cooldown, admin-chosen window) — results post to the Scam Alert channel with a completion summary
- **Channel Access Overview**: `%checkchannels` maps every visible channel/thread in hierarchy order, showing Read History / Send Messages / Manage Messages access for each
- **Role Hierarchy Check**: `%checkroles` reports which roles ohShield can't kick/ban/timeout and what share of the server's members that covers
- **Global Rules**: Always-on, cross-server detection for username impersonation, obfuscated scam links, fake job postings, and mention abuse — no per-guild setup required, enabled by default
- **Security Logging**: Logs all security actions to a configurable log channel
- **Test Mode**: Run without executing real moderation actions (bans, timeouts, deletions) — detection, alerts, and logging work as normal
- **Image Storage**: Optionally re-upload scam images to a private channel for evidence retention
- **Telegram Alerts**: Optionally forward security alerts to a linked Telegram chat, in addition to (or instead of) a Discord log channel
- **Editor Roles**: Grant non-Administrator roles permission to change bot settings, without handing out full Administrator
- **Owner Alerts**: Optionally forward confirmed scam-report bans and Global Rules false-positive flags to the bot operator's own Discord channels, for cross-server detection-accuracy tracking — see [Owner Alerts](#owner-alerts)
- **Security Dashboard**: Optional moderator-facing web dashboard (Discord OAuth login) for a per-server security overview, logs, and rules — see [Security Dashboard](#security-dashboard)

## Setup

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/noname9006/Shield.git
   cd Shield
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

3. Start the bot:
   ```bash
   npm start
   ```

## Bot Permissions

The bot requires the following Discord permissions:

- `Ban Members`
- `Kick Members` *(required for Global Rules username impersonation detection)*
- `Moderate Members` *(timeout, required for the image scanner, Global Rules, and the scam-report Timeout action)*
- `Manage Messages`
- `Read Message History`
- `Send Messages`
- `Embed Links`
- `Manage Auto Moderation` *(required for the Security Dashboard's AutoMod rule count)*
- `Manage Channels` *(optional — enables private/admin-only channel detection in `%checkchannels`)*

## Commands

The default command prefix is `%` (configurable). User reports use `!scam` or `%scam`.

### Admin Commands

| Command | Description |
|---|---|
| `%oh` | Show current settings |
| `%set log #channel` | Set the log channel for security events |
| `%set automod #channel` | Set the channel where AutoMod posts its notifications |
| `%set scam @role` | Whitelist a role to use the `!scam` command |
| `%set scam remove @role` | Remove a role from the scam-report whitelist |
| `%set scam #channel` | Set the channel for scam alert notifications |
| `%setbotalerts #channel` | Set the channel where `%scan` / `/scan` findings are posted |
| `%setreport` | Show scam-report cooldowns/limits and action roles |
| `%setreport guildcooldown \| usercooldown <seconds\|off>` | Set the per-guild / per-user cooldown between reports |
| `%setreport hourlylimit <count\|off>` | Set the max reports a user can file per hour |
| `%setreport timeout <duration>` | Set the duration applied by the Timeout report action |
| `%setreport immune @role` | Add a role that bypasses all report cooldowns/limits |
| `%setreport deleterole \| timeoutrole \| banrole @role` | Grant a role delete/timeout/ban via reports |
| `%check [duration]` | Full channel-history scan against Global Rules only (global cooldown; window e.g. `30m`/`2h`/`7d`, default & max via `CHECK_MAX_DEPTH_DAYS`) |
| `%scan` | Scan message history for messages matching the current scam-detection rules (24h cooldown) |
| `%checkchannels` | List every visible channel/thread in hierarchy order with its Read History / Send Messages / Manage Messages access |
| `%checkroles` | List roles ohShield cannot kick/ban/timeout and what share of members that covers |

### Image Scanner Commands

| Command | Description |
|---|---|
| `%set image threshold <n>` | Trigger on exactly *n* images |
| `%set image threshold >n` | Trigger on more than *n* images |
| `%set image timeout <duration>` | Set the timeout duration (e.g. `1h`, `30m`, `1d`) |
| `%set image excluderole @role` | Add or remove a role from image scan exclusions |
| `%set image excluderole remove @role` | Remove a role from image scan exclusions |

### User Commands

| Command | Description |
|---|---|
| `!scam` or `%scam` *(reply to a message)* | Report the replied-to message as a scam (available to all users unless roles are whitelisted) |

## Scam Report Flow

1. A trusted user replies to the scam message with `!scam`.
2. The bot verifies the reporter has a whitelisted role.
3. The report is checked against the rate limits in `%setreport` (per-user cooldown, per-user hourly limit, per-guild cooldown, in that order) — unless the reporter holds an immune role or Administrator. A blocked report gets a reply explaining which limit applies and is not processed further.
4. If the reporter has `Ban Members` permission (or a role granted with `%setreport banrole`), the user is immediately banned.
5. Otherwise, if the reporter has `Moderate Members` permission (or a role granted with `%setreport timeoutrole`), the user is immediately timed out (skipped if the user was banned above — banning already removes them).
6. The bot posts a detailed alert embed to the scam alerts channel with the following action buttons:
   - **Delete Msg** — delete the scam message
   - **Delete & Ban** — delete the message and ban the user in one action
   - **Ban** / **Revoke Ban** — ban or unban the user
   - **Timeout** / **Remove Timeout** — timeout or remove timeout from the user (hidden once banned)
   - **Ignore** — mark the alert as ignored and remove action buttons
   - **Delete Msgs (24h)** — delete the user's messages from the last 24 hours

Each button is gated by the equivalent native Discord permission (`Manage Messages`, `Moderate Members`, `Ban Members`) **or** a role granted via `%setreport deleterole|timeoutrole|banrole` — so a server can let non-admin roles moderate through reports without handing out the underlying Discord permission server-wide.

All moderation actions are logged with timestamps and the moderator's name.

## Global Rules

Global Rules is a fixed, always-on detection layer that runs in every server the bot joins — no per-guild setup required. Unlike AutoMod (which each admin configures by hand), the rule set itself is shared across every server and only adjustable via the [Admin Console](#admin-console) (or a code deploy); server admins can only toggle it on/off and set the timeout duration.

It watches for four recurring scam patterns:

1. **Username impersonation** — nicknames spoofing the "MEE6" bot or "Announcement" using Cyrillic/Greek look-alike letters. Triggers on join or nickname change → the member is **kicked**.
2. **Scam links** — obfuscated URI-scheme/domain fragments and hidden-link markdown (e.g. spaced-out `h t t p` inside `<...>`) designed to evade normal link filters.
3. **Fake job postings** — recruitment-spam messages listing 3+ fake roles (Beta tester, Community Manager, Developer, Advertiser, Moderator) on separate lines.
4. **Mention abuse** — messages containing literal `@everyone`/`@here` text sent by a member whose roles/channel permissions don't actually grant the Mention Everyone permission.

For categories 2–4, the message is deleted and the author is timed out (default 1 hour, configurable). All four categories send an alert to the configured **Scam Alert Channel** (`%set scam #channel`).

Configure with `%globalrules`:

| Command | Description |
|---|---|
| `%globalrules` | Show current status |
| `%globalrules on` / `off` | Enable or disable Global Rules for this server |
| `%globalrules timeout <duration>` | Set the timeout duration (e.g. `30m`, `2h`, `1d`) |

**Note:** username-impersonation detection relies on the `guildMemberAdd`/`guildMemberUpdate` events, which require the privileged **Server Members Intent** to be enabled for the bot application in the Discord Developer Portal (the bot already requests the `GuildMembers` gateway intent in code).

## Admin Console

An optional, authenticated web console for editing the Global Rules patterns themselves (not just the per-guild on/off toggle) at runtime, with no code deploy or restart. Disabled by default.

**Setup:** set `ADMIN_API_KEY` in `.env` to a long random string, then start the bot. It listens at `http://<ADMIN_HOST>:<ADMIN_PORT>/admin` (defaults: `127.0.0.1:5055`, i.e. localhost-only — widen `ADMIN_HOST` only if you're fronting it yourself with TLS and IP allowlisting).

**Auth:** a single static API key, sent as `Authorization: Bearer <key>` — no per-user login. Pasting the key into the console's own page (stored in browser `localStorage`) is all that's needed; the API itself throttles repeated bad keys (429 after 20 failed attempts per IP per 15 minutes). Because there's no per-user identity, every create/update/delete is written to an audit log (visible in the console's **Audit log** tab) recording the client IP and the before/after value, for forensic visibility.

**Safety:** new or edited regex rules are stress-tested against a few adversarial strings before being saved and rejected if they look like they'd cause catastrophic backtracking (the same class of bug that once froze the event loop on a crafted message — see the comments in `src/modules/globalRules/patterns.js`). This is a heuristic, not a guarantee — keep the API key private regardless.

**Scope:** covers username-impersonation rules, scam-link substrings/regexes, scam phrases, and the fake-job regex. Mention-abuse detection (`@everyone`/`@here`) is not editable here — it's tied to a permission check, not a pattern list.

**Check Status tab:** lists every server's most recent [`%check`](#check-mode) result (messages scanned, matches found, when) and its cooldown status, with a button to clear a server's cooldown early. View + reset only — a check itself can only be triggered per-server via `%check` / `/check`, not remotely from here.

## Security Dashboard

An optional, moderator-facing web dashboard — a per-server security overview, activity log, rules status, image scan info, scam reports, AutoMod, and verification settings — running inside the same bot process as the Admin Console and game2048 verification server. Disabled by default.

**Setup:** set `DASHBOARD_ENABLED=1` in `.env` (requires `CLIENT_ID`/`DISCORD_CLIENT_SECRET` already set for OAuth). It listens on `DASHBOARD_PORT` (default `5056`) and is meant to be reached over the public internet at `DASHBOARD_PUBLIC_URL` — put a reverse proxy + TLS in front of it in production, and register a redirect URI in the Discord Developer Portal matching `DASHBOARD_OAUTH_REDIRECT_URI` (or `DASHBOARD_PUBLIC_URL` + `/auth/callback`), distinct from game2048's own redirect URI since the dashboard additionally requests the `guilds` OAuth scope.

**Auth:** moderators log in with Discord OAuth (`identify guilds` scope). The guild switcher only lists servers where the bot is present and the logged-in user is the server owner, has Administrator, or holds a role granted via `%seteditorroles` — the same check every settings command already enforces. Sessions are a signed, stateless cookie (not stored server-side), expiring after 24 hours.

## Owner Alerts

Optional, operator-only forwarding of two specific events to Discord channels the bot operator (not any individual server) controls — separate from every per-guild channel above. Both are env-driven and off unless configured; see `CONFIRMED_REPORTS_CHANNEL_ID` / `FALSE_POSITIVE_CHANNEL_ID` in [Environment Variables](#environment-variables). Neither requires `OPERATOR_SERVER_ID` ([Image Storage](#image-storage) below) — a bot can send to any channel it has access to by ID alone — but in practice you'll likely put these channels in that same operator server.

- **Confirmed reports** — once a `!scam` report results in a ban (immediate or via the alert's Ban / Delete & Ban buttons), a copy of that exact alert embed — including the reported message's text and the reported user's ID — is forwarded to `CONFIRMED_REPORTS_CHANNEL_ID`, annotated with the source server's name/ID.
- **False positives** — when a moderator clicks **Report False Positive** on a Global Rules detection alert, a summary (category, matched text, flagged user, and the reporting moderator's identity) is forwarded to `FALSE_POSITIVE_CHANNEL_ID`.

Both exist so the operator can track detection accuracy across every server running the bot, not just one. This is disclosed to end users in the [Privacy Policy](Privacy_Policy.md#1-information-we-collect); if you fork or self-host ohShield for your own servers, update that disclosure to match whether you enable these.

## Scan Mode

`%scan` / `/scan` is an admin-only, on-demand audit: it checks recent message history across every channel the bot can read against the same Global Rules message patterns (scam links, scam phrases, fake job postings, mention abuse) used for real-time detection.

- **Admin only** — non-admins are silently ignored.
- **24-hour cooldown per server**, enforced from the moment the scan is triggered (not from when it finishes), and persisted across restarts.
- **Depth** (how many days of history to check) is set via the `SCAN_DEPTH_DAYS` environment variable (default: `7`).
- Nothing is deleted or banned automatically. Each match is posted to the **Bot Alerts Channel** (`%setbotalerts #channel` / `/setbotalerts` — required; the command refuses to run without one configured) with the same action buttons as a manual `!scam` report (Delete Msg, Delete & Ban, Ban, Ignore) — as if the report had just been filed by the lowest-privilege report role.
- Since a scan can take a while on servers with a lot of history, the admin who ran it gets an immediate reply confirming the scan has started; a summary is posted to the alert channel once it finishes.

## Check Mode

`%check [duration]` / `/check` is an admin-only, on-demand audit — like Scan Mode, but with an admin-chosen history window instead of a fixed one:

- **Admin only** — non-admins get a permission error.
- **Global cooldown**, shared by every server the bot is in (not per-guild), set via `CHECK_COOLDOWN_DAYS` (default: `30` days) — enforced from the moment the check is triggered, and persisted across restarts.
- **Window**: pass a duration (`30m`, `2h`, `7d`, ...) or omit it to use the full allowed window. Capped at `CHECK_MAX_DEPTH_DAYS` (default: `30` days) — a longer request is rejected, not silently clamped.
- Checks only the fixed Global Rules patterns (scam links, scam phrases, fake job postings, mention abuse) — same as Scan Mode, not the guild's own AutoMod rules.
- Nothing is deleted or banned automatically. Each match is posted to the **Scam Alert Channel** with the same action buttons as a manual `!scam` report.
- `/check`'s initial notice is ephemeral (visible only to the admin who ran it); `%check`'s prefix-command notice is posted normally, since Discord has no ephemeral concept for text commands. Both explain that coverage depends on ohShield's actual channel access — see `%checkchannels` / `%checkroles`.
- Once finished, the notice is edited with a summary and a jump link to the results. On a very long scan this edit can occasionally fail after Discord's ~15-minute interaction window expires — the results are already posted to the Scam Alert Channel either way.

## Server Overview Commands

Two read-only diagnostic commands (admin only) for auditing the bot's own access:

- **`%checkchannels`** — lists every channel/category/thread the bot can see, in the server's actual display order, with a ✅/❌ badge per channel for Read History / Send Messages / Manage Messages. If the bot has `Manage Channels`, private channels are marked 🔐 and admin-only channels 🔐🔰.
- **`%checkroles`** — shows ohShield's rank in the role hierarchy, which roles it can never kick/ban/timeout (any role at or above its own highest role), and what percentage of members that makes unmoderatable.

`%oh` also shows a condensed **Bot Reach** summary (channels it can operate in, percentage of members it can moderate) pointing to these two commands for the full breakdown.

## Image Storage

When `IMAGE_STORAGE=1` is set in `.env`, the bot re-uploads images from flagged messages to a designated private channel before taking action. This provides an evidence trail even after the original messages are deleted.

Image storage is controlled by the following environment variables. `OPERATOR_SERVER_ID` is shared with [Owner Alerts](#owner-alerts) above — it identifies the bot-operator-controlled server, not just where images go:

| Variable | Description |
|---|---|
| `IMAGE_STORAGE` | Set to `1` to enable, `0` to disable (default: `0`) |
| `OPERATOR_SERVER_ID` | Discord server ID of the bot-operator-controlled server images are stored in |
| `IMAGE_STORAGE_CHANNEL_ID` | Channel ID within that server for storing images |
| `IMAGE_STORAGE_RETENTION_HOURS` | How long (in hours) stored images are kept before deletion (default: `24`) |

## Environment Variables

| Variable | Description |
|---|---|
| `DISCORD_TOKEN` | Your Discord bot token |
| `CLIENT_ID` | Your Discord application's ID (Developer Portal → General Information) — required for slash command registration and OAuth (dashboard/game2048) |
| `GUILD_ID` | Optional — a server ID to register slash commands to instantly for development. Leave unset to register globally (up to ~1 hour to propagate) |
| `TEST_MODE` | Set to `1` to enable test mode — bans, timeouts, and message deletions are skipped (default: `0`) |
| `IMAGE_STORAGE` | Set to `1` to enable image storage (default: `0`) |
| `OPERATOR_SERVER_ID` | Server ID of the bot-operator-controlled server used for image evidence storage (and, typically, Owner Alerts below) |
| `IMAGE_STORAGE_CHANNEL_ID` | Channel ID for image evidence storage |
| `IMAGE_STORAGE_RETENTION_HOURS` | Retention period in hours for stored images (default: `24`) |
| `INFO_COMMAND_COOLDOWN_SECONDS` | Per-user, per-guild cooldown for `%oh`/`/oh` and `%help`/`/help` (default: `10`) |
| `SCAN_DEPTH_DAYS` | How many days of message history `%scan` / `/scan` checks (default: `7`) |
| `CHECK_COOLDOWN_DAYS` | Global cooldown (days) between completed `%check` / `/check` runs, shared by every server (default: `30`) |
| `CHECK_MAX_DEPTH_DAYS` | Maximum history window `%check` / `/check`'s duration argument can request, and the default when none is given (default: `30`) |
| `REPORT_COOLDOWN_GUILD_SECONDS` | Default minimum seconds between any two `!scam` reports in a server, until overridden with `%setreport guildcooldown` (default: `10`) |
| `REPORT_COOLDOWN_USER_SECONDS` | Default minimum seconds between one user's own reports, until overridden with `%setreport usercooldown` (default: `60`) |
| `REPORT_USER_HOURLY_LIMIT` | Default max reports a single user can file per hour, until overridden with `%setreport hourlylimit` (default: `5`) |
| `TELEGRAM_BOT_TOKEN` | Bot token from [@BotFather](https://t.me/BotFather), enabling `%settelegram` to link chats for forwarded security alerts |
| `CONFIRMED_REPORTS_CHANNEL_ID` | See [Owner Alerts](#owner-alerts) — channel ID to receive a copy of a `!scam` report's alert once it results in a ban. Leave unset to disable |
| `FALSE_POSITIVE_CHANNEL_ID` | See [Owner Alerts](#owner-alerts) — channel ID to receive a copy of a Global Rules detection reported as a false positive. Leave unset to disable |
| `WEB_PORT` | Port for the game2048 verification web server (required if any server uses `%setverify enable game2048`) |
| `WEB_PUBLIC_URL` | Public URL for the game2048 verification page (e.g. `https://verify.example.com`) |
| `DISCORD_CLIENT_ID` | Discord application ID for game2048's OAuth login (falls back to `CLIENT_ID` above) |
| `DISCORD_CLIENT_SECRET` | Discord application secret for game2048's (and the dashboard's) OAuth login |
| `OAUTH_REDIRECT_URI` | Override the game2048 OAuth redirect URI (default: `WEB_PUBLIC_URL` + `/auth/callback`) |
| `SESSION_SECRET` | Secret for signing game2048/dashboard session/OAuth-state cookies (falls back to `DISCORD_CLIENT_SECRET`, then an insecure dev default) |
| `VERIFY_IP_LIMIT` | Max distinct Discord accounts that can complete game2048 OAuth login from the same IP within the rolling window (default: `3`; `0` disables) |
| `VERIFY_IP_WINDOW_MINUTES` | Rolling window (minutes) for the `VERIFY_IP_LIMIT` anti-farm throttle (default: `60`) |
| `TRUST_PROXY_HOPS` | Number of reverse-proxy hops in front of the web servers (game2048/dashboard), so Express reads the real client IP from `X-Forwarded-For`. Leave unset/`0` when exposed directly |
| `ADMIN_API_KEY` | Long random string enabling the [Admin Console](#admin-console) at `/admin`. Leave unset to disable it entirely |
| `ADMIN_PORT` | Port the Admin Console listens on (default: `5055`) |
| `ADMIN_HOST` | Host the Admin Console binds to (default: `127.0.0.1` — localhost only) |
| `DASHBOARD_ENABLED` | Set to `1` to enable the [Security Dashboard](#security-dashboard) (default: off) |
| `DASHBOARD_PORT` | Port the Security Dashboard listens on (default: `5056`) |
| `DASHBOARD_PUBLIC_URL` | Public URL moderators open in their browser (e.g. `https://dashboard.example.com`) |
| `DASHBOARD_OAUTH_REDIRECT_URI` | Override the dashboard's OAuth redirect URI (default: `DASHBOARD_PUBLIC_URL` + `/auth/callback`) — needs its own Developer Portal entry, distinct from game2048's |
| `SITE_STATS_ENABLED` | Set to `1` to periodically write server/member-count stats to a static JSON file for the landing page (default: off) |
| `SITE_STATS_PATH` | Path to write `stats.json` to (default: `<repo>/site/stats.json`) |
| `SITE_STATS_INTERVAL_MINUTES` | How often (minutes) to recompute site stats (default: `30`) |
| `SITE_LINKS_PATH` | Path to write the landing page's footer-links `links.json` to (default: `<repo>/site/links.json`). Only takes effect when `SITE_STATS_ENABLED=1` |
| `SITE_DISCORD_URL` / `SITE_TWITTER_URL` / `SITE_EMAIL` / `SITE_GITHUB_URL` | Landing page footer link targets. Unset ones stay out of `links.json` and the page hides that icon. `SITE_EMAIL` needs the `mailto:` scheme (e.g. `mailto:hello@example.com`) — used verbatim as the `href`, not auto-prefixed |
| `NOTIFY_COOLDOWN_MINUTES` | Global cooldown (minutes) between recurring "Security Reminder" notifications (default: `15`) |
| `LOG_LEVEL` | Log verbosity: `trace`, `debug`, `info`, `warn`, `error` (default: `info`) |
| `LOG_RETENTION_DAYS` | How many days of rotated log files to keep on disk (default: `14`) |
| `NODE_ENV` | `development` or `production` — controls log format (default: `production`) |
| `DATABASE_PATH` | Path to the SQLite database file (default: `./data/shield.sqlite`) |
| `DB_ENCRYPTION_KEY` | Encrypts the database file at rest (SQLCipher). Strongly recommended in production; see "Data Storage" below |

## Data Storage

All per-server **settings** (log channel, AutoMod channel, scam roles, image scanner thresholds, notifications, etc.) and **data** (reported messages, scheduled cleanups, notification state) are stored in a local **SQLite** database at `./data/shield.sqlite` (override with `DATABASE_PATH`). Settings are configured via bot commands. SQLite runs in WAL mode, so multiple bot shards on one host can share the database safely.

On first run the bot automatically imports any existing legacy JSON files (`config/settings.json`, `reported_messages.json`, `config/notifications_state.json`, `config/cleanup_queue.json`). Those files are left in place as a backup and can be removed once you've confirmed the import.

### Encryption at Rest

Set `DB_ENCRYPTION_KEY` to a long random string to encrypt `shield.sqlite` at rest via SQLCipher. Back the key up somewhere other than the database file — losing it makes the database unreadable, permanently.

Setting the key only encrypts *newly created* database files. If you already have a plaintext `shield.sqlite` from before this setting existed, re-key it once with the migration below. Run it from the bot's project directory (where `node_modules` and `.env` live), with the bot **stopped**:

```bash
# 1. Add your key to .env first (or edit .env by hand)
echo 'DB_ENCRYPTION_KEY=YOUR_NEW_KEY_HERE' >> .env

# 2. Stop the bot, then run the migration
cat << 'EOF' > migrate-db.js
require('dotenv').config();
const Database = require('better-sqlite3-multiple-ciphers');
const fs = require('fs');

const KEY = process.env.DB_ENCRYPTION_KEY;
if (!KEY) {
  console.error('DB_ENCRYPTION_KEY not found in .env');
  process.exit(1);
}

if (fs.existsSync('./data/shield.encrypted.sqlite')) {
  fs.unlinkSync('./data/shield.encrypted.sqlite');
}

const plainDb = new Database('./data/shield.sqlite');
plainDb.pragma("key=''");

const encryptedDb = new Database('./data/shield.encrypted.sqlite');
encryptedDb.pragma(`key='${KEY}'`);
encryptedDb.pragma("cipher='sqlcipher'");

// Copy every table's schema and rows (skip SQLite's internal sqlite_* tables,
// e.g. sqlite_sequence — those are auto-managed and recreated as needed).
const tables = plainDb.prepare(
  "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
).all();

for (const table of tables) {
  const schema = plainDb.prepare(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name=?"
  ).get(table.name);
  if (!schema || !schema.sql) continue;

  encryptedDb.exec(schema.sql);

  const rows = plainDb.prepare(`SELECT * FROM ${table.name}`).all();
  if (rows.length > 0) {
    const cols = Object.keys(rows[0]);
    const placeholders = cols.map(() => '?').join(',');
    const insertStmt = encryptedDb.prepare(
      `INSERT INTO ${table.name} (${cols.join(',')}) VALUES (${placeholders})`
    );
    for (const row of rows) insertStmt.run(...cols.map((c) => row[c]));
  }
  console.log(`Migrated ${table.name}: ${rows.length} rows`);
}

// Preserve the schema-migration counter (PRAGMA user_version) — without this
// the bot thinks no migrations have run and tries to recreate tables that
// already exist, crashing on startup.
const userVersion = plainDb.pragma('user_version', { simple: true });
encryptedDb.pragma(`user_version = ${userVersion}`);

plainDb.close();
encryptedDb.close();

console.log(`Migration complete! (schema version ${userVersion})`);
EOF
node migrate-db.js
rm migrate-db.js

# 3. Swap the files in
mv ./data/shield.sqlite ./data/shield.sqlite.plaintext.bak
mv ./data/shield.encrypted.sqlite ./data/shield.sqlite
```

Restart the bot and confirm it starts cleanly and reads your settings correctly (e.g. run `%oh` in a server). Once confirmed, delete the backup: `rm ./data/shield.sqlite.plaintext.bak`.

## License

This project is open source and available under the MIT License.
