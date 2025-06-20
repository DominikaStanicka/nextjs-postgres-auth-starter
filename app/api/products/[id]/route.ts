// /app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { ensureProductsTableExists, ensureReviewsTableExists } from '@/app/db';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { calculateAverageRating } from '@/app/api/products/lib/calculateAverageRating';

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const productId = Number(params.id);

  if (isNaN(productId)) {
    return NextResponse.json({ error: 'Nieprawidłowy identyfikator produktu' }, { status: 400 });
  }

  try {
    const productsTable = await ensureProductsTableExists();
    const reviewsTable = await ensureReviewsTableExists();

    const product = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, productId))
      .execute();

    if (product.length === 0) {
      return NextResponse.json({ error: 'Produkt nie znaleziony' }, { status: 404 });
    }

    const reviews = await db
      .select({
        user_name: reviewsTable.user_name,
        review: reviewsTable.review,
        rating: reviewsTable.rating,
      })
      .from(reviewsTable)
      .where(eq(reviewsTable.product_id, productId))
      .execute();

    const averageRating = await calculateAverageRating(productId, db, reviewsTable);

    const responseData = {
      product: {
        id: product[0].id,
        name: product[0].name,
        description: product[0].description,
        image: product[0].image || '/default-image.jpg',
        rating: averageRating,
        reviews: reviews || [],
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json({ error: 'Błąd pobierania szczegółów produktu' }, { status: 500 });
  }
}
