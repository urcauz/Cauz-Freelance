"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSending(true); setStatus("");
    try { const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const result = await response.json(); if (!response.ok) throw new Error(result.error ?? "Could not send message."); setForm({ name: "", email: "", message: "" }); setStatus("Got it — I’ll get back to you soon."); } catch (error) { setStatus(error instanceof Error ? error.message : "Could not send message."); } finally { setSending(false); }
  };
  return <form className="public-contact-form" onSubmit={submit}><div><label>Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label></div><label>What are you thinking?<textarea required rows={4} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></label><div><small>{status}</small><button disabled={sending} type="submit">{sending ? "Sending…" : "Send it →"}</button></div></form>;
}
