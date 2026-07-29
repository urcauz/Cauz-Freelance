import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

const globalForMongo = global as typeof globalThis & {
  mongoClient?: Promise<MongoClient | null>;
};

const createMongoClient = async () => {
  if (!uri) return null;

  try {
    return await new MongoClient(uri, { serverSelectionTimeoutMS: 5000 }).connect();
  } catch (error) {
    console.warn("MongoDB connection unavailable. Falling back to local testimonial data.", error);
    return null;
  }
};

const clientPromise = globalForMongo.mongoClient ?? createMongoClient();

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = clientPromise;
}

export default clientPromise;
