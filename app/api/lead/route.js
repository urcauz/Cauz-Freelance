import { NextResponse } from "next/server";
import { appendLead } from "lib/dashboardStore";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitize(input, maxLength = 1000) {
  return String(input || "").trim().slice(0, maxLength);
}

async function sendToDiscord(webhookUrl, lead, metadata) {
  const embed = {
    title: "New Portfolio Lead",
    color: 0x00bfa4,
    fields: [
      { name: "Name", value: lead.name || "N/A", inline: true },
      { name: "Email", value: lead.email || "N/A", inline: true },
      { name: "Engagement", value: lead.engagementType || "Not specified", inline: true },
      { name: "Service", value: lead.service || "Not specified", inline: true },
      { name: "Budget", value: lead.budget || "Not specified", inline: true },
      { name: "Timeline", value: lead.timeline || "Not specified", inline: true },
      { name: "Call Date", value: lead.callDate || "Not specified", inline: true },
      { name: "Call Time", value: lead.callTime || "Not specified", inline: true },
      { name: "Timezone", value: lead.timezone || "Not specified", inline: true },
      { name: "Source", value: lead.source || "Website", inline: true },
      {
        name: "Brief",
        value: lead.brief || "No brief provided"
      },
      { name: "Lead ID", value: metadata.leadId, inline: true },
      { name: "Submitted At", value: metadata.submittedAt, inline: true }
    ]
  };

  if (metadata.ip) {
    embed.fields.push({ name: "IP", value: metadata.ip, inline: true });
  }

  if (metadata.userAgent) {
    embed.fields.push({
      name: "User Agent",
      value: metadata.userAgent.slice(0, 1000)
    });
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "Cauz Portfolio",
      embeds: [embed]
    })
  });

  if (!response.ok) {
    const bodyText = await response.text();
    throw new Error(`Discord webhook failed: ${response.status} ${bodyText}`);
  }
}

async function sendViaResend(apiKey, fromEmail, toEmail, lead, metadata) {
  const text = [
    "New portfolio lead",
    `Lead ID: ${metadata.leadId}`,
    `Submitted At: ${metadata.submittedAt}`,
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Engagement Type: ${lead.engagementType}`,
    `Service: ${lead.service}`,
    `Budget: ${lead.budget}`,
    `Timeline: ${lead.timeline}`,
    `Call Date: ${lead.callDate}`,
    `Call Time: ${lead.callTime}`,
    `Timezone: ${lead.timezone}`,
    `Source: ${lead.source}`,
    "",
    "Brief:",
    lead.brief
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject: `New Lead: ${lead.name} (${lead.service})`,
      text
    })
  });

  if (!response.ok) {
    const bodyText = await response.text();
    throw new Error(`Resend failed: ${response.status} ${bodyText}`);
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();

    const lead = {
      name: sanitize(payload.name, 120),
      email: sanitize(payload.email, 160).toLowerCase(),
      engagementType: sanitize(payload.engagementType, 120),
      brief: sanitize(payload.brief, 3000),
      service: sanitize(payload.service, 120),
      budget: sanitize(payload.budget, 120),
      timeline: sanitize(payload.timeline, 120),
      callDate: sanitize(payload.callDate, 60),
      callTime: sanitize(payload.callTime, 60),
      timezone: sanitize(payload.timezone, 120),
      source: sanitize(payload.source, 120)
    };

    if (!lead.name || !lead.email || !lead.brief) {
      return NextResponse.json(
        { ok: false, error: "Name, email, and brief are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(lead.email)) {
      return NextResponse.json({ ok: false, error: "Invalid email address." }, { status: 400 });
    }

    if (
      lead.engagementType.toLowerCase() === "discovery call" &&
      (!lead.callDate || !lead.callTime || !lead.timezone)
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "For discovery calls, preferred date, time, and timezone are required."
        },
        { status: 400 }
      );
    }

    const leadId = `lead_${Date.now()}`;
    const submittedAt = new Date().toISOString();
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "";
    const userAgent = request.headers.get("user-agent") || "";

    const metadata = { leadId, submittedAt, ip, userAgent };

    const discordWebhookUrl = process.env.DISCORD_LEADS_WEBHOOK_URL;
    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFrom = process.env.LEADS_FROM_EMAIL;
    const resendTo = process.env.LEADS_TO_EMAIL;

    const delivery = {
      discord: false,
      email: false
    };
    const channelErrors = [];

    if (discordWebhookUrl) {
      try {
        await sendToDiscord(discordWebhookUrl, lead, metadata);
        delivery.discord = true;
      } catch (error) {
        channelErrors.push({
          channel: "discord",
          error: error instanceof Error ? error.message : "Unknown discord error"
        });
      }
    }

    if (resendApiKey && resendFrom && resendTo) {
      try {
        await sendViaResend(resendApiKey, resendFrom, resendTo, lead, metadata);
        delivery.email = true;
      } catch (error) {
        channelErrors.push({
          channel: "email",
          error: error instanceof Error ? error.message : "Unknown email error"
        });
      }
    }

    await appendLead({
      ...lead,
      ...metadata,
      status: "new",
      delivery,
      channelErrors
    });

    return NextResponse.json(
      {
        ok: true,
        leadId,
        delivery,
        stored: true,
        warnings: channelErrors
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to submit lead.",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
