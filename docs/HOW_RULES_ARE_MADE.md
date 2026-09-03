# How ohShield's Rules Are Made

ohShield ships one shared detection rule set to every server it protects. That
design is the whole point — a scam caught in one community becomes protection
for all of them, without any admin writing a filter. It also means a careless
rule is a mistake in every server at once.

This page describes exactly how a rule gets made, tested, and shipped, and what
has to be true before one reaches your server.

We publish the method, not the patterns. The reasoning for that is in
[What we don't publish](#what-we-dont-publish).

---

## Why not just let admins write their own rules?

You can already do this. Discord's native AutoMod supports custom keyword and
regex rules, and so do several moderation bots.

The catch is that it makes every server admin responsible for independently
discovering, writing, and maintaining scam patterns — while scammers rotate
theirs weekly. Most admins have a community to run and no interest in becoming
a part-time threat analyst. The ones who try end up with a stale filter and a
false sense of coverage.

ohShield inverts that. You don't write rules. We do, and we keep doing it.

---

## The loop

```
  report  ->  confirmation  ->  candidate  ->  backtest  ->  gate  ->  deploy
```

### 1. Report

A trusted member replies to a scam message with `!scam`. The message text is
recorded and moderators get an alert with action buttons.

Reports are the raw intake. On their own they prove nothing — people misreport,
and some reports are arguments rather than scams.

### 2. Confirmation

A report becomes a **confirmed scam** only when a moderator actually acts on it
(bans, or deletes and bans). Human judgment is the labelling step; nothing is
treated as a scam because an automated system guessed it was.

Reports nobody acted on are kept, but in a separate bucket — see
[Why "nobody acted on it" isn't a negative](#why-nobody-acted-on-it-isnt-a-negative).

### 3. Candidate

Confirmed scams are reviewed for recurring structure — an obfuscated link
shape, a recruitment-spam layout, a homoglyph impersonation of a known bot. A
pattern that generalizes beyond a single message becomes a **candidate rule**.

A candidate is not a rule. It cannot match anything in your server yet.

### 4. Backtest

The candidate runs against three corpora of real message history:

| Corpus | What it is | What it measures |
|---|---|---|
| **Confirmed scams** | Messages a moderator banned on | Does this catch real scams? |
| **Known-good** | Text moderators flagged as false positives, plus curated ordinary conversation | Does this break normal servers? |
| **Unconfirmed** | Reported, never actioned | Advisory signal only |

The result is a hit count against each, plus the actual text of anything it
matched. Evidence, not just a score — a rule is a decision about other people's
servers, and that decision should be made while looking at what it would do.

### 5. Gate

**Any match against known-good text rejects the rule.** Not a warning, not a
score to weigh — a hard stop. The rule is refused with the text it would have
wrongly flagged:

```
Rejected: this pattern matches 1 of 3 known-good messages (33.3% false-positive rate).
  • here is the /invite link for our sister server, welcome!
```

The gate sits in the storage layer, not the admin interface, so every path that
creates or edits a rule passes through it. There is no "publish anyway" button.

Two further checks run alongside:

- **Catastrophic backtracking.** Candidate expressions are stress-tested in an
  isolated worker thread under a time budget, and the backtest sweep itself is
  killable. A pattern that is merely *slow* against real message history is
  rejected. This is not hypothetical: a single crafted message once froze
  detection for ten seconds, and that class of bug is now blocked by
  construction.
- **Stateful flags.** Regex flags that make matching non-deterministic across
  calls are rejected outright rather than silently rewritten.

### 6. Deploy

A rule that passes goes live on the next message, in every protected server, with
no restart and no admin action. Every create, edit, and delete is written to an
audit log recording who changed what, from where, with the before and after
values.

---

## Why "nobody acted on it" isn't a negative

The tempting shortcut is to treat any reported message that didn't end in a ban
as known-good, since it would multiply the negative corpus overnight.

It's wrong. A report usually goes unactioned because the moderators were asleep,
busy, or unsure — not because the message was innocent. Feeding those in as
negatives would inflate the measured false-positive rate and start rejecting
good rules for catching actual scams.

So they're counted separately and reported as a signal, never as a verdict. The
known-good corpus only grows from two sources: a moderator explicitly marking a
detection as a false positive, and hand-curated ordinary conversation.

This makes the negative corpus grow slower than it otherwise could. That's the
correct trade — a false-positive corpus is only worth anything if every entry in
it is actually true.

---

## Regressions are permanent

When a moderator marks a Global Rules detection as a false positive, the text
that misfired is stored as a **permanent regression test**.

Every future rule is checked against it. The same mistake cannot ship twice, and
it doesn't rely on anyone remembering it happened.

The live rule set can also be replayed against the entire known-good corpus on
demand, so a rule that was safe when written but has become over-broad as the
corpus grew gets surfaced rather than sitting there quietly costing servers real
users.

---

## What this does and doesn't promise

**It does mean:** no rule reaches your server without being measured against
real scams and real ordinary conversation first, and every false positive
anyone reports becomes a test that protects everyone else.

**It doesn't mean zero false positives.** A rule can only be tested against text
we have. Novel phrasing in a community whose normal conversation looks unlike
anything in the corpus can still be caught wrongly. That's why the false-positive
button exists, why Global Rules can be disabled per server, and why the corpus
matters more than any individual rule.

Any bot claiming zero false positives is either not measuring or not telling you.
Ours is measured, which is why we can describe its limits.

---

## What we don't publish

The rules themselves are not public.

Not because the technique is secret — homoglyph detection and link
deobfuscation are well-understood. But a published rule set is a checklist for
the people it's built to stop: anyone can verify their scam slips through before
sending it.

What we publish instead is the method, on this page, and the outcome — how many
rules were added, how many were rejected by the gate, and what the corpus looks
like. That's enough to judge whether the process is rigorous without handing
scammers a test suite.

---

## Your data

The corpora are built only from message text ohShield already retains under its
[Privacy Policy](../Privacy_Policy.md): messages reported as scams, and messages
flagged as detection false positives. No new category of data is collected for
backtesting, and ordinary conversation is never stored for it.

See the Privacy Policy for retention periods and how to request deletion.

---

## Related

- [User Guide — Global Rules](USER_GUIDE.md#global-rules) — what the shared rule set detects
- [User Guide — Scam Reporting](USER_GUIDE.md#scam-reporting) — how a report becomes a confirmation
- [Privacy Policy](../Privacy_Policy.md) — what's retained and for how long
