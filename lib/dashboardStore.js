import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const EVENTS_FILE = path.join(DATA_DIR, "events.json");
const MAX_LEADS = 1200;
const MAX_EVENTS = 5000;

async function ensureStore(filePath) {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]", "utf8");
  }
}

async function readStore(filePath) {
  await ensureStore(filePath);
  const raw = await fs.readFile(filePath, "utf8");

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeStore(filePath, records) {
  await ensureStore(filePath);
  await fs.writeFile(filePath, JSON.stringify(records, null, 2), "utf8");
}

export async function readLeads() {
  return readStore(LEADS_FILE);
}

export async function readAnalyticsEvents() {
  return readStore(EVENTS_FILE);
}

export async function appendLead(leadRecord) {
  const leads = await readLeads();
  const next = [leadRecord, ...leads].slice(0, MAX_LEADS);
  await writeStore(LEADS_FILE, next);
  return leadRecord;
}

export async function appendAnalyticsEvent(eventRecord) {
  const events = await readAnalyticsEvents();
  const next = [eventRecord, ...events].slice(0, MAX_EVENTS);
  await writeStore(EVENTS_FILE, next);
  return eventRecord;
}

export async function readDashboardData() {
  const [leads, events] = await Promise.all([readLeads(), readAnalyticsEvents()]);
  return { leads, events };
}
