"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { triggerWishlistUpdate } from "./WishList";
import { triggerCartUpdate } from "./CartIcon";

export function ProductCard({ id, name, price, images, stock, sizeOptions }) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const imageUrl = images[0];

  const isLoggedIn = false;

  const loadStorageData = () => {
    const wishlist = JSON.parse(window.localStorage.getItem("wishlist")) || [];
    const cart = JSON.parse(window.localStorage.getItem("cart")) || [];
    setIsInWishlist(wishlist.some((item) => item.id === id));
    setIsInCart(cart.some((item) => item.id === id));
  };

  useEffect(() => {
    loadStorageData();
  }, [id]);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    const product = { id, name, price, imageUrl, stock };
    const wishlist = JSON.parse(window.localStorage.getItem("wishlist")) || [];

    if (isInWishlist) {
      const updatedWishlist = wishlist.filter((item) => item.id !== id);
      window.localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    } else {
      wishlist.push(product);
      window.localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }

    setIsInWishlist(!isInWishlist);
    loadStorageData();
    triggerWishlistUpdate();
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    const product = { id, name, price, imageUrl };
    const cart = JSON.parse(window.localStorage.getItem("cart")) || [];

    if (isInCart) {
      const updatedCart = cart.filter((item) => item.id !== id);
      window.localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      cart.push(product);
      window.localStorage.setItem("cart", JSON.stringify(cart));
    }

    setIsInCart(!isInCart);
    loadStorageData();
    triggerCartUpdate();
  };

  return (
    <Link href={`/product/${id}`} passHref>
      <Card className="w-full max-w-xs mx-auto cursor-pointer hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden bg-white border border-gray-200">
        <CardContent className="p-4">
          <div className="relative w-full h-48 overflow-hidden group rounded-lg shadow-md">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg transform transition-transform duration-300 group-hover:scale-110"
            />

            <button
              onClick={handleWishlistClick}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition duration-200"
            >
              <Heart
                className={`h-5 w-5 ${
                  isInWishlist ? "fill-red-500 text-red-500" : "text-gray-500"
                }`}
              />
            </button>
          </div>

          <h3 className="text-lg font-semibold mt-3 truncate text-gray-800">{name}</h3>
          <p className="text-gray-600 text-sm">${price?.toFixed(2)}</p>
          <p className="text-gray-500 text-xs mt-1">{stock > 0 ? `${stock} in stock` : "Out of stock"}</p>
        </CardContent>

        <CardFooter className="p-4 flex flex-col space-y-2">
          <Button
            onClick={handleAddToCart}
            className={`w-full py-2 text-sm font-medium hover:bg-primary/90 transition duration-200 ${
              isInCart ? "bg-gray-700 text-white" : "bg-primary text-white"
            }`}
          >
            {isInCart ? "Remove from Cart" : "Add to Cart"}
          </Button>

          <Button
            onClick={handleWishlistClick}
            className="w-full py-2 text-sm font-medium bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200"
          >
            {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
