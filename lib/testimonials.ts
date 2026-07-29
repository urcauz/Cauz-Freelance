import clientPromise from "@/lib/mongodb";

export type Testimonial = { quote: string; name: string; role: string; order?: number };

const starterTestimonials: Testimonial[] = [
  { quote: "Cauz has an unusually sharp eye for the small details that make an idea feel complete—he notices the bits others miss and makes them feel intentional.", name: "A future collaborator", role: "Client note" },
  { quote: "Great products feel effortless because someone sweat the invisible stuff. Cauz cares about that invisible stuff.", name: "A good project", role: "Work philosophy" },
  { quote: "He turned a vague idea into a polished experience faster than I expected and communicated every step clearly.", name: "Product Manager, BrightApp", role: "Client" },
  { quote: "Working with Cauz felt like having a thoughtful partner who genuinely wanted the best outcome for users.", name: "Founder, Leaf & Co.", role: "Client" },
  { quote: "The quality of work was top tier — clean, reliable, and delivered on time. I’d hire him again in a heartbeat.", name: "Design Lead, Nova", role: "Client" },
  { quote: "He asks the right questions early, which saved us weeks of rework and a lot of designer-developer friction.", name: "CTO, Parkside", role: "Client" },
  { quote: "Cauz balances creativity with pragmatism. He ships beautiful solutions that actually scale.", name: "Engineer, Flux Labs", role: "Colleague" },
  { quote: "He brought structure to a messy codebase and made it feel maintainable again without sacrificing speed.", name: "Team Lead, Orion", role: "Client" },
  { quote: "Beyond execution, he helped shape product decisions with thoughtful trade-offs and clear rationale.", name: "PM, Studio Nine", role: "Client" },
  { quote: "Friendly, dependable, and detail-oriented — the kind of person you want on every project.", name: "Independent Contractor", role: "Peer" },
  { quote: "From concept to launch he kept momentum high and morale higher. Results spoke for themselves.", name: "CEO, Ember", role: "Client" }
];

let fallbackTestimonials: Testimonial[] = starterTestimonials.map((testimonial, order) => ({ ...testimonial, order }));

function normalizeTestimonial(value: Partial<Testimonial>): Testimonial {
  return {
    quote: String(value.quote ?? "").trim().slice(0, 500),
    name: String(value.name ?? "").trim().slice(0, 90),
    role: String(value.role ?? "").trim().slice(0, 100)
  };
}

function nextOrder() {
  return fallbackTestimonials.reduce((maxOrder, testimonial) => Math.max(maxOrder, testimonial.order ?? 0), -1) + 1;
}

export async function getTestimonials() {
  try {
    const client = await clientPromise;
    if (!client) return fallbackTestimonials;

    const collection = client.db("cauz_portfolio").collection<Testimonial>("testimonials");
    const existing = await collection.find({}).sort({ order: 1, _id: 1 }).toArray();
    if (existing.length) {
      const normalized = existing.map(({ _id, ...testimonial }) => ({
        ...testimonial,
        order: testimonial.order ?? 0
      }));
      fallbackTestimonials = normalized;
      return normalized;
    }

    const seededTestimonials = starterTestimonials.map((testimonial, order) => ({ ...testimonial, order }));
    await collection.insertMany(seededTestimonials);
    fallbackTestimonials = seededTestimonials;
    return seededTestimonials;
  } catch (error) {
    console.warn("Falling back to starter testimonials.", error);
    return fallbackTestimonials;
  }
}

export async function createTestimonial(value: unknown) {
  const testimonial = normalizeTestimonial(value as Partial<Testimonial>);
  if (!testimonial.quote || !testimonial.name) throw new Error("A quote and client name are required.");

  try {
    const client = await clientPromise;
    if (!client) {
      const persistedTestimonial = { ...testimonial, order: nextOrder() };
      fallbackTestimonials = [...fallbackTestimonials, persistedTestimonial];
      return testimonial;
    }

    const collection = client.db("cauz_portfolio").collection<Testimonial>("testimonials");
    const last = await collection.find({}).sort({ order: -1 }).limit(1).next();
    await collection.insertOne({ ...testimonial, order: (last?.order ?? -1) + 1 });
    fallbackTestimonials = [...fallbackTestimonials, { ...testimonial, order: (last?.order ?? -1) + 1 }];
    return testimonial;
  } catch (error) {
    const persistedTestimonial = { ...testimonial, order: nextOrder() };
    fallbackTestimonials = [...fallbackTestimonials, persistedTestimonial];
    return testimonial;
  }
}


