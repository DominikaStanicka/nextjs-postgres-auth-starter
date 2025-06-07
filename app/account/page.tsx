"use client";

import Layout from '@/app/components/Layout';
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

interface Product {
  id: string;
  name: string;
}

interface Review {
  id?: string;
  product_id: string;
  rating: number;
  review: string;
}

export default function ReviewForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [rating, setRating] = useState<string>(""); 
  const [review, setReview] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/form");
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    async function fetchUserReviews() {
      try {
        const response = await fetch("/api/reviews");
        const data = await response.json();
        if (response.ok && data.reviews) {
          setUserReviews(data.reviews);
        }
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      }
    }

    fetchProducts();
    fetchUserReviews();
  }, []);

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/login" });
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!selectedProduct || rating === "" || review.trim() === "") {
      setMessage("Proszę uzupełnić wszystkie pola.");
      return;
    }

    try {
      const payload = {
        product_id: selectedProduct,
        rating: Number(rating),
        review,
      };

      const response = await fetch(editingId ? `/api/reviews/${editingId}` : "/api/form", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(editingId ? "Recenzja została zaktualizowana!" : "Recenzja została dodana pomyślnie!");
        setSelectedProduct("");
        setRating("");
        setReview("");
        setEditingId(null);
        const updatedReviews = await fetch("/api/reviews").then(res => res.json());
        setUserReviews(updatedReviews.reviews || []);
      } else {
        setMessage(result.error || "Wystąpił błąd.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setMessage("Wystąpił błąd podczas dodawania recenzji.");
    }
  }

  function startEditing(review: Review) {
    setSelectedProduct(review.product_id);
    setRating(String(review.rating));
    setReview(review.review);
    setEditingId(review.id || null);
    setMessage("Tryb edycji recenzji.");
  }

  async function handleDelete(id: number | undefined) {
    if (id === undefined) return;

    if (!confirm("Czy na pewno chcesz usunąć tę recenzję?")) return;

    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setMessage("Recenzja została usunięta.");
        const updatedData = await fetch("/api/reviews", {
          credentials: "include",
        }).then(res => res.json());
        setUserReviews(updatedData.reviews || []);

        if (editingId !== null && editingId === String(id)) {
          setEditingId(null);
          setSelectedProduct("");
          setRating("");
          setReview("");
        }
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Błąd podczas usuwania recenzji.");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      setMessage("Wystąpił błąd podczas usuwania recenzji.");
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">{editingId ? "Edytuj recenzję" : "Dodaj recenzję"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="product" className="block text-sm font-medium text-gray-700">
              Wybierz produkt
            </label>
            <select
              id="product"
              name="product"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            >
              <option value="" disabled>Wybierz produkt</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
              Ocena (1-5)
            </label>
            <input
              id="rating"
              name="rating"
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-700">
              Recenzja
            </label>
            <textarea
              id="review"
              name="review"
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
            ></textarea>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700"
            >
              {editingId ? "Zapisz zmiany" : "Dodaj recenzję"}
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
      </div>

      <div className="max-w-2xl mx-auto mt-10">
        <h3 className="text-xl font-bold mb-4 text-center">Twoje recenzje</h3>
        {userReviews.length === 0 ? (
          <p className="text-center text-gray-500">Brak dodanych recenzji.</p>
        ) : (
          <ul className="space-y-4">
            {userReviews.map((rev) => {
              const productName = products.find(p => p.id === rev.product_id)?.name || "Nieznany produkt";
              return (
                <li key={rev.id || rev.product_id} className="border p-4 rounded-md shadow-sm">
                  <p className="font-semibold">{productName}</p>
                  <p>Ocena: {rev.rating}</p>
                  <p>Opinia: {rev.review}</p>
                  <button
                    onClick={() => startEditing(rev)}
                    className="mt-2 bg-customPurple text-white py-1 px-3 rounded hover:opacity-90"
                  >
                    Edytuj
                  </button>
                  <button
                    onClick={() => handleDelete(rev.id ? Number(rev.id) : undefined)}
                    className="ml-2 bg-red-500 text-white py-1 px-3 rounded hover:opacity-90"
                  >
                    Usuń
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Przycisk wyloguj się pod listą recenzji */}
        <div className="max-w-md mx-auto mt-10 flex">
          <button
            onClick={handleLogout}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-md hover:bg-purple-700"
          >
            Wyloguj się
          </button>
        </div>
      </div>
    </Layout>

  );
}
