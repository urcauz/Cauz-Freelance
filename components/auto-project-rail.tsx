"use client";

import type { CSSProperties } from "react";
import type { Project } from "@/lib/portfolio-data";
import { ProjectCard } from "@/components/project-card";

export function AutoProjectRail({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  const duration = Math.max(projects.length * 5, 36);
  const style = { "--project-scroll-duration": `${duration}s` } as CSSProperties;

  return (
    <div className="work-rail" aria-label="Selected projects — hover to pause">
      <div className="work-rail-track" style={style}>
        {[...projects, ...projects].map((project, index) => (
          <ProjectCard key={`${project.name}-${index}`} project={project} index={index % projects.length} />
        ))}
      </div>
    </div>
  );
}
