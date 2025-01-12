// app/products/[id]/page.tsx
"use client";

import { useParams } from 'next/navigation';
import Layout from '@/app/components/Layout';
import Image from 'next/image';
import { products } from '@/app/data/products';  // Import danych

export default function ProductDetail() {
    const { id } = useParams();  // Pobranie id z URL
    const product = products.find((product) => product.id.toString() === id);
  
    if (!product) {
      return <div>Produkt nie znaleziony</div>;
    }
  
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-full max-w-md p-4 border rounded shadow">
              {/* Wycentrowanie obrazka */}
              <div className="flex justify-center mb-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="rounded object-cover"
                />
              </div>
              <h2 className="text-2xl font-semibold">{product.name}</h2>
              <p className="text-gray-700">{product.description}</p>
  
              <div className="mt-4">
                <h3 className="font-semibold">Ocena: {product.rating.toString()} / 5</h3>
                <div className="mt-2">
                  <h4 className="font-semibold">Recenzje:</h4>
                  <ul>
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((review, index) => (
                        <li key={index} className="mt-2">
                          <strong>{review.user}</strong>: {review.review}
                        </li>
                      ))
                    ) : (
                      <li>Brak recenzji</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  