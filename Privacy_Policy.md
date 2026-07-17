# Privacy Policy — ohShield

**Effective Date:** July 1st, 2026
**Last Updated:** July 14th, 2026

This Privacy Policy explains how ohShield ("we," "us," or "our") collects, uses, discloses, and protects information when you use our Discord bot, verification dashboard, and related services (collectively, the "Service").

By using ohShield, you agree to the collection and use of information as described in this policy. If you do not agree, please do not use the Service.

---

## 1. Information We Collect

### a) Information from Discord
When ohShield is added to a server or a user interacts with it, we may collect:
- Discord User ID
- Username
- Server (Guild) ID and server name
- Server roles relevant to verification status
- Timestamps of verification attempts and outcomes
- Game scores, for servers using the optional game-based verification mode

### b) Technical & Verification Data
To operate the verification process, we may collect:
- A signed session cookie/token, used to keep you logged in to the verification page during a single verification attempt. This cookie is not stored on our servers — it lives only in your browser and is cryptographically signed so we can detect tampering.
- CAPTCHA, emoji-challenge, or math-challenge pass/fail results and attempt counts (used to enforce per-user attempt limits and cooldowns)
- Your IP address, when you complete browser-based verification. This is used solely to enforce an anti-abuse limit on how many different accounts can verify from the same IP within a rolling time window, and is automatically deleted once that window elapses.

We do not collect your browser type, device information, or Discord avatar image.

### c) Message Content Analysis
To detect phishing links, fake giveaways, impersonation attempts, and other scam-related content, ohShield scans message content in real-time. This includes:
- URLs and link analysis
- Text patterns associated with known scams and phishing
- Suspicious keywords and phishing indicators
- Giveaway and impersonation detection signals
- Image attachments, when a message is flagged as a likely scam — the image is copied to a private moderation channel as evidence and automatically deleted after a configurable retention period (24 hours by default)

**Message content is analyzed in real-time and is not stored** unless a message is reported as a scam (via the `!scam` command) or matches our automated scam-detection rules, in which case the message text (and any flagged image attachments, per above) is stored so moderators can review it and take action (see Data Retention section below).

**Confirmed scam reports and false-positive flags are forwarded to ohShield's operator.** When a `!scam` report results in a ban, a copy of the alert (including the reported message's text, the reported user's ID, and the server's name/ID) is forwarded to a private, operator-controlled Discord channel, so the operator can track detection accuracy across servers. Separately, if a moderator flags a Global Rules detection as a false positive, that report (category, matched text, the flagged user's ID, and the reporting moderator's identity) is forwarded to a second, similarly operator-controlled channel. Neither is used to train machine learning or AI models — see Section 4.

### d) Dashboard & Cookies (Moderators)
If you log into our web moderator dashboard, we request Discord's `identify` and `guilds` OAuth scopes to confirm who you are and which servers you have permission to manage there. Like verification, your dashboard session is a signed cookie held only in your browser (not stored on our servers), and expires automatically after 24 hours. You can control cookie behavior through your browser settings, though disabling cookies will prevent you from staying logged in.

### e) Global Rules Admin Console (Operators)
Our internal admin console, used only by ohShield's own operators to edit scam-detection patterns, logs the IP address of each change alongside a record of what was changed, for security auditing. This IP log is retained indefinitely as part of that audit trail and is not linked to any Discord user account.

## 2. How We Use Information

We use collected information to:
- Verify that server members are legitimate, human users
- Scan message content in real-time to detect and prevent scam accounts, phishing attempts, impersonation, and malicious links
- Assign or remove verification-related roles
- Maintain and improve the security and reliability of the Service
- Respond to support requests and troubleshoot issues
- Comply with legal obligations

We do **not** sell your personal information to third parties. Message content analyzed for security purposes is not stored long-term except where flagged as a potential threat for moderator review.

## 3. Legal Basis for Processing (GDPR)

If you are located in the European Economic Area (EEA), our legal basis for processing your information includes:
- **Legitimate interest** — operating and securing the Service, and protecting server communities from fraud and abuse.
- **Consent** — where you have taken an affirmative action to verify through our dashboard.
- **Legal obligation** — where processing is required to comply with applicable law.

## 4. Data Sharing & Third Parties

We may share information with:
- **Discord Inc.**, as necessary for the Bot to function via the Discord API, subject to [Discord's Privacy Policy](https://discord.com/privacy).
- **Telegram**, only if a server's administrators choose to link a Telegram chat to receive security alerts. When enabled, alert content (which may include truncated flagged message text, usernames, and server names) is sent to that chat via the Telegram Bot API, subject to [Telegram's Privacy Policy](https://telegram.org/privacy).
- **ohShield's own operator** (not an external third party), for confirmed scam-report bans and Global Rules false-positive flags — see Section 1(c). This is a cross-server record used only to review detection accuracy and is never used to train machine learning or AI models, sold, or disclosed to anyone outside the operator.
- **Hosting and infrastructure providers** who store or process data on our behalf under confidentiality obligations.
- **Legal authorities**, if required to comply with a legal obligation, court order, or to protect the rights, property, or safety of ohShield, our users, or others.

We do not share verification data with server owners beyond the verification status/role itself, unless required for abuse investigation.

## 5. Data Retention

We retain data only as long as necessary to fulfill the purposes described in this policy:
- Verification records, game scores, and stored scam-report message text are retained for as long as the bot remains in the server.
- IP addresses collected for anti-abuse verification throttling (§1b) are automatically deleted once the relevant rolling time window elapses.
- Images copied to a moderation channel from flagged messages (§1c) are automatically deleted after a configurable retention period (24 hours by default; a server owner may configure a longer period).
- IP addresses logged by the internal Global Rules admin console (§1e) are retained indefinitely as part of a security audit trail.
- Confirmed scam-report and false-positive records forwarded to the operator (§1c, §4) are retained indefinitely as a cross-server detection-accuracy record.
- If ohShield is removed from a server, associated server-specific data is retained until the server owner or an authorized admin requests its deletion by contacting us (see Section 11), except where retention is required for legal or security purposes. We do not currently run an automatic deletion schedule after removal — deletion is handled on request.

## 6. Data Security

We implement reasonable technical and organizational measures to protect your information, including encryption in transit, access controls, and secure hosting infrastructure. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.

## 7. Your Rights

Depending on your jurisdiction, you may have the right to:
- Access the personal information we hold about you
- Request correction of inaccurate data
- Request deletion of your data
- Object to or restrict certain processing
- Request a copy of your data in a portable format
- Withdraw consent, where processing is based on consent

To exercise these rights, contact us at the email below. We will respond within the timeframe required by applicable law (e.g., 30 days under GDPR).

California residents may have additional rights under the CCPA/CPRA, including the right to know what personal information is collected and the right to opt out of the sale of personal information. **We do not sell personal information.**

## 8. Children's Privacy

ohShield is not intended for use by individuals under the age of 13, consistent with Discord's own age requirements. We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently collected such information, we will delete it promptly.

## 9. International Data Transfers

Your information may be processed and stored on servers located outside your country of residence, including in countries that may have different data protection laws. Where required, we take steps to ensure appropriate safeguards are in place for such transfers.

## 10. Changes to This Privacy Policy

We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. Material changes will be reflected by an updated "Last Updated" date above. Continued use of the Service after changes take effect constitutes acceptance of the revised policy.

## 11. Contact Us

If you have questions, concerns, or requests regarding this Privacy Policy or your data, please contact us at:

**Email:** yes@ohshield.com

---

*By using ohShield, you acknowledge that you have read and understood this Privacy Policy.*
