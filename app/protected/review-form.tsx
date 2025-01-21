// /app/protected/review-form.tsx
// //------------------------------------------------------------------------------------------------------------------------------------------------
// "use client";
// import Layout from '@/app/components/Layout';
// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react"; // Importowanie hooka do zarządzania sesją

// export default function ReviewForm() {
//   const { data: session, status } = useSession();  // Pobranie sesji
//   const [products, setProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState<string>("");
//   const [rating, setRating] = useState<number | "">("");
//   const [review, setReview] = useState<string>("");
//   const [message, setMessage] = useState<string>("");

//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const response = await fetch("/api/form");
//         const data = await response.json();
//         if (data.products) {
//           setProducts(data.products);
//         }
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     }

//     fetchProducts();
//   }, []);

//   if (status === "loading") {
//     return <p>Ładowanie...</p>; // Możesz dodać loading spinner
//   }

//   if (!session) {
//     return <p>Proszę się zalogować, aby dodać recenzję.</p>; // Informacja dla niezalogowanych użytkowników
//   }

//   async function handleSubmit(event: React.FormEvent) {
//     event.preventDefault();
//     try {
//       const response = await fetch("/api/form", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           product_id: selectedProduct,
//           rating,
//           review,
//         }),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         setMessage("Recenzja została dodana pomyślnie!");
//         setSelectedProduct("");
//         setRating("");
//         setReview("");
//       } else {
//         setMessage(result.error || "Wystąpił błąd.");
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error);
//       setMessage("Wystąpił błąd podczas dodawania recenzji.");
//     }
//   }

//   return (
//     <Layout>
//       <div className="max-w-md mx-auto mt-8">
//         <h2 className="text-2xl font-bold mb-4">Dodaj recenzję</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="product" className="block text-sm font-medium text-gray-700">
//               Wybierz produkt
//             </label>
//             <select
//               id="product"
//               name="product"
//               value={selectedProduct}
//               onChange={(e) => setSelectedProduct(e.target.value)}
//               required
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
//             >
//               <option value="" disabled>
//                 Wybierz produkt
//               </option>
//               {products.map((product: any) => (
//                 <option key={product.id} value={product.id}>
//                   {product.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
//               Ocena (1-5)
//             </label>
//             <input
//               id="rating"
//               name="rating"
//               type="number"
//               min="1"
//               max="5"
//               value={rating}
//               onChange={(e) => setRating(Number(e.target.value))}
//               required
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
//             />
//           </div>
//           <div>
//             <label htmlFor="review" className="block text-sm font-medium text-gray-700">
//               Recenzja
//             </label>
//             <textarea
//               id="review"
//               name="review"
//               rows={4}
//               value={review}
//               onChange={(e) => setReview(e.target.value)}
//               required
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
//             ></textarea>
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-pink-400 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800"
//           >
//             Dodaj recenzję
//           </button>
//         </form>
//         {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
//       </div>
//     </Layout>
//   );
// }
