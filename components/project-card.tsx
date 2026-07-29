"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/portfolio-data";

type ProjectCardProps = { project: Project; index: number; featured?: boolean };

export function ProjectCard({ project, index }: ProjectCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article whileHover={reduceMotion ? undefined : { y: -8, rotate: index % 2 ? -1 : 1 }} transition={{ type: "spring", stiffness: 220, damping: 19 }} className={`work-card work-card-${index + 1}`}>
      <div className="work-card-art" aria-hidden="true"><span className="card-shape-one" /><span className="card-shape-two" /><span className="card-shape-three" /><b>0{index + 1}</b></div>
      <div className="work-card-copy">
        <p>0{index + 1} — {project.stack[0]}</p>
        <h3>{project.name}</h3>
        <span>{project.description}</span>
        <div className="work-card-links"><a href={project.live} target="_blank" rel="noreferrer">Visit <i>↗</i></a><a href={project.github} target="_blank" rel="noreferrer">Code <i>↗</i></a></div>
      </div>
    </motion.article>
  );
}
