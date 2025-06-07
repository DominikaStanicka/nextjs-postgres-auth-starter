//api/reviews/[id]/route.ts
import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and } from "drizzle-orm";
import { auth } from "app/auth";
import { ensureReviewsTableExists } from "@/app/db";

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const reviewId = Number(params.id);
    if (isNaN(reviewId)) {
      return NextResponse.json({ error: "Nieprawidłowe ID" }, { status: 400 });
    }

    const reviewsTable = await ensureReviewsTableExists();
    const review = await db.select().from(reviewsTable).where(eq(reviewsTable.id, reviewId)).limit(1);

    if (review.length === 0) {
      return NextResponse.json({ error: "Recenzja nie znaleziona" }, { status: 404 });
    }

    return NextResponse.json(review[0]);
  } catch (error) {
    console.error("Błąd podczas pobierania recenzji:", error);
    return NextResponse.json({ error: "Błąd podczas pobierania recenzji" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    const username = session?.user?.name;
    if (!username) {
      return NextResponse.json({ error: "Nie jesteś zalogowany" }, { status: 401 });
    }

    const reviewId = Number(params.id);
    if (isNaN(reviewId)) {
      return NextResponse.json({ error: "Nieprawidłowe ID" }, { status: 400 });
    }

    const data = await request.json();
    const { product_id, rating, review } = data;
    if (!product_id || !rating || !review) {
      return NextResponse.json({ error: "Brak wymaganych danych" }, { status: 400 });
    }

    const reviewsTable = await ensureReviewsTableExists();

    // Aktualizujemy tylko, jeśli recenzja należy do zalogowanego użytkownika
    const updateResult = await db
      .update(reviewsTable)
      .set({ product_id, rating, review })
      .where(and(eq(reviewsTable.id, reviewId), eq(reviewsTable.user_name, username)))
      .returning();

    if (updateResult.length === 0) {
      return NextResponse.json({ error: "Recenzja nie znaleziona lub brak uprawnień" }, { status: 404 });
    }

    return NextResponse.json({ message: "Recenzja zaktualizowana" });
  } catch (error) {
    console.error("Błąd podczas aktualizacji recenzji:", error);
    return NextResponse.json({ error: "Błąd podczas aktualizacji recenzji" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    const username = session?.user?.name;
    if (!username) {
      return NextResponse.json({ error: "Nie jesteś zalogowany" }, { status: 401 });
    }

    const reviewId = Number(params.id);
    if (isNaN(reviewId)) {
      return NextResponse.json({ error: "Nieprawidłowe ID" }, { status: 400 });
    }

    const reviewsTable = await ensureReviewsTableExists();

    const deleteResult = await db
      .delete(reviewsTable)
      .where(and(eq(reviewsTable.id, reviewId), eq(reviewsTable.user_name, username)))
      .returning();

    if (deleteResult.length === 0) {
      return NextResponse.json({ error: "Nie znaleziono recenzji lub brak uprawnień" }, { status: 404 });
    }

    return NextResponse.json({ message: "Recenzja usunięta pomyślnie" });
  } catch (error) {
    console.error("Błąd podczas usuwania recenzji:", error);
    return NextResponse.json({ error: "Błąd podczas usuwania recenzji" }, { status: 500 });
  }
}
function returning() {
  throw new Error("Function not implemented.");
}

