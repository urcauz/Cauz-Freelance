"use client";

import { FormEvent, useState } from "react";
import type { SiteContent } from "@/lib/site-content";

export function AdminContentControls({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState(initialContent);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setMessage("");
    try {
      const response = await fetch("/api/site-content", { method: "PUT", headers: { "Content-Type": "application/json", "x-admin-password": password }, body: JSON.stringify(content) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error ?? "Could not save.");
      setContent(result); setPassword(""); setMessage("Everything is saved and live.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not save."); } finally { setSaving(false); }
  };
  const change = (field: keyof SiteContent, value: string) => setContent({ ...content, [field]: value });
  return <section id="content" className="admin-panel content-controls"><div className="admin-panel-heading"><div><p>Site content</p><h2>Keep the rest of the site fresh.</h2></div><span>MongoDB</span></div><form onSubmit={save}><div className="content-control-grid"><label>What I’m doing now<textarea rows={4} value={content.now} onChange={(event) => change("now", event.target.value)} /></label><label>Featured case study title<textarea rows={2} value={content.caseStudyTitle} onChange={(event) => change("caseStudyTitle", event.target.value)} /></label><label>Featured case study story<textarea rows={4} value={content.caseStudyCopy} onChange={(event) => change("caseStudyCopy", event.target.value)} /></label><label>Testimonial<textarea rows={4} value={content.testimonial} onChange={(event) => change("testimonial", event.target.value)} /></label><label>Testimonial name<input value={content.testimonialName} onChange={(event) => change("testimonialName", event.target.value)} /></label><label>Contact inbox<input type="email" value={content.contactEmail} onChange={(event) => change("contactEmail", event.target.value)} /></label><label>Notification email <small>Ready for an email provider hookup</small><input type="email" value={content.notificationEmail} onChange={(event) => change("notificationEmail", event.target.value)} /></label><label>Project filters <small>Separate with commas</small><input value={content.enabledCategories.join(", ")} onChange={(event) => setContent({ ...content, enabledCategories: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} /></label></div><div className="admin-form-footer"><label className="admin-password">Admin password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label><small>{message}</small><button disabled={saving} type="submit">{saving ? "Saving…" : "Save site content →"}</button></div></form><div className="admin-feature-notes"><span><b>Contact form</b> Add Resend, Postmark, or your preferred provider to send entries to the notification email.</span><span><b>Analytics</b> Add Plausible, Vercel Analytics, or PostHog—this panel is ready for the metrics.</span><span><b>Admin access</b> Keep `ADMIN_PASSWORD` private; add Auth.js or Clerk later for account-based login.</span></div></section>;
}
