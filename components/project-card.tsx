"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/portfolio-data";

type ProjectCardProps = {
  project: Project;
  index: number;
  featured?: boolean;
};

export function ProjectCard({ project, index, featured = false }: ProjectCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { y: -2 }}
      whileTap={reduceMotion ? undefined : { scale: 0.995 }}
      transition={{ type: "spring", stiffness: 220, damping: 28 }}
      className={`project-card ${featured ? "project-card-featured" : ""} ${project.offsetClass ?? ""}`}
    >
      <div className="project-row">
        <div className="project-row-lead">
          <p className="project-kicker">0{index + 1}</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-white">{project.name}</h3>
          <p className="mt-4 text-sm leading-7 text-white/70">{project.description}</p>
        </div>

        <div className="project-row-side">
          <div className="project-row-meta">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.67rem] uppercase tracking-[0.2em] text-white/50">
              Live
            </span>
            <span className="text-[0.67rem] uppercase tracking-[0.26em] text-white/40">01</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span key={item} className="project-chip">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a className="project-link" href={project.live} target="_blank" rel="noreferrer">
              <span>Live link</span>
              <span aria-hidden="true">↗</span>
            </a>
            <a className="project-link" href={project.github} target="_blank" rel="noreferrer">
              <span>GitHub</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
