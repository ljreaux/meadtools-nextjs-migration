import { PrismaClient } from "@prisma/client";

const dbUrl =
  process.env.NODE_ENV === "production"
    ? process.env.SUPABASE_DATABASE_URL
    : process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error(
    `Database URL not found. Make sure ${
      process.env.NODE_ENV === "production"
        ? "SUPABASE_DATABASE_URL"
        : "DATABASE_URL"
    } is defined in the .env file.`
  );
}

const prisma = new PrismaClient({
  datasources: {
    db: { url: dbUrl },
  },
});

export default prisma;
