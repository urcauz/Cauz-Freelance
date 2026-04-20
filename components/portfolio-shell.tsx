"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { PortfolioData } from "@/lib/portfolio-data";
import { aboutCopy, contactLinks, footerNote } from "@/lib/portfolio-data";
import { ProjectCard } from "@/components/project-card";

type PortfolioShellProps = {
  data: PortfolioData;
};

export function PortfolioShell({ data }: PortfolioShellProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="page-shell portfolio-grid">
      <aside className="sticky-panel">
        <header className="stacked-header">
          <Link href="#top" className="brand-mark" aria-label="Cauz portfolio home">
            <span className="brand-dot" />
            <span className="brand-copy">
              <span className="brand-name">Cauz</span>
              <span className="brand-subtitle">Full Stack Developer</span>
            </span>
          </Link>

          <p className="sidebar-note">Apps, bots, and automation systems.</p>
        </header>

        <div className="sidebar-block">
          <p className="section-kicker">Profile</p>
          <p className="sidebar-copy">{aboutCopy}</p>
        </div>

        <div className="sidebar-block">
          <p className="section-kicker">Focus</p>
          <div className="sidebar-pills">
            {["Frontend", "Backend", "Automation", "Data"].map((item) => (
              <span key={item} className="stack-chip">
                {item}
              </span>
            ))}
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Primary">
          <a className="nav-link" href="#projects">
            Selected work
          </a>
          <a className="nav-link" href="#about">
            Stack
          </a>
          <a className="nav-link" href="#contact">
            Contact
          </a>
        </nav>

        <div className="sidebar-block sidebar-contact">
          <p className="section-kicker">Contact</p>
          <a className="contact-link w-full justify-center" href="mailto:urcauzz@gmail.com">
            urcauzz@gmail.com
          </a>
          <a className="contact-link w-full justify-center" href="https://github.com/Ur-cauz" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </aside>

      <main className="content-column">
        <motion.section
          id="top"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="hero-shell"
        >
          <div className="section-inner hero-layout">
            <div className="hero-copy-block">
              <p className="section-kicker">Independent work, built with care</p>
              <h1 className="hero-title mt-4">Cauz</h1>
              <p className="mt-4 text-lg font-medium uppercase tracking-[0.24em] text-white/70">
                Full Stack Developer
              </p>
              <p className="hero-lede mt-6">Building apps, bots, and automation systems.</p>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60">
                I like practical interfaces, honest engineering, and small details that make a site feel like
                someone actually cared while building it.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a className="soft-button-primary" href="#projects">
                  View projects
                </a>
                <a className="soft-button" href="#contact">
                  Contact
                </a>
              </div>
            </div>

            <div className="hero-card">
              <div className="hero-card-top">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.32em] text-white/50">Current focus</p>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.64rem] uppercase tracking-[0.22em] text-white/70">
                  Hands-on
                </span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm text-white/50">Shipping</p>
                  <p className="mt-2 text-xl font-semibold tracking-[-0.04em] text-white">
                    apps that feel personal, not assembled.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {data.heroStats.map((stat) => (
                    <div key={stat.label} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                      <p className="text-xl font-semibold text-white">{stat.value}</p>
                      <p className="mt-2 text-[0.72rem] leading-5 text-white/50">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <section id="about" className="panel-shell">
          <div className="section-inner">
            <div className="section-head-tight">
              <p className="section-kicker">About</p>
              <h2 className="panel-title">How I like to build.</h2>
              <p className="panel-copy max-w-2xl">{aboutCopy}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {data.techGroups.map((group, index) => (
                <motion.article
                  key={group.label}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  whileHover={reduceMotion ? undefined : { y: -2 }}
                  className={`stack-group ${index % 2 === 0 ? "md:translate-y-2" : ""} ${index === 2 ? "md:translate-y-5" : ""}`}
                >
                  <p className="stack-group-label">{group.label}</p>
                  <p className="mt-3 text-sm leading-6 text-white/60">{group.note}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="stack-chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="panel-shell">
          <div className="section-inner">
            <div className="section-head-tight">
              <p className="section-kicker">Selected Work</p>
              <h2 className="panel-title">Projects that stay readable and fast.</h2>
              <p className="panel-copy max-w-2xl">
                The layout is intentionally more editorial than grid-heavy so the work feels curated, not dumped
                into a template.
              </p>
            </div>

            <div className="project-stack">
              {data.projects.map((project, index) => (
                <ProjectCard key={project.name} project={project} index={index} featured={index === 0} />
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="panel-shell">
          <div className="section-inner contact-layout">
            <div>
              <p className="section-kicker">Contact</p>
              <h2 className="panel-title">If you want to talk code, systems, or a weird idea worth building, say hello.</h2>
              <p className="panel-copy mt-3 max-w-2xl">
                No sales pitch, no pricing page, no agency fluff. Just a simple way to reach me.
              </p>
            </div>

            <div className="contact-card">
              <a className="contact-link" href="mailto:urcauzz@gmail.com">
                urcauzz@gmail.com
              </a>
              <a className="contact-link" href="https://github.com/Ur-cauz" target="_blank" rel="noreferrer">
                GitHub
              </a>
              <p className="contact-footnote">{footerNote}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
