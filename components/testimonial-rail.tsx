"use client";

import type { CSSProperties } from "react";
import type { Testimonial } from "@/lib/testimonials";

export function TestimonialRail({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;
  const style = { "--testimonial-duration": `${Math.max(testimonials.length * 8, 38)}s` } as CSSProperties;
  return <section className="testimonial-section"><p className="eyebrow">Kind words</p><div className="testimonial-rail" aria-label="Client testimonials — hover to pause"><div className="testimonial-track" style={style}>{[...testimonials, ...testimonials].map((testimonial, index) => <figure className="testimonial-card" key={`${testimonial.name}-${index}`}><blockquote>“{testimonial.quote}”</blockquote><figcaption><strong>{testimonial.name}</strong><span>{testimonial.role}</span></figcaption></figure>)}</div></div></section>;
}
