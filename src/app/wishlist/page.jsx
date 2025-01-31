"use client"
import Container from '@/components/Container';
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WishListPage = () => {
  const products = [
    { id: '1', name: 'Product 1', price: 19.99, stock: true, imageUrl: 'https://images.unsplash.com/photo-1735078255510-a5455dfe9f22?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: '2', name: 'Product 2', price: 29.99, stock: false, imageUrl: 'https://images.unsplash.com/photo-1735078255510-a5455dfe9f22?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: '3', name: 'Product 3', price: 29.99, stock: true, imageUrl: 'https://images.unsplash.com/photo-1735078255510-a5455dfe9f22?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: '4', name: 'Product 4', price: 29.99, stock: true, imageUrl: 'https://images.unsplash.com/photo-1735078255510-a5455dfe9f22?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: '5', name: 'Product 5', price: 29.99, stock: false, imageUrl: 'https://images.unsplash.com/photo-1735078255510-a5455dfe9f22?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  ];

  const removeFromWishlist = (id) => {
    console.log('Removed product with ID:', id);
  };

  const addToCart = (id) => {
    console.log('Added product with ID:', id, 'to cart');
  };

  return (
    <Container>
      <div className='mt-32 px-4'>
        <h1 className='text-2xl font-semibold mb-6'>My Wishlist</h1>
        <div className='border w-full p-6 rounded-lg shadow-md bg-white'>
          {products.map((product) => (
            <div key={product.id} className='flex flex-col sm:flex-row items-center justify-between gap-4 border-b p-4 last:border-b-0'>
              {/* Left Section: Image and Delete Icon (hidden on small screens) */}
              <div className='flex items-center gap-4 w-full sm:w-auto'>
                <button 
                  onClick={() => removeFromWishlist(product.id)} 
                  className='hidden sm:block text-red-500 hover:text-red-700'
                >
                  <Trash2 size={20} />
                </button>

                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className='w-16 h-16 object-cover rounded-md'
                />
              </div>

              {/* Middle Section: Product Details */}
              <div className='flex-1 w-full sm:w-auto text-center sm:text-left'>
                <h2 className='text-lg font-semibold'>{product.name}</h2>
                <p className='text-gray-600'>${product.price.toFixed(2)}</p>
              </div>

              {/* Stock Status */}
              <p className={`text-sm ${product.stock ? 'text-green-500' : 'text-red-500'} w-full sm:w-auto text-center sm:text-left`}>
                {product.stock ? 'In Stock' : 'Out of Stock'}
              </p>

              {/* Right Section: Add to Cart and Remove Button (visible on small screens) */}
              <div className='flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto'>
                {/* Add to Cart Button */}
                <Button
                  onClick={() => addToCart(product.id)}
                  disabled={!product.stock}
                  className='w-full sm:w-auto px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md disabled:bg-gray-400'
                >
                  Add to Cart
                </Button>

                {/* Remove Button (visible on small screens) */}
                <Button
                  onClick={() => removeFromWishlist(product.id)}
                  variant="outline"
                  className='w-full sm:hidden px-4 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md'
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default WishListPage;