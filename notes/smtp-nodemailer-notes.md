# SMTP & Nodemailer in Express.js

> Student Notes — Covers SMTP protocol, how email works, and sending emails with Nodemailer in an Express app

---

## 1. What is SMTP?

SMTP (Simple Mail Transfer Protocol) is the standard protocol for sending email across the internet. It defines how mail clients and mail servers communicate to transfer messages from sender to recipient.

**Email delivery flow:**
```
Your App → SMTP Server → Recipient Mail Server → IMAP/POP3 → Inbox
```

### SMTP Ports

| Port | Usage |
|------|-------|
| `25` | Server-to-server transfer (blocked by most ISPs for apps) |
| `587` | Authenticated submission + STARTTLS — **use this** |
| `465` | SSL/TLS (legacy, still supported by some providers) |

---

## 2. Key SMTP Concepts

| Term | Meaning |
|------|---------|
| **MTA** | Mail Transfer Agent — software that transfers email between servers (e.g. Postfix, Gmail SMTP) |
| **MUA** | Mail User Agent — the client that composes/reads email (e.g. your Node app using Nodemailer) |
| **STARTTLS** | Upgrades a plain TCP connection to encrypted TLS. Used on port 587 |
| **SMTP AUTH** | Requires username + password (or OAuth2) before sending. Prevents open relay abuse |
| **Open relay** | An SMTP server that forwards mail for anyone — a spam risk, always disabled in production |

---

## 3. What is Nodemailer?

Nodemailer is the most popular Node.js library for sending emails. It acts as an MUA — it connects to an SMTP server on your behalf and delivers the message. It supports plain text, HTML, attachments, OAuth2, and more.

> ⚠️ Nodemailer does **not** send emails directly to recipients. It hands the email to an SMTP server (Gmail, SendGrid, Mailgun, etc.) which routes it onward.

---

## 4. Installation

```bash
npm install nodemailer
```

For TypeScript projects:
```bash
npm install @types/nodemailer
```

---

## 5. Core Concepts: Transporter & mailOptions

Every Nodemailer email requires two things:

| Concept | Purpose |
|---------|---------|
| **Transporter** | The SMTP connection config. Created once and reused. Holds host, port, auth credentials. |
| **mailOptions** | The message itself. Defines from, to, subject, body, attachments per email. |

### Basic example

```js
const nodemailer = require('nodemailer');

// 1. Create transporter (connect to SMTP server)
const transporter = nodemailer.createTransport({
  host   : 'smtp.gmail.com',
  port   : 587,
  secure : false,            // true for port 465, false for 587
  auth   : {
    user : 'you@gmail.com',
    pass : 'your_app_password'
  }
});

// 2. Define the email (mailOptions)
const mailOptions = {
  from   : '"My App" <you@gmail.com>',
  to     : 'recipient@example.com',
  subject: 'Hello from Node!',
  text   : 'Plain text body',
  html   : '<h1>HTML body</h1>'
};

// 3. Send (async/await style)
try {
  const info = await transporter.sendMail(mailOptions);
  console.log('Sent:', info.messageId);
} catch (err) {
  console.error(err);
}
```

---

## 6. Integrating with Express.js

### Recommended project structure

```
project/
├── config/
│   └── mailer.js       ← transporter config (created once)
├── routes/
│   └── contact.js      ← Express route using transporter
├── .env                ← SMTP credentials (never commit this)
└── app.js
```

---

### config/mailer.js — create transporter once

```js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host   : process.env.SMTP_HOST,
  port   : process.env.SMTP_PORT || 587,
  secure : false,
  auth   : {
    user : process.env.SMTP_USER,
    pass : process.env.SMTP_PASS
  }
});

// Verify connection on startup (optional but recommended)
transporter.verify((err, success) => {
  if (err) console.error('SMTP connection failed:', err);
  else     console.log('SMTP server ready');
});

module.exports = transporter;
```

> ⚠️ Always store credentials in `.env` using `dotenv`. Never hardcode passwords in source code.

---

### routes/contact.js — send email in a route

```js
const express     = require('express');
const transporter = require('../config/mailer');
const router      = express.Router();

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from   : `"${name}" <${process.env.SMTP_USER}>`,
    to     : 'admin@myapp.com',
    replyTo: email,
    subject: `New message from ${name}`,
    html   : `
      <h2>Contact Form Submission</h2>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Message:</strong> ${message}</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

module.exports = router;
```

---

### app.js — wire it up

```js
require('dotenv').config();
const express = require('express');
const app     = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', require('./routes/contact'));

app.listen(3000, () => console.log('Running on port 3000'));
```

---

## 7. mailOptions Fields Reference

| Field | Required | Description |
|-------|----------|-------------|
| `from` | ✅ required | Sender address. Format: `"Name" <email>` |
| `to` | ✅ required | Recipient(s). Comma-separated string or array |
| `subject` | ✅ required | Email subject line |
| `text` | optional | Plain text body (fallback for HTML) |
| `html` | optional | HTML body content |
| `cc` | optional | Carbon copy recipients |
| `bcc` | optional | Blind carbon copy recipients |
| `replyTo` | optional | Reply-To address (can differ from `from`) |
| `attachments` | optional | Array of attachment objects (see below) |

---

## 8. Attachments

```js
const mailOptions = {
  from   : 'you@gmail.com',
  to     : 'user@example.com',
  subject: 'Your invoice',
  html   : '<p>Please find your invoice attached.</p>',
  attachments: [
    {
      filename: 'invoice.pdf',
      path    : './invoices/invoice-001.pdf',   // from disk path
    },
    {
      filename: 'logo.png',
      content : fs.readFileSync('./public/logo.png'), // Buffer
      cid     : 'logo@app',   // Content-ID for inline embedding in HTML
    },
    {
      filename: 'data.json',
      content : JSON.stringify({ id: 1, amount: 250 }), // string content
    }
  ]
};
```

> 📝 To embed an image inline in HTML, use its `cid`:
> ```html
> <img src="cid:logo@app" alt="Logo" />
> ```

---

## 9. Popular SMTP Providers

### Gmail SMTP

```js
const transporter = nodemailer.createTransport({
  service: 'gmail',        // shorthand — sets host + port automatically
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD   // NOT your Gmail login password
  }
});
```

- Host: `smtp.gmail.com` | Port: `587`
- Requires a **Google App Password** (enable 2FA first, then generate App Password)
- Free limit: ~500 emails/day

---

### SendGrid SMTP

```js
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',                         // literal string "apikey"
    pass: process.env.SENDGRID_API_KEY
  }
});
```

- Free tier: 100 emails/day

---

### Mailgun SMTP

```js
const transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASS
  }
});
```

- Free tier: 1,000 emails/month

---

### Mailtrap (Development & Testing)

```js
const transporter = nodemailer.createTransport({
  host : 'sandbox.smtp.mailtrap.io',
  port : 587,
  auth : {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});
// All sent emails appear in Mailtrap inbox — nothing delivered to real users
```

> ✅ Use Mailtrap during development to avoid sending real emails. It captures all outgoing mail in a virtual inbox.

---

### Provider comparison

| Provider | Free limit | Best for |
|----------|-----------|---------|
| Gmail | ~500/day | Personal projects, quick demos |
| SendGrid | 100/day | Production transactional email |
| Mailgun | 1,000/month | Production + logs + analytics |
| Mailtrap | Unlimited | Development & testing only |
| AWS SES | 62,000/month* | High-volume production |

*When sent from an EC2 instance

---

## 10. Sending HTML Email Templates

```js
function buildWelcomeEmail(name, verifyUrl) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
      <h2>Welcome, ${name}!</h2>
      <p>Thanks for signing up. Click the button below to verify your email address.</p>
      <a href="${verifyUrl}"
         style="display:inline-block; background:#0066cc; color:#fff;
                padding:12px 24px; border-radius:4px; text-decoration:none; margin:16px 0;">
        Verify Email
      </a>
      <p style="color:#888; font-size:12px;">
        If you didn't create an account, you can safely ignore this email.
      </p>
    </body>
    </html>
  `;
}

app.post('/register', async (req, res) => {
  const { name, email } = req.body;
  // ... save user to DB, generate token ...
  const verifyUrl = `https://myapp.com/verify?token=${token}`;

  await transporter.sendMail({
    from   : '"My App" <noreply@myapp.com>',
    to     : email,
    subject: 'Welcome! Please verify your email',
    html   : buildWelcomeEmail(name, verifyUrl),
    text   : `Welcome ${name}! Visit ${verifyUrl} to confirm your email.`
  });

  res.json({ message: 'Registration successful. Check your email!' });
});
```

> 📝 Always include a `text` fallback alongside `html` for email clients that don't render HTML.

---

## 11. Using .env for Credentials

```bash
npm install dotenv
```

**.env file:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your_app_password
```

**app.js:**
```js
require('dotenv').config();  // must be at the very top

const transporter = nodemailer.createTransport({
  host : process.env.SMTP_HOST,
  port : process.env.SMTP_PORT,
  auth : {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
```

**.gitignore:**
```
.env
node_modules/
```

> 🚨 **Critical:** Add `.env` to `.gitignore` immediately. Leaked SMTP credentials can be abused to send spam from your account or incur costs.

---

## 12. Error Handling

```js
try {
  const info = await transporter.sendMail(mailOptions);
  console.log('Message sent:', info.messageId);
} catch (err) {
  if (err.code === 'EAUTH') {
    console.error('Authentication failed — check credentials or App Password');
  } else if (err.code === 'ECONNREFUSED') {
    console.error('SMTP server unreachable — check host and port');
  } else if (err.code === 'ESOCKET') {
    console.error('TLS/SSL error — check secure and port settings');
  } else {
    console.error('Email send failed:', err.message);
  }
}
```

### Common error codes

| Code | Cause | Fix |
|------|-------|-----|
| `EAUTH` | Wrong credentials | Use App Password for Gmail |
| `ECONNREFUSED` | Server unreachable | Check host/port |
| `ESOCKET` | TLS mismatch | Verify `secure` + `port` |
| `ETIMEDOUT` | Connection timeout | Check network/firewall |

---

## 13. Best Practices & Common Mistakes

### Best practices ✅

- Always store credentials in `.env`
- Create transporter **once** and reuse it across routes
- Use port `587` + STARTTLS in production
- Always include a plain text fallback alongside HTML
- Use **Mailtrap** or **Ethereal** for development and testing
- Call `transporter.verify()` on app startup to catch config errors early
- Sanitize user input before injecting it into HTML email bodies

### Common mistakes ❌

- Hardcoding SMTP credentials directly in source code
- Using Gmail login password instead of an App Password
- Creating a new transporter on every request (expensive)
- Not handling `sendMail` errors (crashes the app silently)
- No plain text fallback — some clients won't render HTML
- Testing with real email addresses during development

---

## 14. Quick Reference Card

```
nodemailer.createTransport({...})  → create SMTP connection config (once)
transporter.verify()               → test SMTP connection on startup
transporter.sendMail(options)      → send email (returns Promise)
info.messageId                     → ID assigned by the SMTP server

Ports:
  25   → server-to-server (blocked for apps)
  587  → STARTTLS authenticated (use this in production)
  465  → SSL legacy

Dev tools:
  Mailtrap  → catches mail, never delivers (recommended)
  Ethereal  → nodemailer.createTestAccount() auto temp account

Providers:
  Gmail, SendGrid, Mailgun, AWS SES, Postmark
```

---

*Notes compiled for Nodemailer v6.x | Express.js v4+ | Node.js 18+*
