import type { Project } from "@/lib/portfolio-data";
import clientPromise from "@/lib/mongodb";
import { projects as starterProjects } from "@/lib/portfolio-data";

const collectionName = "projects";

function isProject(value: unknown): value is Project {
  if (!value || typeof value !== "object") return false;
  const project = value as Partial<Project>;
  return Boolean(
    typeof project.name === "string" &&
      typeof project.description === "string" &&
      typeof project.live === "string" &&
      typeof project.github === "string" &&
      Array.isArray(project.stack)
  );
}

export async function getProjects() {
  const client = await clientPromise;
  if (!client) return starterProjects;

  const collection = client.db("cauz_portfolio").collection<Project>(collectionName);
  const existing = await collection.find({}).sort({ order: 1, _id: 1 }).toArray();

  if (existing.length) {
    const existingProjects = existing.map(({ _id, ...project }) => project);
    const existingNames = new Set(existing.map((project) => project.name));
    const missing = starterProjects.filter((project) => !existingNames.has(project.name));
    if (missing.length) {
      const lastOrder = Math.max(...existing.map((project) => project.order ?? -1), -1);
      await collection.insertMany(missing.map((project, index) => ({ ...project, order: lastOrder + index + 1 })));
      return [...existingProjects, ...missing.map((project, index) => ({ ...project, order: lastOrder + index + 1 }))];
    }
    return existingProjects;
  }

  await collection.insertMany(starterProjects.map((project, order) => ({ ...project, order })));
  return starterProjects;
}

export async function createProject(value: unknown) {
  if (!isProject(value)) {
    throw new Error("Please provide a name, description, links, and at least one stack item.");
  }

  const project: Project = {
    name: value.name.trim().slice(0, 80),
    description: value.description.trim().slice(0, 300),
    live: value.live.trim(),
    github: value.github.trim(),
    stack: value.stack.map((item) => String(item).trim().slice(0, 40)).filter(Boolean).slice(0, 8)
  };

  if (!project.name || !project.description || !project.live || !project.github || !project.stack.length) {
    throw new Error("Please complete every project field.");
  }

  const client = await clientPromise;
  if (!client) return project;

  const collection = client.db("cauz_portfolio").collection<Project>(collectionName);
  const lastProject = await collection.find({}).sort({ order: -1 }).limit(1).next();
  await collection.insertOne({ ...project, order: (lastProject?.order ?? -1) + 1 });
  return project;
}
