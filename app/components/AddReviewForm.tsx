// /app/components/AddReviewForm.tsx
'use client';

import { useState } from 'react';

export default function AddReviewForm({ productId }: { productId: number }) {
  const [userName, setUserName] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!userName || !review || !rating) {
      setError('Wszystkie pola są wymagane.');
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_name: userName, review, rating: Number(rating) }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Wystąpił błąd.');
        return;
      }

      setError(null);
      setUserName('');
      setReview('');
      setRating('');
      alert('Recenzja dodana pomyślnie!');
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Wystąpił błąd.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label htmlFor="user_name" className="block text-sm font-medium text-gray-700">
          Twoje imię
        </label>
        <input
          id="user_name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="review" className="block text-sm font-medium text-gray-700">
          Twoja recenzja
        </label>
        <textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
          Ocena (1-5)
        </label>
        <input
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value ? Number(e.target.value) : '')}
          type="number"
          min="1"
          max="5"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-indigo-600 py-2 px-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Dodaj recenzję
      </button>
    </form>
  );
}
