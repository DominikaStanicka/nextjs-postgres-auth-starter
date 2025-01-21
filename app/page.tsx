// /app/page.tsx
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
      <h1 className="text-3xl font-bold mb-6">Tylko szczere opinie!</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any) => (
        <div key={product.id} className="border rounded p-4 shadow flex flex-col justify-between h-full">
        <Link href={`/products/${product.id}`} className="flex justify-center">
          <Image
            src={product.image || '/default-image.jpg'}
            alt={product.name}
            height={200}
            width={200}
            className="rounded object-cover"
          />
        </Link>
        <div className="mt-auto text-center">
          <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
          <p className="text-gray-700 mt-1">{product.description}</p>
          <p className="text-yellow-500 mt-2">Rating: {product.rating}</p>
        </div>
      </div>

        ))}
      </div>
    </Layout>
  );
}
