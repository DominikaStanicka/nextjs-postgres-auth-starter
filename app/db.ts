// /app/db.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import { pgTable, serial, varchar, numeric } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { genSaltSync, hashSync } from 'bcrypt-ts';

let client = postgres(`${process.env.POSTGRES_URL!}?sslmode=require`);
let db = drizzle(client);

// Funkcja do zapewnienia istnienia tabeli Products
async function ensureProductsTableExists() {
  const result = await client`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'Products'
    );`;

  if (!result[0].exists) {
    await client`
      CREATE TABLE IF NOT EXISTS "Products" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255),
        rating NUMERIC(2, 1) NOT NULL
      );
    `;
  }

  const productsTable = pgTable('Products', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }),
    description: varchar('description', { length: 255 }),
    image: varchar('image', { length: 255 }),
    rating: numeric('rating', { precision: 2, scale: 1 }),
  });

  return productsTable;
}

// Funkcja do zapewnienia istnienia tabeli Reviews
async function ensureReviewsTableExists() {
  const result = await client`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'Reviews'
    );`;

  if (!result[0].exists) {
    await client`
      CREATE TABLE IF NOT EXISTS "Reviews" (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES "Products"(id) ON DELETE CASCADE,
        user_name VARCHAR(255) NOT NULL,
        review TEXT NOT NULL,
        rating NUMERIC(2, 1) NOT NULL
      );
    `;
  }

  const reviewsTable = pgTable('Reviews', {
    id: serial('id').primaryKey(),
    product_id: serial('product_id').notNull(),
    user_name: varchar('user_name', { length: 255 }),
    review: varchar('review', { length: 255 }),
    rating: numeric('rating', { precision: 2, scale: 1 }),
  });

  return reviewsTable;
}

// Funkcja do dodawania użytkownika do bazy danych
export async function getUser(email: string) {
  const users = await ensureTableExists();
  return await db.select().from(users).where(eq(users.email, email));
}

// Funkcja do tworzenia użytkownika w bazie danych
export async function createUser(email: string, password: string) {
  const users = await ensureTableExists();
  let salt = genSaltSync(10);
  let hash = hashSync(password, salt);

  return await db.insert(users).values({ email, password: hash });
}

// Funkcja zapewniająca istnienie tabeli Users
async function ensureTableExists() {
  const result = await client`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'User'
    );`;

  if (!result[0].exists) {
    await client`
      CREATE TABLE IF NOT EXISTS "User" (
        id SERIAL PRIMARY KEY,
        email VARCHAR(64) UNIQUE NOT NULL,
        password VARCHAR(64) NOT NULL
      );
    `;
  }

  const usersTable = pgTable('User', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 64 }),
    password: varchar('password', { length: 64 }),
  });

  return usersTable;
}

// Eksport funkcji zapewniających istnienie tabel
export { ensureProductsTableExists, ensureReviewsTableExists, ensureTableExists };
