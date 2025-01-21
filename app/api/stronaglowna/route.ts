// /app/api/stronaglowna/route.ts
import { NextResponse } from 'next/server';
import { ensureProductsTableExists, ensureReviewsTableExists } from '@/app/db'; 
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client); // Połączenie z bazą danych

export async function GET() {
  try {
    const productsTable = await ensureProductsTableExists(); // Upewnij się, że tabela Products istnieje

    const products = await db.select().from(productsTable).execute(); // Pobranie danych z tabeli

    // Dodanie średniego ratingu dla każdego produktu
    const productsWithRatings = await Promise.all(products.map(async (product) => {
      const averageRating = await calculateAverageRating(product.id);
      return { ...product, rating: averageRating };
    }));

    return NextResponse.json({ products: productsWithRatings });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Unable to fetch products' }, { status: 500 });
  }
}

export async function calculateAverageRating(productId: number): Promise<number> {
  try {
    const reviewsTable = await ensureReviewsTableExists(); // Upewnij się, że tabela Reviews istnieje

    const ratings = await db
      .select({ rating: reviewsTable.rating })
      .from(reviewsTable)
      .where(eq(reviewsTable.product_id, productId))
      .execute();

    if (ratings.length === 0) return 0;

    const totalRating = ratings.reduce((sum, review) => sum + Number(review.rating), 0);
    // Zaokrąglamy średnią ocenę do jednej cyfry po przecinku
    const averageRating = totalRating / ratings.length;
    return parseFloat(averageRating.toFixed(1));
  } catch (error) {
    console.error('Error calculating average rating:', error);
    throw new Error('Unable to calculate average rating');
  }
}
