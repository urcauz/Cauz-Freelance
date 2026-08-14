import clientPromise from "@/lib/mongodb";

export type Lead = { name: string; email: string; message: string; createdAt: string };

export async function createLead(value: unknown) {
  const input = value as Partial<Lead>;
  const lead: Lead = { name: String(input.name ?? "").trim().slice(0, 100), email: String(input.email ?? "").trim().slice(0, 150), message: String(input.message ?? "").trim().slice(0, 2000), createdAt: new Date().toISOString() };
  if (!lead.name || !/^\S+@\S+\.\S+$/.test(lead.email) || !lead.message) throw new Error("Please add your name, a valid email, and a message.");
  const client = await clientPromise;
  if (!client) throw new Error("Could not connect to MongoDB.");
  await client.db("cauz_portfolio").collection<Lead>("leads").insertOne(lead);
  return lead;
}

export async function getLeads() {
  const client = await clientPromise;
  if (!client) throw new Error("Could not connect to MongoDB.");
  const leads = await client.db("cauz_portfolio").collection<Lead>("leads").find({}).sort({ createdAt: -1 }).limit(50).toArray();
  return leads.map(({ _id, ...lead }) => lead);
}
