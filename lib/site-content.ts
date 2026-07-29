import clientPromise from "@/lib/mongodb";

export type SiteContent = {
  now: string;
  caseStudyTitle: string;
  caseStudyCopy: string;
  testimonial: string;
  testimonialName: string;
  contactEmail: string;
  notificationEmail: string;
  enabledCategories: string[];
};

export const defaultSiteContent: SiteContent = {
  now: "Currently tinkering with web tools, automation experiments, and anything that makes everyday work feel less repetitive.",
  caseStudyTitle: "The interesting problems are usually hiding in plain sight.",
  caseStudyCopy: "I like taking an awkward workflow, finding the real friction, then turning it into something people genuinely enjoy using.",
  testimonial: "Cauz has an unusually sharp eye for the small details that make an idea feel complete.",
  testimonialName: "A future collaborator",
  contactEmail: "urcauzz@gmail.com",
  notificationEmail: "",
  enabledCategories: ["Web", "Automation", "Bots", "Hardware"]
};

export async function getSiteContent(): Promise<SiteContent> {
  const client = await clientPromise;
  if (!client) return defaultSiteContent;

  const collection = client.db("cauz_portfolio").collection<SiteContent>("site_content");
  const content = await collection.findOne({});
  if (content) {
    const { _id, ...value } = content;
    return { ...defaultSiteContent, ...value };
  }
  await collection.insertOne(defaultSiteContent);
  return defaultSiteContent;
}

export async function updateSiteContent(value: unknown): Promise<SiteContent> {
  const content = value as Partial<SiteContent>;
  const next: SiteContent = {
    now: String(content.now ?? "").trim().slice(0, 500),
    caseStudyTitle: String(content.caseStudyTitle ?? "").trim().slice(0, 140),
    caseStudyCopy: String(content.caseStudyCopy ?? "").trim().slice(0, 700),
    testimonial: String(content.testimonial ?? "").trim().slice(0, 500),
    testimonialName: String(content.testimonialName ?? "").trim().slice(0, 100),
    contactEmail: String(content.contactEmail ?? "").trim().slice(0, 150),
    notificationEmail: String(content.notificationEmail ?? "").trim().slice(0, 150),
    enabledCategories: Array.isArray(content.enabledCategories) ? content.enabledCategories.map(String).map((item) => item.trim().slice(0, 32)).filter(Boolean).slice(0, 10) : []
  };
  const client = await clientPromise;
  if (!client) return next;

  await client.db("cauz_portfolio").collection<SiteContent>("site_content").replaceOne({}, next, { upsert: true });
  return next;
}
