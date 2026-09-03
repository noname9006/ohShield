<div align="center">

<img src="assets/logo.png" alt="ohShield" width="110">

# ohShield

**Distributed scam protection for Discord.**
A shared rule set you never have to write, gated by a false-positive pipeline that can't be overridden, protecting your server the moment the bot joins.

[![Website](https://img.shields.io/badge/site-ohshield.com-0b0b0f?style=flat-square)](https://ohshield.com/)
[![Dashboard](https://img.shields.io/badge/dashboard-live-4c8bf5?style=flat-square)](https://dashboard.ohshield.com)
[![Discord](https://img.shields.io/badge/discord-join-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/a2CrKgjcSn)
[![Docs](https://img.shields.io/badge/docs-user%20guide-1f883d?style=flat-square)](docs/USER_GUIDE.md)

**[Add ohShield to your server →](https://discord.com/oauth2/authorize?client_id=1428707059922112634&permissions=6756774099119318&integration_type=0&scope=bot%20applications.commands)**

</div>

---

> This repository is the public documentation for ohShield. The bot is offered as a
> hosted service — you add it to your server rather than running it yourself — so the
> source code is not published here. What you'll find instead is the full user guide,
> an honest account of how the detection rules are made and tested, and the legal terms.

## What it is

ohShield is a Discord security bot that catches scams, impersonation, and spam
automatically, across every server it protects at once. A confirmed scam in one
community becomes protection for all of them.

Setup is a guided wizard that runs the moment the bot joins. It creates the channels it
needs, checks its own permissions, asks a handful of questions, and hands you a protected
server — typically in a couple of minutes, with nothing to configure afterwards.
Protection is already running while you answer.

## Why it's different

### Low false positives, by construction

This is the part that matters most, because a filter that bans a real member costs you
more than a scam that slips through.

Every candidate rule is backtested against two corpora before it can exist: confirmed
scams (does it catch anything real?) and known-good conversation (does it break normal
servers?). **A single match against known-good text rejects the rule outright** — not a
warning, not a score to weigh against hit rate. The gate lives in the storage layer, so
every path that creates or edits a rule passes through it. There is no "publish anyway"
button.

When a moderator does flag a detection as a false positive, that text becomes a permanent
regression test. The same mistake cannot ship twice.

See **[How rules are made](docs/HOW_RULES_ARE_MADE.md)** for the full process, the
rejection criteria, and an honest account of what it does *not* promise.

### Curated, not configured

You don't write scam filters. Discord's native AutoMod and most security bots hand you a
regex box and wish you luck — which makes every admin independently responsible for
discovering and maintaining patterns while scammers rotate theirs weekly.

Global Rules are on by default and cover homoglyph impersonation, obfuscated links,
recruitment spam, and mention abuse. New patterns arrive live, with no restart and
nothing for you to update.

### A network, not a bot

Every server on ohShield contributes to the same detection set. Trusted members report a
scam with `!scam`; a moderator's action is what confirms it; confirmed scams feed the
shared rule set rather than sitting in one server's log.

The more servers on the network, the faster a new campaign gets caught for everyone —
including the servers that never saw it.

### It acts, so nobody has to watch

Detection to action is one step with no human in it: the message is deleted, the
category's configured penalty (timeout, kick, or ban) is applied, and the alert is then
posted for review with buttons to reverse it. You are not paying moderators to stare at a
monitor at 3am so a scam gets caught within a minute of being posted.

### The interface is where you already are

Every alert is a Discord embed with the actions on it — ban, timeout, kick, delete, delete
the user's last 7 days of messages, dismiss, or flag a false positive — so moderating
means clicking a button in the channel you're already in, not learning a command syntax.
Roles can be granted individual report actions without handing out the underlying Discord
permission server-wide.

For everything else there's a **[web dashboard](https://dashboard.ohshield.com)** —
Discord OAuth login, per-server overview, logs, and settings.

## Features

- **Guided onboarding wizard** — runs automatically on join; permission and role-hierarchy checks with one-click fixes, re-runnable any time with `%start`
- **Global Rules** — always-on cross-server detection for username impersonation, obfuscated scam links, fake job postings, and mention abuse
- **Domain feed** — synced blocklist of known Discord/Steam phishing domains layered under Global Rules, with per-server suppression instead of deletion
- **Community scam reporting** — `!scam` on any message, with per-guild and per-user cooldowns, hourly caps, and immune roles
- **Report action roles** — grant delete/timeout/kick/ban *through reports only*, without the server-wide Discord permission
- **Image drop detection** — catches uncaptioned image bursts, the standard way a scam payload dodges keyword filters; threshold and timeout are yours to tune, with role exclusions
- **AutoMod integration** — forwards Discord's own AutoMod notifications into your alerts channel for a single audit trail
- **Full history check** — `%check` scans channel history and members against Global Rules over a window you choose
- **Access & hierarchy audits** — `%checkchannels` and `%checkroles` show exactly where the bot is blind or outranked
- **Member verification** — four independent challenge modes, see below
- **Telegram alerts** — forward security alerts to a linked Telegram chat
- **Security reminders** — recurring, activity-gated security tips in the channels you pick
- **Test mode** — full detection, alerts, and logging with no real moderation actions taken
- **Editor roles** — let non-Administrators change settings without granting Administrator

## Verification that costs bot farms real money

An optional join gate with four modes you can stack or run individually: an **emoji**
grid, an image **CAPTCHA** (math, text, or logic), **odd-one-out** (spot the one rotated,
mirrored, or subtly edited glyph in a grid), and **2048**.

2048 is the interesting one. The board lives on the server, not in the page — every move
is validated against an authoritative engine, so a client can't submit a game it never
played. Entry links are one-time and bound to the member who clicked Verify, and each move
carries a short-lived nonce, so a captured request sequence can't be replayed. On top of
that, the server scores *how* the game was played: sustained sub-human pacing, metronomic
timing with implausibly low variance, bursts beyond real key-mashing, and near-perfect
agreement with the engine's own best-move ranking all fail the session. Thresholds were
tuned against real jittered human play, so ordinary players pass.

It isn't unbreakable, and we don't claim it is — a script that deliberately paces itself
like a human for a whole session can get through. What it does is turn a free, instant,
parallelizable signup into a slow, per-account, human-timed one. That's the economics a
bot farm actually runs on.

## Documentation

| | |
|---|---|
| **[User Guide](docs/USER_GUIDE.md)** | Every command, setting, and feature — setup through troubleshooting |
| **[How rules are made](docs/HOW_RULES_ARE_MADE.md)** | The detection pipeline, the false-positive gate, and its limits |
| **[Privacy Policy](Privacy_Policy.md)** | What's collected, why, and for how long |
| **[Terms of Service](Terms_of_Service.md)** | Terms for using the hosted service |

## Links

- Website — [ohshield.com](https://ohshield.com/)
- Dashboard — [dashboard.ohshield.com](https://dashboard.ohshield.com)
- Discord — [discord.gg/a2CrKgjcSn](https://discord.gg/a2CrKgjcSn)
- X — [@ohShieldApp](https://x.com/ohShieldApp)
- Email — [yes@ohshield.com](mailto:yes@ohshield.com)
- Bugs & feedback — [GitHub Issues](https://github.com/noname9006/ohShield/issues)

## License

ohShield is proprietary software. © 2026 Evgenii Kepa. All rights reserved.

The bot is offered as a hosted service; the source code is not published, and no licence
to copy, modify, distribute, reverse-engineer, or create derivative works is granted. The
documentation in this repository is published for users of that service. See the
[Terms of Service](Terms_of_Service.md) for the full terms.
