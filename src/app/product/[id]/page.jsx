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
  const [cartItems, setCartItems] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `/api/productinfo?productId=${params.id}`
        );
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
  console.log(product);

  const handleCart = () => {
    const existingCart = JSON.parse(window.localStorage.getItem("cart")) || [];
    const isInCart = existingCart.some((item) => item._id === product._id);

    if (!isInCart) {
      const updatedCart = [...existingCart, product];
      window.localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      triggerCartUpdate();
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 mt-10">
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="w-5 h-5 text-gray-400" />
              <Link
                href="/product"
                className="ml-1 text-gray-700 hover:text-blue-600 md:ml-2"
              >
                Products
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <ChevronRight className="w-5 h-5 text-gray-400" />
              <span className="ml-1 text-gray-500 md:ml-2">{product.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative overflow-hidden rounded-lg">
          <Image
            src={product.images?.[0] || "/placeholder.svg"} // Safe access with fallback
            alt={product.name || "Product image"}
            width={800}
            height={600}
            className="w-full h-auto transition-transform duration-300"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold mb-4">
            ${product.price.toFixed(2)}
          </p>
          <p className="mb-4">{product.description}</p>
          {/* <div className="mb-4">
            <span className="font-semibold">Category:</span> {product.category}
          </div> */}
          <div className="mb-4">
            <span className="font-semibold">Availability:</span>
            {product.inStock ? (
              <span className="text-green-600 ml-2">In Stock</span>
            ) : (
              <span className="text-red-600 ml-2">Out of Stock</span>
            )}
          </div>
          <div className="flex items-center mb-4">
            <span className="font-semibold mr-4">Quantity:</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={!product.inStock}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="mx-4 text-xl">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
              disabled={!product.inStock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleCart}
            className="w-full"
            disabled={!product.inStock}
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
