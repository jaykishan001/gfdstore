"use client";
import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const CartIcon = () => {
  const [cartItemNumber, setCartItemNumber] = useState(0);

  function updateCart() {
    const cart = JSON.parse(window.localStorage.getItem("cart")) || [];
    setCartItemNumber(cart.length);
  }

  useEffect(() => {
    updateCart();

    const handleCartChange = () => {
      updateCart();
    };
    window.addEventListener("cartUpdated", handleCartChange);
    return () => {
      window.removeEventListener("cartUpdated", handleCartChange);
    };
  }, []);

  return (
    <Link href={"/cart"} className="group relative">
      <ShoppingBagIcon className="w-5 h-5 group-hover:text-darkColor hoverEffect" />
      {cartItemNumber > 0 && (
        <span className="absolute -top-1 -right-1 bg-darkColor text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
          {cartItemNumber}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;

export const triggerCartUpdate = () => {
  window.dispatchEvent(new Event("cartUpdated"));
};
