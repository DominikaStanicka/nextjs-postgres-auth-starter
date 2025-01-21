// / app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { ensureProductsTableExists, ensureReviewsTableExists } from '@/app/db';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client); // Połączenie z bazą danych

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const productId = Number(params.id);

  if (isNaN(productId)) {
    return NextResponse.json({ error: 'Nieprawidłowy identyfikator produktu' }, { status: 400 });
  }

  try {
    const productsTable = await ensureProductsTableExists();
    const reviewsTable = await ensureReviewsTableExists();

    // Pobierz szczegóły produktu
    const product = await db.select().from(productsTable).where(eq(productsTable.id, productId)).execute();

    if (product.length === 0) {
      return NextResponse.json({ error: 'Produkt nie znaleziony' }, { status: 404 });
    }

    // Oblicz średnią ocenę
    const averageRating = await calculateAverageRating(productId);

    // Pobierz recenzje dla produktu
    const reviews = await db
      .select({
        user_name: reviewsTable.user_name,
        review: reviewsTable.review,
        rating: reviewsTable.rating,
      })
      .from(reviewsTable)
      .where(eq(reviewsTable.product_id, productId))
      .execute();

    // Przygotuj dane do odpowiedzi
    const responseData = {
      product: {
        id: product[0].id,
        name: product[0].name,
        description: product[0].description,
        image: product[0].image || '/default-image.jpg',
        rating: averageRating,  // Zwracamy średni rating
        reviews: reviews || [],
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json({ error: 'Błąd pobierania szczegółów produktu' }, { status: 500 });
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
