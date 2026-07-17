# ohShield - User Guide

**ohShield** is a Discord security bot designed to protect your server from spam, scams, and suspicious activity with unmatched accuracy. This guide covers everything a server admin or moderator needs to configure and use ohShield day-to-day.

Looking to install, host, or extend the bot itself? See the [Running Guide](RUNNING_GUIDE.md).

---

## Contents

1. [What is ohShield](#what-is-ohshield)
2. [Why Choose ohShield](#why-choose-ohshield)
3. [Key Features](#key-features)
4. [Configuration](#configuration)
5. [Commands Reference](#commands-reference)
6. [How Each Feature Works](#how-each-feature-works)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

---

## What is ohShield?

**ohShield** is an open-source Discord bot that helps server moderators detect and respond to security threats automatically. It monitors for:

1. Suspicious image-only messages — Detects spam patterns where users post multiple images without context
2. Reported scams — Lets trusted users report suspicious messages, with moderators reviewing and taking action
3. Discord AutoMod activity — Tracks and logs what your AutoMod catches, giving you centralized visibility
4. User verification — Optional verification challenges (emoji, captcha, or 2048 game) for new members

All security actions (bans, timeouts, message deletions) are logged with timestamps and moderator information. ohShield can be configured on a per-server basis without affecting other servers.

---

## Why Choose ohShield?

ohShield stands out from other Discord security bots with these **killing features**:

### Global Rules, Local Enforcement

ohShield learns from the global community while respecting your server's unique needs.

1. Benefit from collective threat intelligence shared across servers
2. Customize every rule for your specific community
3. No one-size-fits-all approach — your moderation, your way

### Detects Scams Other Bots Miss

Most Discord security bots struggle with sophisticated scams. ohShield uses advanced pattern recognition to catch:

1. Image-based scams (links, fake giveaways, phishing attempts disguised as images)
2. Context-aware detection that understands subtle scam indicators other bots can't see
3. Scams that slip through AutoMod and bypass traditional keyword filters
4. Low false positive rate — won't flag legitimate content

### Easy Moderation

Moderation with ohShield is straightforward:

1. One-command setup to configure your entire security policy
2. Smart buttons on alerts for quick action without extra commands
3. Automatic logging with timestamps for every action
4. Role-based management to apply different rules to different user groups

### Exceptionally Low False Positives

ohShield is tuned for accuracy:

1. Won't timeout your trusted users or bots
2. Role exclusions prevent trusted members from being affected
3. Intelligent threshold tuning prevents accidental triggers
4. Every detection is logged for review

---

## Key Features

### Global Rules

Always-on cross-server threat detection for:

1. Username impersonation — Detects suspicious display names attempting to impersonate staff or well-known users
2. Scam links — Identifies known phishing URLs and scam domains
3. Fake job postings — Detects recruitment spam patterns (3+ fake roles in one message)
4. Mention abuse — Catches unauthorized @everyone/@here mentions from users without permission

When triggered: Message is deleted, user is timed out, and alert is logged. Enable per-server with customizable timeout duration.

### Image Scanner

Automatically detects messages containing only images (no text) — a telltale sign of spam and scam attempts. Set a threshold for an exact image count or "greater than" trigger, then choose the timeout duration.

Catches:
1. Spam waves with mass image posts
2. Scam links disguised as images
3. Fake giveaway announcements
4. Phishing attempts with screenshot proofs

### Scam Reporting

Trusted users reply to any message with `!scam` or `%scam` to flag it as a scam, giving your community the power to defend itself. Moderators receive an alert with action buttons:

- Delete the message
- Timeout or ban the user
- Delete messages from the last 24 hours
- Mark as reviewed

If the reporter has `Ban Members` permission, the user is banned immediately; if not (and not banned), a `Moderate Members` reporter gets an immediate timeout instead. Works on content that AutoMod and keyword filters completely miss.

**Rate limiting:** reports are capped by a per-guild cooldown, a per-user cooldown, and a per-user hourly limit (all configurable, see [Scam Report Limits & Roles](#5-scam-report-limits--roles)) — trusted roles can be made immune to all three.

**Action roles:** beyond the native Discord permissions above, admins can grant specific roles the ability to delete, timeout, or ban *via reports only*, without handing out the underlying Discord permission server-wide.

### AutoMod Integration

ohShield monitors your Discord AutoMod notifications channel and forwards all alerts to your log channel.

Provides:
1. Centralized logging of all AutoMod actions
2. Easy access to the flagged content
3. An audit trail for review

### Full History Check

Command `%check [duration]` or `/check` (admin only) runs a full channel-history scan against Global Rules only — like Scan Mode, but with an admin-chosen history window instead of a fixed one. Gated by a global cooldown (shared by every server, default 30 days). Matches are posted to the scam alert channel.

### Scan Mode

Command `%scan` or `/scan` (admin only) checks recent message history across every channel against the same Global Rules patterns used for real-time detection — useful for auditing a server after joining, or after enabling Global Rules for the first time. Matches are posted to the bot alerts channel with the same action buttons as a manual `!scam` report. Limited to once every 24 hours per server.

### Channel Access Overview

Command `%checkchannels` or `/checkchannels` (admin only) lists every channel, category, and thread ohShield can see, in the same order they appear in your server, with a ✅/❌ badge per channel for Read History / Send Messages / Manage Messages. Use it to spot channels where the bot is missing the permissions it needs to protect them.

### Role Hierarchy Check

Command `%checkroles` or `/checkroles` (admin only) shows ohShield's rank in your role hierarchy, lists every role it can never kick/ban/timeout (because that role sits at or above its own), and reports what percentage of your members that makes unmoderatable.

### Security Reminder (Recurring Notifications)

Optional recurring security tip posted to a designated channel at configurable intervals. Helps keep your community aware of security best practices.

Configure:
1. Channel where reminders are posted
2. Check interval (how often to evaluate whether to post, default 120 minutes)
3. Minimum messages threshold (post only after this many user messages since last reminder, default 10)

### User Verification

Optional verification challenges for new members. Enable any combination of:

1. Emoji — Select the correct emoji from a grid (configure: number of rounds)
2. CAPTCHA — Identify distorted text in an image (configure: number of tasks)
3. Game2048 — Play and win at the 2048 game (configure: target score)

Each mode requires a verified role that's granted on successful completion. Optionally, log verification outcomes to a channel, lock out members after too many failed attempts, or auto-kick members who never verify.

### Image Storage (Optional)

When enabled, ohShield re-uploads flagged images to a private channel before taking action. This preserves evidence even after the original message is deleted. Set a retention period (default: 24 hours) and images auto-delete after that time. This is configured by whoever hosts the bot — see the [Running Guide](RUNNING_GUIDE.md#environment-variables).

### Telegram Alerts (Optional)

Link one or more Telegram chats (a moderator's PM or a group) to receive the same security alerts posted to your Discord log/scam-alert/AutoMod channels — useful if your moderators check Telegram more often than Discord. Requires the bot host to set `TELEGRAM_BOT_TOKEN` — see the [Running Guide](RUNNING_GUIDE.md#environment-variables).

### Editor Roles

By default, only Administrators can change ohShield's settings. `%seteditorroles` lets an Administrator grant that same access to specific roles, without handing out full Administrator — useful for trusted moderators. Editor-role members can also use the Security Dashboard (below) for any server they can edit.

### Security Dashboard (Optional)

An optional web dashboard for a per-server security overview, activity log, rules status, and more — log in with Discord to see every server you're an Administrator or editor-role holder in. Disabled by default; enabled and configured by whoever hosts the bot — see the [Running Guide](RUNNING_GUIDE.md#environment-variables).

### Test Mode

Run ohShield without executing real moderation actions. Detection, alerts, and logging all work normally — only bans, timeouts, and deletions are skipped. Perfect for testing your configuration before going live. Toggled by whoever hosts the bot — see the [Running Guide](RUNNING_GUIDE.md#environment-variables).

---

## Configuration

All configuration is done via simple bot commands. The default command prefix is `%` (e.g., `%oh` shows settings). Every setting is per-server, so different servers can have completely different configurations. **Set up basic protection in under 5 minutes:**

### View Current Settings

```
%oh
```

Displays a summary of all configured settings for your server in a formatted embed. This is your control panel — check it after making changes to verify they took effect.

### Quick Start (5 Minutes)

Get ohShield protecting your server in 5 minutes:

```
%set log #security-logs
%set image threshold >2
%set image timeout 1h
%set scam #scam-reports
```

Done! Your server now has protection against image spam and scam reports.

### 1. Configure Log Channel

```
%set log #channel-name
```

**What it does:** All security events (image scanner triggers, scam reports, AutoMod actions, bans, timeouts) are logged here with timestamps.

**Example:**
```
%set log #security-logs
```

**Tip:** Create a private channel (viewable only by moderators) for this to keep security actions confidential.

### 2. Configure AutoMod Notification Channel

```
%set automod #channel-name
```

**What it does:** This is the channel where Discord's native AutoMod posts its notifications. Shield monitors this channel and forwards alerts to your log channel.

**Example:**
```
%set automod #automod-notifications
```

**Note:** You must enable AutoMod in your server's Safety Center first, and it must post notifications to a channel. Then tell Shield where that channel is.

### 3. Configure Scam Alert Channel

```
%set scam #channel-name
```

**What it does:** When users report a scam (using `!scam`), the alert is posted here. Moderators use buttons on the alert to take action.

**Example:**
```
%set scam #scam-reports
```

### 4. Whitelist Roles for Scam Reporting

```
%set scam @role-name
```

**What it does:** Only users with the specified role can use `!scam`. If no roles are whitelisted, **all users** can report scams. Run this command multiple times to whitelist multiple roles.

**Example:**
```
%set scam @Trusted Users
%set scam @Moderators
```

**To remove a role from the whitelist:**
```
%set scam remove @role-name
```

### 5. Scam Report Limits & Roles

```
%setreport
```

Shows current cooldowns, hourly limit, immune roles, and action roles.

**Cooldowns & hourly limit:**
```
%setreport guildcooldown <seconds|off>
%setreport usercooldown <seconds|off>
%setreport hourlylimit <count|off>
```

**What it does:** `guildcooldown` sets the minimum time between *any* two `!scam` reports in the server; `usercooldown` sets the minimum time between one user's own reports; `hourlylimit` caps how many reports a single user can file per hour. Each defaults to a value set by your bot host (`guildcooldown` 10s, `usercooldown` 60s, `hourlylimit` 5/hour) until you override it here. Use `0` or `off` to disable a limit entirely.

**Example:**
```
%setreport usercooldown 30
%setreport hourlylimit 10
```

**Immune roles** (bypass all three limits above):
```
%setreport immune @role-name
%setreport immune remove @role-name
```

Administrators are always immune, even with no roles configured.

**Action roles** (let a role delete/timeout/ban *through reports* without granting the underlying Discord permission server-wide):
```
%setreport deleterole @role-name
%setreport timeoutrole @role-name
%setreport banrole @role-name
```

Each accepts `remove` the same way, e.g. `%setreport banrole remove @role-name`. A role with `banrole` can immediately ban a reported user (if they file the report) and can click Ban/Delete & Ban on any alert; `timeoutrole` and `deleterole` work the same way for the Timeout and Delete actions.

**Timeout action duration:**
```
%setreport timeout <duration>
```

Sets how long the Timeout report action (auto-applied, or via the alert's Timeout button) times a user out for. Supports the same `30m`/`2h`/`1d` format as image scanner and Global Rules timeouts (default: 1 hour, max: 28 days).

**Configuration Checklist:**
- [ ] (Optional) `%setreport guildcooldown|usercooldown|hourlylimit` — adjust rate limits from the defaults
- [ ] (Optional) `%setreport immune @role` — exempt trusted roles from rate limits
- [ ] (Optional) `%setreport deleterole|timeoutrole|banrole @role` — let non-admin roles moderate via reports

### 6. Image Scanner Configuration

#### Set Image Threshold

```
%set image threshold <number>
```

Trigger the scanner when a message has exactly `<number>` images:
```
%set image threshold 3
```

Or trigger when a message has **more than** `<number>` images:
```
%set image threshold >2
```

This example triggers on 3 or more images.

#### Set Timeout Duration

```
%set image timeout <duration>
```

Specify how long users are timed out when they trigger the image scanner. Supports formats:
- `30m` = 30 minutes
- `1h` = 1 hour
- `1d` = 1 day
- `7d` = 7 days

**Example:**
```
%set image timeout 1h
```

**Note:** Discord's maximum timeout is 28 days. If a user is already timed out, Shield won't increase the duration.

#### Exclude Roles from Image Scanning

```
%set image excluderole @role-name
```

Users with the specified role will **not** trigger the image scanner, even if they post the threshold number of images. Run multiple times to exclude multiple roles.

**Example:**
```
%set image excluderole @Trusted
%set image excluderole @Bots
```

**To remove a role from exclusions:**
```
%set image excluderole remove @role-name
```

### 7. Global Rules Configuration

```
%globalrules
```

Shows current status and usage. Configure:

```
%globalrules on
%globalrules off
%globalrules timeout <duration>
```

**What it does:** Enable or disable global rules, and set the timeout duration for detected violations (default 1 hour). The detection rules themselves are managed centrally across every server (not per-server configurable) — only Administrators can toggle Global Rules on/off or change the timeout; this can't be delegated to other roles.

**Example:**
```
%globalrules on
%globalrules timeout 1h
```

**Configuration Checklist:**
- [ ] `%globalrules on` — Enable the feature
- [ ] (Optional) `%globalrules timeout <duration>` — Set timeout (e.g., `1h`, `30m`)
- [ ] `%set log #channel` — Configure the log channel

### 8. Security Reminder Configuration

```
%setnotify on #channel
```

**What it does:** Enables recurring security reminder notifications posted to the specified channel. The channel is required when turning notifications on.

Additional options:

```
%setnotify interval <minutes>
%setnotify minmessages <count>
%setnotify off
```

Configure how often to check whether to post (interval, default 120 minutes) and how many user messages must occur before reposting (default 10).

**Example:**
```
%setnotify on #announcements
%setnotify interval 180
%setnotify minmessages 50
```

**Configuration Checklist:**
- [ ] `%setnotify on #channel` — Enable and set the notification channel
- [ ] (Optional) `%setnotify interval <minutes>` — Adjust check frequency
- [ ] (Optional) `%setnotify minmessages <count>` — Adjust posting threshold

### 9. Verification Configuration

```
%setverify
```

Shows current verification status and available commands.

Enable/disable modes (multiple modes can be active at once) and configure settings:

```
%setverify enable <emoji|captcha|game2048>
%setverify disable <emoji|captcha|game2048>
%setverify role @role-name
%setverify channel #channel-name
%setverify rounds <n>          (emoji mode)
%setverify tasks <n>           (captcha mode)
%setverify threshold <n>       (game2048 mode)
%setverify logchannel #channel (where verification results get posted)
%setverify retries <n>         (failed attempts before lockout)
%setverify cooldown <minutes>  (lockout duration)
%setverify kickafter <hours>|off (auto-kick members who never verify)
%setverify panel               (post the Verify button)
%setverify off                 (disable all modes)
```

**Example:**
```
%setverify enable emoji
%setverify role @Verified
%setverify channel #verification
%setverify rounds 5
%setverify panel
```

Available modes (enable any combination):
- `emoji` — Select correct emoji from grid (requires rounds parameter)
- `captcha` — Identify distorted text (requires tasks parameter)
- `game2048` — Play 2048 game (requires threshold parameter)

Use `%setverify off` to disable all modes at once, or `%setverify disable <mode>` to turn off just one.

**Note:** The `game2048` mode requires the bot host to set `WEB_PUBLIC_URL`. See the [Running Guide](RUNNING_GUIDE.md#environment-variables).

---

## Commands Reference

### Admin Commands

| Command | Syntax | Description |
|---------|--------|-------------|
| Show Settings | `%oh` | Display all current settings |
| Set Log Channel | `%set log #channel` | Configure security log channel |
| Set AutoMod Channel | `%set automod #channel` | Configure AutoMod notification channel |
| Set Scam Channel | `%set scam #channel` | Configure scam report channel |
| Whitelist Scam Role | `%set scam @role` | Allow a role to report scams |
| Remove Scam Role | `%set scam remove @role` | Revoke scam reporting from a role |
| Set Bot Alerts Channel | `%setbotalerts #channel` | Configure where `%scan` / `/scan` findings are posted |
| Configure Report Limits | `%setreport` | Show/configure scam-report cooldowns, hourly limit, immune roles |
| Set Report Cooldowns | `%setreport guildcooldown \| usercooldown <seconds\|off>` | Per-guild / per-user cooldown between reports |
| Set Report Hourly Limit | `%setreport hourlylimit <count\|off>` | Max reports a user can file per hour |
| Set Report Timeout Duration | `%setreport timeout <duration>` | Duration applied by the Timeout report action |
| Add Report-Immune Role | `%setreport immune @role` | Exempt a role from all report cooldowns/limits |
| Add Report Action Role | `%setreport deleterole \| timeoutrole \| banrole @role` | Let a role delete/timeout/ban via reports |
| Set Image Threshold | `%set image threshold <n>` | Trigger on exactly `n` images or `>n` for more than `n` |
| Set Image Timeout | `%set image timeout <duration>` | Set timeout duration (e.g., `1h`, `30m`) |
| Exclude Role from Scanner | `%set image excluderole @role` | Prevent a role from triggering the scanner |
| Remove Excluded Role | `%set image excluderole remove @role` | Remove role from scanner exclusions |
| Configure Global Rules | `%globalrules` | Enable/disable and set timeout (Administrator only) |
| Configure Notifications | `%setnotify` | Set channel and interval for security reminders |
| Configure Verification | `%setverify` | Set up member verification challenges |
| Configure Telegram Alerts | `%settelegram` | Link/unlink Telegram chats to receive forwarded security alerts |
| Grant Editor Roles | `%seteditorroles` | Let non-Administrator roles change bot settings and the Security Dashboard (Administrator-only to run, since it delegates that access) |
| Full History Check | `%check [duration]` | Full channel-history scan against Global Rules only (global cooldown, admin-chosen window) |
| Scan Mode | `%scan` | Scan message history for messages matching current scam-detection rules (24h cooldown) |
| Channel Access Overview | `%checkchannels` | List every visible channel/thread with its permission access |
| Role Hierarchy Check | `%checkroles` | List roles ohShield cannot kick/ban/timeout and the affected member percentage |
| Show Help | `%help` | Show available commands |

**Permissions:** Only users with `Administrator` permission, or a role granted via `%seteditorroles`, can run these commands.

### User Commands

| Command | Syntax | Description |
|---------|--------|-------------|
| Report Scam | `!scam` or `%scam` (reply) | Report the replied message as a scam. Only works for whitelisted roles or all users if no roles are whitelisted. Subject to cooldowns/hourly limits unless the reporter is immune (see `%setreport`). |
| Verify | Click **Verify** button | Start the verification challenge in the verification channel |

---

## How Each Feature Works

### Image Scanner

**Trigger:**
1. A user posts a message containing only images (no text)
2. The number of images matches or exceeds the configured threshold
3. The user doesn't have an excluded role

**Action:**
1. User is timed out for the configured duration
2. Event is logged to the log channel with timestamp, user, number of images, and moderator name
3. In test mode, the timeout is skipped, but detection and logging still happen

**Configuration Checklist:**
- [ ] `%set log #channel` — Configure the log channel
- [ ] `%set image threshold <n>` — Set threshold (e.g., `>2` for 3+ images)
- [ ] `%set image timeout <duration>` — Set timeout (e.g., `1h`)
- [ ] (Optional) `%set image excluderole @role` — Exclude trusted roles

### Scam Reporting

**Trigger:**
1. A user replies to any message with `!scam` or `%scam`
2. (Optional) If a role whitelist is configured, the user must have one of those roles
3. The report must pass the rate limits in `%setreport` (per-user cooldown, per-user hourly limit, per-guild cooldown) — skipped entirely for immune roles/Administrators
4. If the reporter has `Ban Members` permission (or a `%setreport banrole`), the user is banned immediately
5. Otherwise, if the reporter has `Moderate Members` permission (or a `%setreport timeoutrole`), the user is timed out immediately

**Action:**
1. An alert embed is posted to the scam report channel with:
   - The original scam message (quoted)
   - Reporter name
   - User who sent the scam message
   - Action buttons: Delete, Delete & Ban, Ban, Revoke Ban, Timeout, Remove Timeout, Delete recent messages
2. Moderators click buttons to take action — each gated by the equivalent native Discord permission or a role granted via `%setreport deleterole|timeoutrole|banrole`
3. All actions are logged with moderator name and timestamp
4. In test mode, bans, timeouts, and deletions are skipped, but alerts still post

**Configuration Checklist:**
- [ ] `%set log #channel` — Configure the log channel
- [ ] `%set scam #channel` — Configure the scam report channel
- [ ] (Optional) `%set scam @role` — Whitelist roles (leave empty to allow all users)
- [ ] (Optional) `%setreport guildcooldown|usercooldown|hourlylimit` — Adjust rate limits from the defaults
- [ ] (Optional) `%setreport deleterole|timeoutrole|banrole @role` — Let non-admin roles moderate via reports

### AutoMod Integration

**How it works:**
1. Discord's native AutoMod detects rule violations and posts to your AutoMod notification channel
2. Shield monitors that channel 24/7
3. When it detects a notification, it forwards the alert to your log channel
4. You see a summary of what was flagged and why

**What you get:**
- Centralized logging of AutoMod activity
- Timestamps and user information
- Easy review of flagged content
- An audit trail for security

**Configuration Checklist:**
- [ ] Enable AutoMod in Discord's Safety Center
- [ ] Create a channel for AutoMod notifications
- [ ] `%set automod #channel` — Tell Shield where AutoMod posts
- [ ] `%set log #channel` — Configure the log channel for forwarded alerts

### Global Rules

**Trigger:**
When a user posts a message or changes their display name/nickname that matches:
1. Username impersonation patterns
2. Known scam links or phishing URLs
3. Fake job posting patterns (3+ recruitment roles)
4. Unauthorized @everyone/@here mentions

**Action:**
1. Message is deleted
2. User is timed out for the configured duration
3. Alert is logged to the log channel with details of what was matched, with **Ignore** and **Report False Positive** buttons for moderators — the latter forwards the detection to the bot operator for accuracy review if [Owner Alerts](README.md#owner-alerts) is configured

**Configuration Checklist:**
- [ ] `%globalrules on` — Enable the feature
- [ ] (Optional) `%globalrules timeout <duration>` — Set timeout (e.g., `1h`)
- [ ] `%set log #channel` — Configure the log channel

### Full History Check

**What it does:**

The `%check [duration]` (or `/check`) command runs a full channel-history scan against the fixed Global Rules message patterns (scam links, scam phrases, fake job postings, mention abuse) — like Scan Mode, but with an admin-chosen history window instead of a fixed one. This helps you:
- Audit a server's entire visible history in one pass, not just the last few days
- Catch scam messages posted before Global Rules was enabled
- Re-check coverage on your own schedule instead of waiting for the next `%scan`

**How it works:**
1. Admin runs `%check` (uses the full allowed window) or `%check 7d` / `2h` / `30m` for a shorter one
2. `/check`'s reply is ephemeral (visible only to you); `%check`'s reply is posted normally, since Discord has no ephemeral concept for text commands — either way it explains the scan depends on ohShield's actual channel access (see [Channel Access Overview](#channel-access-overview) / [Role Hierarchy Check](#role-hierarchy-check)) and that it can take a while
3. Every readable channel is checked across the chosen window
4. Each matching message is posted to the scam alert channel with the same action buttons as a manual `!scam` report — nothing is deleted or banned automatically
5. The notice is edited with a summary and a jump link to the results once the check finishes

**Configuration Checklist:**
- [ ] `%set scam #channel` — Configure the scam alert channel (results are posted here)

Note: Admin only. Gated by a global cooldown shared by every server the bot is in (default 30 days, set by your bot host) — not a per-server setting.

### Scan Mode

**What it does:**

The `%scan` (or `/scan`) command checks message history across every channel the bot can read against the current Global Rules message patterns (scam links, scam phrases, fake job postings, mention abuse) — the same detection used in real time, just run retroactively. This helps you:
- Audit a server right after joining or after a large backlog of unread history
- Catch scam messages posted before Global Rules was enabled
- Spot-check coverage without waiting for new messages to arrive

**How it works:**
1. Admin runs `%scan` or `/scan`
2. The bot immediately replies confirming the scan has started (it can take a while on servers with a lot of history)
3. Every readable channel is checked going back a configurable number of days (default: 7 — ask your bot host if you need this changed)
4. Each matching message is posted to the bot alerts channel with the same action buttons as a manual `!scam` report (Delete Msg, Delete & Ban, Ban, Ignore) — nothing is deleted or banned automatically
5. A summary is posted once the scan finishes

**Configuration Checklist:**
- [ ] `%setbotalerts #channel` — Configure the bot alerts channel (scan results are posted here; required — `%scan` refuses to run without one)

Note: Admin only (non-admins are ignored); limited to once every 24 hours per server.

### Channel Access Overview

**What it does:**

The `%checkchannels` (or `/checkchannels`) command lists every category, channel, and thread ohShield can see — in the same order they appear in your server's sidebar — with a permission badge for each.

**How it works:**
1. Admin runs `%checkchannels`
2. Each entry shows three ✅/❌ marks: Read History, Send Messages, Manage Messages (in that order)
3. If ohShield has `Manage Channels`, private channels (hidden from @everyone) are marked 🔐, and channels only Administrators can view are marked 🔐🔰
4. A legend at the top explains the marks and reminds you that Send Messages and Manage Messages are required for ohShield's core functionality — missing either means that channel isn't protected
5. To fix a missing permission, click the ⚙️ gear icon next to the channel name and select **Permissions**

### Role Hierarchy Check

**What it does:**

The `%checkroles` (or `/checkroles`) command shows where ohShield sits in your role hierarchy and what that means for who it can moderate. Discord requires a bot's highest role to be positioned **above** a member's highest role before it can kick, ban, or timeout them — this holds true even though ohShield doesn't need `Administrator` to moderate.

**How it works:**
1. Admin runs `%checkroles`
2. The embed shows ohShield's rank (e.g. "3/12") in the server's role hierarchy
3. Every role at or above ohShield's own highest role is listed — members whose highest role is one of these can't be kicked/banned/timed out by the bot
4. A percentage shows how many of your (human) members currently fall into that unmoderatable group, based on each member's highest role
5. A hint explains that moving ohShield's role higher in **Server Settings → Roles** expands how many members it can act on

### Security Reminder (Notifications)

**How it works:**
1. A security reminder is posted immediately upon enabling
2. After that, the bot checks every `intervalMinutes` to see if it should post again
3. A new reminder is sent only if at least `minMessages` user messages have appeared in the channel since the last reminder
4. If not enough messages, the bot waits and re-checks at the cooldown interval
5. State is persisted so the schedule resumes correctly after bot restarts

**Configuration:**
```
%setnotify on #announcements       (enable and set channel)
%setnotify interval 120            (check every 120 minutes, default)
%setnotify minmessages 10          (require 10 messages before reposting, default)
%setnotify off                     (disable notifications)
```

**Configuration Checklist:**
- [ ] `%setnotify on #channel` — Enable and set the notification channel
- [ ] (Optional) `%setnotify interval <minutes>` — Adjust check frequency
- [ ] (Optional) `%setnotify minmessages <count>` — Adjust posting threshold

**Example behavior:**
- At 12:00 PM — First reminder sent automatically
- At 2:00 PM — Bot checks (interval=120). If 10+ messages since 12:00 PM, sends reminder. Otherwise, waits and rechecks later.
- The cooldown (global setting) prevents the reminder from appearing too frequently

### User Verification

**How it works:**
1. A verification panel is posted to a designated channel
2. New members click the Verify button
3. They complete a challenge for whichever mode(s) you've enabled (emoji, captcha, and/or 2048 game — more than one can be active at once)
4. On success, they're granted the verified role and can see the rest of the server
5. Optionally, members who fail too many attempts are locked out for a cooldown period, or those who never verify at all can be auto-kicked after a configurable number of hours

**Verification modes:**
- Emoji — Select the correct emoji from a grid (configure: number of rounds)
- CAPTCHA — Identify distorted text in an image (configure: number of tasks)
- Game2048 — Play and win at the 2048 game (configure: target score)

**Configuration:**
```
%setverify enable emoji
%setverify role @Verified
%setverify channel #verification
%setverify rounds 5
%setverify panel
```

**Optional hardening:**
```
%setverify logchannel #verify-logs   (post verification outcomes here)
%setverify retries 3                 (lock out after 3 failed attempts)
%setverify cooldown 15               (lockout lasts 15 minutes)
%setverify kickafter 24              (kick anyone still unverified after 24h)
```

Note: The Game2048 mode requires the bot host to have set up a public web server (`WEB_PUBLIC_URL`, and optionally `WEB_PORT`).

### Image Storage (Optional)

**How it works:**
1. When an image is flagged (image scanner or scam report), Shield downloads it
2. The image is re-uploaded to a private channel in a designated server
3. The image is kept for the retention period (default: 24 hours)
4. After the retention period, the image is auto-deleted

**Benefits:**
- Evidence is preserved even if the original message is deleted
- Private channel keeps evidence secure
- Auto-cleanup prevents your storage channel from getting too large

This feature is set up by whoever hosts the bot via environment variables — see the [Running Guide](RUNNING_GUIDE.md#environment-variables).

---

## Troubleshooting

### Bot can't ban users

**Problem:** Bans aren't working or users aren't being timed out

**Solution:**
1. Check bot permissions: Make sure Shield has `Ban Members`, `Manage Messages`, `Manage Guild`
2. Check bot role position: ohShield's role must be **above** the target user's highest role — run `%checkroles` to see exactly which roles it can't act on and what percentage of members that affects
3. In test mode, bans are skipped intentionally — run `%oh` and check `Test Mode`

---

### Command prefix not working

**Problem:** Commands like `%oh` don't work

**Solution:**
1. Make sure Shield has `Send Messages` permission in the channel
2. The prefix is `%` by default — try `%help` to see if it responds
3. If the bot is in the server but doesn't respond at all, check:
   - Bot role isn't deleted or disabled
   - Bot has permission to read messages in that channel — run `%checkchannels` (from a channel it does respond in) to see its access across every channel at a glance
   - No other bot is intercepting the prefix
4. If none of this helps, ask your bot host to check the server logs (see the [Running Guide](RUNNING_GUIDE.md#troubleshooting))

---

### AutoMod alerts not being logged

**Problem:** You configured AutoMod but Shield isn't forwarding alerts

**Solution:**
1. Make sure AutoMod is actually enabled:
   - Go to Server Settings → Safety Center → Auto Moderation
   - Create at least one rule
   - Set it to "Send alert message to"
2. Make sure Shield knows about the AutoMod channel:
   - Run `%set automod #channel-name` where `channel-name` is where AutoMod posts
3. Check bot permissions: Shield needs `Read Message History` and `Send Messages` in both channels
4. Verify the alert channel: Some rules may not trigger if no violations occur
5. Run `%oh` to confirm the AutoMod channel is set correctly

---

### Image scanner not triggering

**Problem:** Users post 3+ images but nothing happens

**Solution:**
1. Check the threshold: Run `%oh` and verify `Image Threshold` is configured
2. Check excluded roles: The user might have a role that's excluded — run `%oh` to see
3. Check if feature is enabled: Run `%oh` and look for `Image Scanner: Enabled`
4. Make sure images are posted as attachments (not links) — Shield scans Discord attachments only
5. Text disables the scanner: If there's any text in the message, even a space or emoji, it won't trigger

**Note:** Text must be completely absent. Even `. ` (dot and space) counts as text.

---

### User can't complete verification

**Problem:** User clicks Verify but gets stuck

**Solution:**
1. Check mode: Run `%setverify` and verify the mode is set (e.g., `emoji`)
2. Check the verified role and panel channel are both configured
3. If mode is `game2048`, this requires the bot host to have set `WEB_PUBLIC_URL` — ask them to confirm it's configured
4. Test the verification panel: Try clicking Verify yourself to see error messages

---

## FAQ

### Can I use ohShield on multiple servers?

**Yes.** ohShield is designed for multi-server use. Each server has its own independent configuration stored in the bot's database. Settings, roles, and channels are all per-server, so each community gets customized protection.

### What data does ohShield store?

ohShield stores:
- **Per-server settings** (log channel, scam roles, thresholds, etc.)
- **Reported messages** (scam reports and AutoMod alerts)
- **Scheduled cleanup tasks** (for automatic image deletion)
- **Verification state** (who passed verification, challenge attempts)
- **IP addresses**, briefly, to enforce the anti-abuse limit on browser-based verification (auto-deleted after the throttle window)

If the bot host has configured **Owner Alerts** (see the [Running Guide](RUNNING_GUIDE.md#environment-variables)), two specific events are also forwarded to the bot operator's own Discord channels, outside your server: a copy of any `!scam` report that results in a ban (including the reported message text), and any Global Rules detection a moderator flags as a false positive. This is used to track detection accuracy across every server running the bot, not just yours — see [Owner Alerts](README.md#owner-alerts).

See the [Privacy Policy](Privacy_Policy.md) for the full breakdown of what's collected and why.

### What happens if ohShield goes offline?

- **Active timers:** Discord handles timeout timers, so they continue even if the bot is offline
- **Scheduled actions:** If scheduled cleanups are pending, they'll run when the bot comes back online
- **Missed events:** Messages sent while the bot is offline are not scanned
- **Settings:** All settings are preserved and will work immediately when the bot restarts

### Can I use ohShield with Discord AutoMod?

**Yes.** ohShield integrates perfectly with Discord's native AutoMod. You can:
1. Use AutoMod to catch certain patterns
2. Use ohShield's image scanner for image-only spam (the attacks AutoMod misses)
3. Use ohShield's scam reporting for user-flagged content

All three work together seamlessly. Run `%check` periodically for a full history audit against Global Rules, independent of whatever your own AutoMod rules catch.

### How do I know if ohShield is working?

Run this command:
```
%oh
```

If you see a formatted embed with your server's settings, the bot is working and protecting your server. Check that critical settings like "Log Channel" are configured and you're good to go.

### What permissions does ohShield need?

**Minimum:**
- Ban Members
- Manage Messages
- Read Message History
- Send Messages
- Embed Links

**Optional (for specific features):**
- Manage Auto Moderation (only needed for the Security Dashboard's AutoMod rule count)
- Manage Channels (only needed for private/admin-only channel detection in `%checkchannels`)

ohShield will warn you if it's missing critical permissions.

### Can I test ohShield without affecting my server?

**Yes**, if your bot host has enabled test mode. In this mode:
- Detection works normally (enabled)
- Alerts are posted normally (enabled)
- Logging works normally (enabled)
- Bans, timeouts, and deletions are skipped (disabled)

Perfect for verifying your configuration before going live. Ask your bot host to enable it — see the [Running Guide](RUNNING_GUIDE.md#environment-variables).

---

## Support & Resources

- **GitHub:** [noname9006/ohShield](https://github.com/noname9006/ohShield)
- **Discord Server:** *(Link to be added)*
- **Issues:** [GitHub Issues](https://github.com/noname9006/ohShield/issues)

---

## License

ohShield is open source and available under the **MIT License**. You're free to use, modify, and distribute it.

---

**Last Updated:** 2026-07-14
**ohShield Version:** 1.0.0
