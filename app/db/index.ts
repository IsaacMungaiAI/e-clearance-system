import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

if (!process.env.DATABASE_URL) {
  throw new Error(
    'Missing DATABASE_URL environment variable. Set DATABASE_URL to your Postgres connection string.'
  );
}

const client = postgres(process.env.DATABASE_URL, {
  prepare: false,
});

let dbInstance;
try {
  dbInstance = drizzle(client);
} catch (err) {
  // Re-throw with clearer context for devs
  throw new Error(`Failed to initialize database client: ${err}`);
}

export const db = dbInstance;
