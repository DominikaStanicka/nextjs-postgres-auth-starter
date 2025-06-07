//api/products/lib/calculateAverageRating.ts
import { eq } from 'drizzle-orm';

export async function calculateAverageRating(productId: number, db: any, reviewsTable: any): Promise<number> {
  try {
    const ratings = await db
      .select({ rating: reviewsTable.rating })
      .from(reviewsTable)
      .where(eq(reviewsTable.product_id, productId))
      .execute();

    if (ratings.length === 0) return 0;

    const totalRating = ratings.reduce((sum: number, review: any) => sum + Number(review.rating), 0);
    const averageRating = totalRating / ratings.length;
    return parseFloat(averageRating.toFixed(1));
  } catch (error) {
    console.error('Error calculating average rating:', error);
    throw new Error('Unable to calculate average rating');
  }
}