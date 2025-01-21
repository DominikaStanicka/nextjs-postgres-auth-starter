"use client";

import { useEffect, useState } from 'react';
import Layout from '@/app/components/Layout';
import Image from 'next/image';

export default function ProductDetail({params} : {params: {id: string}}) {
  const { id } = params;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error('Produkt nie znaleziony');
        }
        const data = await res.json();
        setProduct(data.product);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
                  {product.reviews.length > 0 ? (
                    product.reviews.map((review: any, index: number) => (
                      <li key={index} className="mt-2">
                        <strong>{review.user_name}</strong>: {review.review}
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
