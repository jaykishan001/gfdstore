"use client";
import { HeartIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const WishList = () => {
  const [wishListNumber, setWishlistNumber] = useState(0);

  const updateWishlistCount = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistNumber(wishlist.length);
  };

  useEffect(() => {
    updateWishlistCount();

    const handleWishlistChange = () => {
      updateWishlistCount();
    };
    window.addEventListener("wishlistUpdated", handleWishlistChange);

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistChange);
    };
  }, []);

  return (
    <Link href="/wishlist" className="group relative">
      <HeartIcon className="w-5 h-5 group-hover:text-darkColor hoverEffect" />
      {wishListNumber > 0 && (
        <span className="absolute -top-1 -right-1 bg-darkColor text-white h-4 w-4 rounded-full text-xs font-semibold flex items-center justify-center">
          {wishListNumber}
        </span>
      )}
    </Link>
  );
};

export const triggerWishlistUpdate = () => {
  window.dispatchEvent(new Event("wishlistUpdated"));
};

export default WishList;
