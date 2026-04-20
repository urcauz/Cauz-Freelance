"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type SectionShellProps = {
  id: string;
  eyebrow: string;
  title: string;
  copy?: string;
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
};

export function SectionShell({
  id,
  eyebrow,
  title,
  copy,
  children,
  align = "left",
  className = ""
}: SectionShellProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={`panel-shell ${className}`}
    >
      <div className="section-inner">
        <div className={`mb-8 flex flex-col gap-4 ${align === "right" ? "items-end text-right" : ""}`}>
          <p className="section-kicker">{eyebrow}</p>
          <h2 className="panel-title max-w-3xl">{title}</h2>
          {copy ? <p className="panel-copy max-w-3xl">{copy}</p> : null}
        </div>
        {children}
      </div>
    </motion.section>
  );
}
