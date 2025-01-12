"use client";

import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/app/components/Layout';
import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/stronaglowna');
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Witaj na Polecajka.pl</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <div key={product.id} className="border rounded p-4 shadow">
            <Link href={`/products/${product.id}`}>
              <div className="flex justify-center mb-4">
                <Image
                  src={product.image || '/default-image.jpg'}
                  alt={product.name}
                  height={300}
                  width={300}
                  className="rounded object-cover"
                />
              </div>
            </Link>
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-700">{product.description}</p>
            <p className="text-yellow-500">Rating: {product.rating}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}
