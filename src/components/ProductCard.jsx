"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { triggerWishlistUpdate } from "./WishList";
import { triggerCartUpdate } from "./CartIcon";

export function ProductCard({ id, name, price, imageUrl, stock}) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const isLoggedIn = false; // Replace with actual logic to check if user is logged in

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
    const product = { id, name, price, imageUrl, stock};
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
    loadStorageData(); // Update the state based on the changes in localStorage
    triggerCartUpdate();
  };

  return (
    <Link href={`/product/${id}`} passHref>
      <Card className="w-full max-w-xs mx-auto cursor-pointer hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden">
        <CardContent className="p-3">
          <div className="relative w-full h-40 overflow-hidden group rounded-md">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              layout="fill"
              objectFit="cover"
              className="rounded-md transform transition-transform duration-300 group-hover:scale-105"
            />

            <button
              onClick={handleWishlistClick}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition duration-200"
            >
              <Heart
                className={`h-5 w-5 ${
                  isInWishlist ? "fill-red-500 text-red-500" : "text-gray-500"
                }`}
              />
            </button>
          </div>
          <h3 className="text-base font-semibold mt-3 truncate">{name}</h3>
          <p className="text-gray-600 text-sm">${price?.toFixed(2)}</p>
        </CardContent>
        <CardFooter className="p-3">
          <Button
            onClick={handleAddToCart}
            className={`w-full py-1 text-sm hover:bg-primary/90 transition duration-200 ${
              isInCart ? "bg-gray-700" : ""
            }`}
          >
            {isInCart ? "Remove from Cart" : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
