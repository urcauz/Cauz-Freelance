"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { PortfolioData } from "@/lib/portfolio-data";
import { aboutCopy, footerNote } from "@/lib/portfolio-data";
import { CustomCursor } from "@/components/custom-cursor";
import { AutoProjectRail } from "@/components/auto-project-rail";
import type { SiteContent } from "@/lib/site-content";
import type { Testimonial } from "@/lib/testimonials";
import { TestimonialRail } from "@/components/testimonial-rail";

type PortfolioShellProps = { data: PortfolioData; content: SiteContent; testimonials: Testimonial[] };
type PortfolioCopy = { title: string; intro: string };

const defaultCopy: PortfolioCopy = {
  title: "I make useful things feel like magic.",
  intro: "Hey, I’m Cauz. I build websites, playful tools, and systems that make a little more room for good ideas."
};

export function PortfolioShell({ data, content, testimonials }: PortfolioShellProps) {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 105, damping: 28, restDelta: 0.001 });
  const [copy, setCopy] = useState(defaultCopy);

  useEffect(() => {
    const saved = window.localStorage.getItem("cauz-portfolio-copy");
    if (!saved) return;
    try { setCopy({ ...defaultCopy, ...JSON.parse(saved) }); } catch { window.localStorage.removeItem("cauz-portfolio-copy"); }
  }, []);

  return (
    <main className="studio-page">
      <CustomCursor />
      <motion.div className="site-progress" style={{ scaleX: progress }} />

      <nav className="studio-nav">
        <Link href="#top" className="studio-logo" aria-label="Cauz home">CAUZ<span>®</span></Link>
        <div className="studio-nav-links" aria-label="Primary navigation">
          <a href="#work">Work</a><a href="#about">About</a><a href="#contact">Say hey</a>
        </div>
        <a href="#contact" className="nav-hello">Let’s build <span>↗</span></a>
      </nav>

      <section id="top" className="studio-hero">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: .8, ease: [0.22, 1, 0.36, 1] }} className="hero-copy"
        >
          <p className="eyebrow"><span /> Independent developer · available for curious work</p>
          <h1>{copy.title.split(" magic.")[0]} <em>magic.</em></h1>
          <p className="hero-intro">{copy.intro}</p>
          <div className="hero-actions">
            <a href="#work" className="button-ink">See what I’ve made <span>↓</span></a>
            <a href="#contact" className="text-link">Start a conversation <span>↗</span></a>
          </div>
        </motion.div>

        <motion.div initial={reduceMotion ? false : { opacity: 0, rotate: 6 }} animate={reduceMotion ? undefined : { opacity: 1, rotate: 0 }} transition={{ duration: 1, delay: .1 }} className="hero-object" aria-hidden="true">
          <div className="object-scribble">made<br />with<br />care</div>
          <div className="object-sphere"><div className="sphere-cut" /></div>
          <div className="object-window"><b>01</b><span>build<br />play<br />repeat</span></div>
          <div className="object-star">✦</div>
          <div className="object-label">web / systems / strange little ideas</div>
        </motion.div>
      </section>

      <div className="running-line" aria-hidden="true"><div>WEB EXPERIENCES <i>✦</i> USEFUL SYSTEMS <i>✦</i> GOOD INTERNET ENERGY <i>✦</i> WEB EXPERIENCES <i>✦</i> USEFUL SYSTEMS <i>✦</i> GOOD INTERNET ENERGY <i>✦</i></div></div>

      <section id="work" className="work-section">
        <div className="section-heading">
          <p className="eyebrow">A few recent bits</p>
          <h2>Stuff I’ve actually<br /><em>put into the world.</em></h2>
          <p>I like work with personality — clear enough to use without a manual, interesting enough to remember afterwards.</p>
        </div>
        <AutoProjectRail projects={data.projects} />
      </section>

      <section id="about" className="about-section">
        <div className="about-sticker">no<br />boring<br />bits</div>
        <div className="about-big-copy"><p className="eyebrow">How I work</p><h2>I’m into the overlap between <em>good taste</em> and things that just work.</h2></div>
        <div className="about-details">
          <p>{aboutCopy}</p>
          <div className="skill-list">
            {data.techGroups.map((group, index) => <div key={group.label}><span>0{index + 1}</span><strong>{group.label}</strong><small>{group.items.slice(0, 3).join(" · ")}</small></div>)}
          </div>
        </div>
      </section>

      <section className="now-section">
        <p className="eyebrow">Right now</p>
        <div><h2>{content.caseStudyTitle}</h2><p>{content.caseStudyCopy}</p></div>
        <aside><span>Currently</span><p>{content.now}</p></aside>
      </section>

      <TestimonialRail testimonials={testimonials} />

      <section id="contact" className="contact-section">
        <p className="eyebrow">Got something brewing?</p>
        <h2>Let’s make it<br /><em>really good.</em></h2>
        <a className="contact-email" href={`mailto:${content.contactEmail}`}>{content.contactEmail} <span>↗</span></a>
        <div className="contact-footer"><span>{footerNote}</span><a href="https://github.com/Ur-cauz" target="_blank" rel="noreferrer">GitHub ↗</a><span>© {new Date().getFullYear()} Cauz</span></div>
      </section>
    </main>
  );
}
