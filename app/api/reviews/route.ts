import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { auth } from "app/auth";
import { ensureReviewsTableExists } from "@/app/db";

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.name) {
      return NextResponse.json({ error: "Nie jesteś zalogowany" }, { status: 401 });
    }

    const username = session.user.name;
    const reviewsTable = await ensureReviewsTableExists();

    // Pobieramy tylko recenzje danego użytkownika
    const userReviews = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.user_name, username));

    return NextResponse.json({ reviews: userReviews });
  } catch (error) {
    console.error("Błąd podczas pobierania recenzji:", error);
    return NextResponse.json({ error: "Błąd podczas pobierania recenzji" }, { status: 500 });
  }
}
