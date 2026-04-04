"use client";

import { useMemo, useState } from "react";
import { projects } from "lib/siteData";

const filters = ["all", "web", "automation", "discord", "content", "brand"];

export default function WorkPage() {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter((item) => item.category === filter);
  }, [filter]);

  return (
    <div className="page page-work">
      <section className="section-block section-hero work-hero">
        <p className="eyebrow">Portfolio</p>
        <h1>Case studies built around measurable outcomes.</h1>
        <p className="lead">
          Each build combines product clarity, visual craft, and conversion performance.
        </p>
      </section>

      <section className="section-block section-reset">
        <div className="work-highlights">
          <article>
            <strong>Conversion-First</strong>
            <span>Offers, hierarchy, and CTA flow tested for action.</span>
          </article>
          <article>
            <strong>Engineering Quality</strong>
            <span>Clean component systems, responsive behavior, and maintainable code.</span>
          </article>
          <article>
            <strong>Launch Visibility</strong>
            <span>Instrumentation and post-launch data to guide improvements.</span>
          </article>
        </div>

        <div className="filter-row" role="tablist" aria-label="Project filters">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              className={filter === item ? "chip active" : "chip"}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="case-wall">
          {filtered.map((project, index) => (
            <article className="case-card" key={project.title + index}>
              <div className="case-image-wrap">
                <img src={project.image} alt={project.title} loading="lazy" />
                <span className="case-id">#{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="case-content">
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
    </div>
  );
}
