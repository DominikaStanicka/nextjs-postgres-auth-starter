"use client";
import Layout from '@/app/components/Layout';
import { useState, useEffect } from "react";
import { saveRecToCookie, getRecFromCookie } from '@/app/utils/cookieUtil';
import { signOut } from "next-auth/react";

interface Product {
  id: string;
  name: string;
}

interface Review {
  product_id: string;
  rating: number | "";
  review: string;
}

export default function ReviewForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [rating, setRating] = useState<number | "">("");
  const [review, setReview] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/form");//get
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  function handleSaveToCookie() {
    const reviewData: Review = {
      product_id: selectedProduct,
      rating,
      review,
    };
    saveRecToCookie(reviewData);
    setMessage("Recenzja została zapisana w ciasteczkach.");
  }

  function handleLoadFromCookie() {
    const savedReview = getRecFromCookie();
    if (savedReview) {
      setSelectedProduct(savedReview.product_id || "");
      setRating(savedReview.rating || "");
      setReview(savedReview.review || "");
      setMessage("Recenzja została wczytana z ciasteczek.");
    } else {
      setMessage("Brak zapisanej recenzji w ciasteczkach.");
    }
  }
  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/login" });  // Log out and redirect to login page
 };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      const response = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: selectedProduct,
          rating,
          review,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Recenzja została dodana pomyślnie!");
        setSelectedProduct("");
        setRating("");
        setReview("");
      } else {
        setMessage(result.error || "Wystąpił błąd.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setMessage("Wystąpił błąd podczas dodawania recenzji.");
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Dodaj recenzję</h2>
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
              <option value="" disabled>
                Wybierz produkt
              </option>
              {products.map((product: any) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
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
              onChange={(e) => setRating(Number(e.target.value))}
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
              className="flex-1 bg-pink-400 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800"
            >
              Dodaj recenzję
            </button>
            <button
              type="button"
              onClick={handleSaveToCookie}
              className="flex-1 bg-blue-400 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800"
            >
              Zapisz recenzję
            </button>
            <button
              type="button"
              onClick={handleLoadFromCookie}
              className="flex-1 bg-green-400 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800"
            >
              Wczytaj recenzję
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
      </div>
      <div className="mt-10 flex justify-center">
        <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
            Log Out
        </button>
      </div>
    </Layout>
  );
}
