import Link from "next/link";
import { deliverySystem, projects, services, stats, testimonials } from "lib/siteData";

const trustSignals = [
  "Product strategy, design, and engineering in one lane",
  "Weekly progress visibility with async updates",
  "Conversion decisions backed by real user behavior"
];

export default function HomePage() {
  const featured = projects.slice(0, 3);
  const process = deliverySystem.slice(0, 5);
  const servicesShowcase = services.slice(0, 3);

  return (
    <div className="page page-home">
      <section className="section-block section-hero hero-canvas">
        <div className="hero-copy">
          <p className="eyebrow">Freelance Product Partner</p>
          <h1>
            Interfaces that
            <span> sell the product before the pitch starts.</span>
          </h1>
          <p className="lead">
            Founders hire me when the website needs to be both a brand weapon and a growth engine:
            differentiated visuals, clean engineering, and measurable conversion outcomes.
          </p>

          <div className="hero-actions">
            <Link href="/contact" className="cta-primary">
              Start a Project
            </Link>
            <Link href="/work" className="cta-ghost">
              Review Case Studies
            </Link>
          </div>

          <div className="trust-list">
            {trustSignals.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>

          <div className="hero-kpis hero-kpis-inline">
            {stats.slice(0, 3).map((stat) => (
              <article key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>

          <div className="hero-chip-row">
            {servicesShowcase.map((service) => (
              <span key={service.title} className="signal-chip">
                {service.title}
              </span>
            ))}
          </div>
        </div>

        <aside className="hero-command">
          <div className="command-shell">
            <p className="command-kicker">Live Product Command Deck</p>
            <h3>Delivery + visuals + conversion in one operating loop.</h3>
            <div className="orbit-core" aria-hidden>
              <span className="orbit-ring ring-a" />
              <span className="orbit-ring ring-b" />
              <span className="orbit-ring ring-c" />
              <span className="orbit-center">Build</span>
            </div>

            <div className="command-feed">
              <div className="feed-line">
                <span>In Build</span>
                <strong>Creator Commerce Platform</strong>
              </div>
              <div className="feed-line">
                <span>This Week</span>
                <strong>Visual refresh + onboarding funnel instrumentation</strong>
              </div>
              <div className="feed-line">
                <span>Current Focus</span>
                <strong>Landing narrative, trust proof, launch analytics</strong>
              </div>
            </div>

            <div className="command-bars" aria-hidden>
              <span className="bar bar-a" />
              <span className="bar bar-b" />
              <span className="bar bar-c" />
              <span className="bar bar-d" />
            </div>
          </div>

          <article className="command-meta">
            <div>
              <small>Current Pace</small>
              <strong>4 focused sprint days / week</strong>
            </div>
            <div>
              <small>Quality Pass</small>
              <strong>UX + A11y + Perf</strong>
            </div>
          </article>

          <article className="command-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="command-stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </article>
        </aside>
      </section>

      <section className="section-block section-reset proof-bento">
        <div className="section-head split">
          <div>
            <p className="eyebrow">Execution Proof</p>
            <h2>Craft, systems, and growth logic layered into every release.</h2>
          </div>
          <Link href="/about" className="inline-link">
            View operating model
          </Link>
        </div>

        <div className="bento-grid">
          <article className="bento-card bento-main">
            <p className="eyebrow">UI Architecture</p>
            <h3>Layouts that scale from first launch to long-term product growth.</h3>
            <p>
              Component-driven structure, consistent hierarchy, and interaction patterns that stay stable as
              features expand.
            </p>
          </article>

          <article className="bento-card bento-tall">
            <p className="eyebrow">Motion Direction</p>
            <h3>Animation with purpose, not noise.</h3>
            <ul className="bento-list">
              <li>Entrance choreography tied to reading flow</li>
              <li>Hover/press states that communicate depth</li>
              <li>Motion pacing tuned for clarity and performance</li>
            </ul>
          </article>

          <article className="bento-card bento-kpi">
            <p className="eyebrow">Performance Loop</p>
            <div className="bento-kpis">
              {stats.map((stat) => (
                <div key={stat.label} className="kpi-tile">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="bento-card bento-service">
            <p className="eyebrow">Service Stack</p>
            {servicesShowcase.map((service) => (
              <div key={service.title} className="bento-service-row">
                <strong>{service.title}</strong>
                <p>{service.summary}</p>
              </div>
            ))}
          </article>
        </div>
      </section>

      <section className="section-block section-reset process-rail">
        <div className="section-head split">
          <div>
            <p className="eyebrow">Delivery Flow</p>
            <h2>A fast process with clear checkpoints and no blind spots.</h2>
          </div>
        </div>

        <ol className="rail-list">
          {process.map((item, index) => (
            <li key={item} className="rail-step">
              <span className="rail-index">{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
              {index < process.length - 1 ? <span className="rail-link" aria-hidden /> : null}
            </li>
          ))}
        </ol>
      </section>

      <section className="section-block section-reset kinetic-showcase">
        <div className="section-head split">
          <div>
            <p className="eyebrow">Selected Work</p>
            <h2>Recent outcomes with product-level execution detail.</h2>
          </div>
          <Link href="/work" className="inline-link">
            See full portfolio
          </Link>
        </div>

        <div className="showcase-lane">
          {featured.map((project, index) => (
            <article key={project.title} className="showcase-card">
              <div className="showcase-image-wrap">
                <img src={project.image} alt={project.title} loading="lazy" />
                <span className="showcase-index">0{index + 1}</span>
              </div>
              <div className="showcase-content">
                <p className="project-tag">{project.category}</p>
                <h3>{project.title}</h3>
                <p>{project.resultA}</p>
                <p>{project.resultB}</p>
                <a href={project.primaryLink} target="_blank" rel="noreferrer">
                  {project.primaryLabel}
                </a>
              </div>
            </article>
          ))}
        </div>
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

      <section className="section-block cta-reset">
        <h2>Have a project in mind?</h2>
        <p>Share your goals, timeline, and scope. I will reply with a practical rollout plan.</p>
        <Link href="/contact" className="cta-primary">
          Start Project
        </Link>
      </section>
    </div>
  );
}
