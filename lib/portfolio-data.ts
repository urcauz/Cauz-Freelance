export type TechGroup = {
  label: string;
  note: string;
  items: string[];
};

export type Project = {
  name: string;
  description: string;
  stack: string[];
  live: string;
  github: string;
  order?: number;
  offsetClass?: string;
};

export type PortfolioData = {
  heroStats: Array<{ value: string; label: string }>;
  techGroups: TechGroup[];
  projects: Project[];
};

export const heroStats = [
  { value: "apps", label: "interfaces that stay clear under pressure" },
  { value: "bots", label: "automation with a human touch" },
  { value: "systems", label: "small tools that keep growing cleanly" }
];

export const aboutCopy =
  "I build the kind of software I actually enjoy using: direct, fast, and a little imperfect in a way that feels human. Most of the work ends up somewhere between product UI, bot logic, and practical automation.";

export const techGroups: TechGroup[] = [
  {
    label: "Frontend",
    note: "Interfaces that stay light and responsive.",
    items: ["Next.js App Router", "React", "TypeScript", "TailwindCSS", "Framer Motion"]
  },
  {
    label: "Backend",
    note: "Practical server logic and integrations.",
    items: ["Route Handlers", "Webhooks", "Node.js", "Auth flows", "Queue jobs"]
  },
  {
    label: "Data",
    note: "Simple storage choices that scale cleanly.",
    items: ["PostgreSQL", "Prisma", "Supabase", "Redis", "JSON tooling"]
  },
  {
    label: "Automation",
    note: "Small systems that remove repetition.",
    items: ["Discord bots", "Telegram bots", "Cron tasks", "Browser automation", "Email flows"]
  },
  {
    label: "Ops",
    note: "Fast shipping without drama.",
    items: ["Vercel", "GitHub Actions", "Analytics", "DNS", "Perf tuning"]
  }
];

export const projects: Project[] = [
  {
    name: "WasherOS",
    description:
      "A streamlined site for WasherOS with a simple public-facing flow and a clean deployment-ready presence.",
    stack: ["JavaScript", "Vercel", "Web UI", "Frontend"],
    live: "https://washer-os.vercel.app",
    github: "https://github.com/Ur-cauz/WasherOS",
    offsetClass: "lg:translate-y-4"
  },
  {
    name: "Luminote",
    description:
      "A real-time note-taking app with collaborative editing, Markdown support, and AI-generated summaries.",
    stack: ["Collaboration", "Notes", "AI", "Realtime UX"],
    live: "https://luminote.vercel.app",
    github: "https://github.com/Ur-cauz/Luminote",
    offsetClass: "lg:translate-y-12"
  },
  {
    name: "ESP32 Game Box",
    description:
      "A web-based interactive game controller for ESP32, with physical buttons, LEDs, and a mobile-friendly control layer.",
    stack: ["C++", "Hardware", "Responsive UI", "Embedded"],
    live: "https://github.com/Ur-cauz/ESP32-Game-Box",
    github: "https://github.com/Ur-cauz/ESP32-Game-Box",
    offsetClass: "lg:-translate-y-2"
  },
  {
    name: "MHSCU Tools",
    description:
      "A small utility-focused project built to keep common tasks and student workflows a little more manageable.",
    stack: ["JavaScript", "Utilities", "Productivity", "Web"],
    live: "https://github.com/Ur-cauz/MHSCU-Tools",
    github: "https://github.com/Ur-cauz/MHSCU-Tools",
    offsetClass: "lg:translate-y-8"
  },
  {
    name: "Discord Bot For Freelancer",
    description:
      "A practical Discord bot made to help freelancers protect their work and keep project communication under control.",
    stack: ["JavaScript", "Discord Bot", "Automation", "Workflow"],
    live: "https://github.com/Ur-cauz/Discord-Bot-For-Freelancer",
    github: "https://github.com/Ur-cauz/Discord-Bot-For-Freelancer",
    offsetClass: "lg:-translate-y-4"
  },

{
    name: "CJAM",
    description:
      "A compact ESP32 development board designed for 2.4 GHz experimentation, embedded development, RF learning, and wireless security research.",
    stack: ["C++", "Hardware", "PCB desining", "Creative engineering"],
    live: "https://github.com/Ur-cauz/CJAM/blob/main/README.md",
    github: "https://github.com/Ur-cauz/CJAM",
    offsetClass: "lg:-translate-y-4"
  },

  {
    name: "GTVIWEBPAGE",
    description:
      "A polished landing page for the GTA WebPage project, with a live deployment and a straightforward visual direction.",
    stack: ["JavaScript", "Landing Page", "Vercel", "UI"],
    live: "https://gtawebpage.vercel.app",
    github: "https://github.com/Ur-cauz/GTVIWEBPAGE",
    offsetClass: "lg:translate-y-6"
  }


];

export const portfolioData: PortfolioData = {
  heroStats,
  techGroups,
  projects
};

export const contactLinks = [
  { label: "Email", href: "mailto:urcauzz@gmail.com" },
  { label: "GitHub", href: "https://github.com/Ur-cauz" }
];

export const footerNote = "Man idk why i built this, but here you go. Hope this does the work well. >''< :p";
