"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import Container from '@/components/Container';
import { ProductCard } from '@/components/ProductCard';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/product');
        setProducts(response.data.products); 
        console.log(response.data.products)
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-12">Loading products...</p>;
  if (error) return <p className="text-center mt-12 text-red-500">{error}</p>;

  return (
    <Container className="px-4 mt-12">
      <main className="mx-auto py-8 max-w-[1400px]">
        <h1 className="text-3xl font-semibold mb-8 text-center">Our Products</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>
    </Container>
  );
};

export default ProductPage;
