import { deliverySystem, faqs, principles, stack, testimonials } from "lib/siteData";

export default function AboutPage() {
  return (
    <div className="page page-about">
      <section className="section-block section-hero">
        <p className="eyebrow">About</p>
        <h1>I design and build products that stay strong after launch.</h1>
        <p className="lead">
          I combine product thinking, frontend engineering, and growth instrumentation so teams get one
          partner who can ship fast without creating long-term tech debt.
        </p>
      </section>

      <section className="section-block section-reset">
        <div className="section-head">
          <p className="eyebrow">Principles</p>
          <h2>How I keep quality high while moving fast.</h2>
        </div>
        <div className="principles-grid">
          {principles.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block section-reset about-timeline-wrap">
        <div className="section-head">
          <p className="eyebrow">Stack</p>
          <h2>Tools I use to deliver quickly and reliably.</h2>
        </div>
        <div className="stack-cloud">
          {stack.map((item) => (
            <span key={item} className="stack-tag">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="section-block section-reset about-timeline-wrap">
        <div className="section-head">
          <p className="eyebrow">Delivery Timeline</p>
          <h2>How work moves from kickoff to launch.</h2>
        </div>
        <ol className="about-timeline">
          {deliverySystem.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="section-block section-reset quote-grid">
        {testimonials.map((item) => (
          <article key={item.name}>
            <p>{item.quote}</p>
            <h4>{item.name}</h4>
            <span>{item.role}</span>
          </article>
        ))}
      </section>

      <section className="section-block section-reset faq-grid">
        <div className="section-head">
          <p className="eyebrow">FAQ</p>
          <h2>Before you book.</h2>
        </div>
        {faqs.map((item) => (
          <article key={item.q}>
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
