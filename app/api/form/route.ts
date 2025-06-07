// /app/api/form/route.ts
import { NextResponse } from 'next/server';
import { ensureProductsTableExists, ensureReviewsTableExists } from '@/app/db';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { auth } from 'app/auth';

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function GET() {
  try {
    const productsTable = await ensureProductsTableExists();
    const products = await db.select().from(productsTable).execute();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Błąd pobierania produktów' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { product_id, rating, review } = await request.json();

    // Walidacja 
    if (
      !Number.isInteger(rating) || rating < 1 || rating > 5 ||
      typeof review !== 'string' || review.trim() === '' || review.length > 500
    ) {
      return NextResponse.json(
        { error: 'Nieprawidłowe dane: sprawdź poprawność pola rating (1-5) i review (max 500 znaków)' },
        { status: 400 }
      );
    }

    const session = await auth();
    const username = session?.user?.name || 'Anonim';

    const reviewsTable = await ensureReviewsTableExists();
    const productsTable = await ensureProductsTableExists();

    // Sprawdź, czy produkt istnieje
    const productExists = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, product_id))
      .execute();

    if (productExists.length === 0) {
      return NextResponse.json({ error: 'Produkt nie istnieje' }, { status: 400 });
    }

    // Dodaj recenzję do bazy
    await db.insert(reviewsTable).values({
      product_id,
      user_name: username,
      rating,
      review,
    });

    return NextResponse.json({ message: 'Recenzja została dodana pomyślnie!' });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json({ error: 'Błąd dodawania recenzji' }, { status: 500 });
  }
}
