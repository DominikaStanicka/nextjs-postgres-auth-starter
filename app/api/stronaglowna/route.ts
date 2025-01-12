// /app/api/stronaglowna/route.ts
import { NextResponse } from 'next/server';
import { ensureProductsTableExists, ensureReviewsTableExists } from '@/app/db'; // Zakładamy, że tabele są definiowane tutaj
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';


const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client); // Połączenie z bazą danych

export async function GET() {
  try {
    const productsTable = await ensureProductsTableExists(); // Upewnij się, że tabela Products istnieje

    const products = await db.select().from(productsTable).execute(); // Pobranie danych z tabeli

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Unable to fetch products' }, { status: 500 });
  }
}

// Typowanie productId jako number
export async function calculateAverageRating(productId: number): Promise<number> {
  try {
    const reviewsTable = await ensureReviewsTableExists(); // Upewnij się, że tabela Reviews istnieje

    const ratings = await db
      .select({ rating: reviewsTable.rating })
      .from(reviewsTable)
      .where(eq(reviewsTable.product_id,productId))
      .execute();

    if (ratings.length === 0) return 0;

    const totalRating = ratings.reduce((sum, review) => sum + Number(review.rating), 0);

    return totalRating / ratings.length;
  } catch (error) {
    console.error('Error calculating average rating:', error);
    throw new Error('Unable to calculate average rating');
  }
}
