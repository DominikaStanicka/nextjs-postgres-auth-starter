// /app/api/stronaglowna/route.ts
import { NextResponse } from 'next/server';
import { ensureProductsTableExists, ensureReviewsTableExists } from '@/app/db'; 
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { calculateAverageRating } from '../products/lib/calculateAverageRating';

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function GET() {
  try {
    const productsTable = await ensureProductsTableExists();
    const reviewsTable = await ensureReviewsTableExists();

    const products = await db.select().from(productsTable).execute();

    // Dodanie średniego ratingu dla każdego produktu
    const productsWithRatings = await Promise.all(products.map(async (product) => {
      const averageRating = await calculateAverageRating(product.id, db, reviewsTable);
      return { ...product, rating: averageRating };
    }));

    return NextResponse.json({ products: productsWithRatings });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Unable to fetch products' }, { status: 500 });
  }
}
