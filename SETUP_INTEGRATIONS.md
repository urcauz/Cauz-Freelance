# Integration Setup

## 1) Lead Form API
The contact form now submits to `POST /api/lead` (no `mailto` dependency).
Booking is handled on-site through this same form (Discovery Call option).

Lead delivery channels:
- Discord webhook (recommended)
- Optional Resend email

## 2) Required env for Discord-first setup
Create `.env.local` and set:

```bash
DISCORD_LEADS_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

## 3) Optional analytics
GA4:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Microsoft Clarity (free):

```bash
NEXT_PUBLIC_CLARITY_PROJECT_ID=xxxxxxxxxx
```

## 4) Optional email delivery via Resend

```bash
RESEND_API_KEY=re_...
LEADS_FROM_EMAIL=Portfolio Leads <leads@yourdomain.com>
LEADS_TO_EMAIL=you@yourdomain.com
```
