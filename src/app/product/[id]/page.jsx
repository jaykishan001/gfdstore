"use client";

import { triggerCartUpdate } from "@/components/CartIcon";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ChevronRight, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function ProductPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/productinfo?productId=${params.id}`);
        setProduct(response.data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        notFound();
      }
    };
    fetchProduct();
  }, [params.id]);

  // useEffect(() => {
  //   const fetchRelatedProducts = async () => {
  //     if (!product) return;
  //     try {
  //       const response = await axios.get(
  //         `/api/productsbycategory?categoryId=679bb82f0986d45a7bd07b8c`
  //       );
  //       setRelatedProducts(
  //         response.data.data.filter((p) => p._id !== product._id).slice(0, 10)
  //       );
  //     } catch (error) {
  //       console.error("Error fetching related products:", error);
  //     }
  //   };

  //   fetchRelatedProducts();
  // }, [product]);

  if (!product) return null;

  // const handleCart = () => {
  //   const existingCart = JSON.parse(window.localStorage.getItem("cart")) || [];
  //   const cartItem = { ...product, quantity, size: selectedSize };

  //   const updatedCart = [...existingCart.filter(item => item._id !== product._id || item.size !== selectedSize), cartItem];
  //   window.localStorage.setItem("cart", JSON.stringify(updatedCart));
  //   setCartItems(updatedCart);
  //   triggerCartUpdate();
  // };

  const handleCart = () => {
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }
  
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const uniqueKey = `${product._id}-${selectedSize}`;
  
    const existingItemIndex = cart.findIndex((item) => item.uniqueKey === uniqueKey);
  
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        uniqueKey,
        _id: product._id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        quantity,
        image: product.images[0] || "/placeholder.svg",
      });
    }
  
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartItems(cart);
    triggerCartUpdate();
  };
  

  return (
    <div className="container mx-auto py-8 px-4 mt-10 max-w-6xl">
      <nav className="flex mb-6 text-sm">
        <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
        <ChevronRight className="w-5 h-5 text-gray-400 mx-2" />
        <Link href="/product" className="text-gray-700 hover:text-blue-600">Products</Link>
        <ChevronRight className="w-5 h-5 text-gray-400 mx-2" />
        <span className="text-gray-500">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative rounded-lg overflow-hidden h-[400px]">
          <Image src={product.images?.[0] ?? "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-xl font-semibold text-green-600">${product.price.toFixed(2)}</p>
          <p className="text-gray-700">{product.description}</p>

          <div className="flex items-center space-x-2">
            <span className="font-semibold">Availability:</span>
            <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
          </div>

          {product.sizeOptions?.length > 0 && (
            <div className="flex space-x-2 items-center">
              <span className="font-semibold">Size:</span>
              {product.sizeOptions.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg">{quantity}</span>
            <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={handleCart} className="w-full mt-4" disabled={!product.stock || !selectedSize}>
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
