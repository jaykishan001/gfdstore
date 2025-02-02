"use client";
import { triggerCartUpdate } from "@/components/CartIcon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Minus, Plus, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    const fetchCart = async () => {
      if (session) {
        try {
          const response = await axios.get(
            `/api/cart?userId=${session?.user?.id}`
          );
          const products = response.data.cart.products.map((item) => ({
            _id: item.productId._id,
            name: item.productId.name,
            description: item.productId.description,
            price: item.productId.price,
            quantity: item.quantity,
          }));
          setCartItems(products);
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      } else {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        const validCart = storedCart.map((item) => ({
          ...item,
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0,
        }));
        setCartItems(validCart);
      }
    };
    fetchCart();
  }, [session, status]);

  const updateQuantity1 = async (newQuantity, item) => {
    if (newQuantity < 1 || isNaN(newQuantity)) return;
    const itemid = item._id;

    try {
      if (session) {
        // Updating cart in the backend
        await axios.put(`/api/cart`, {
          quantity: newQuantity,
          productId: itemid,
        });

        // After updating, re-fetch the cart items to update the state
        const response = await axios.get(
          `/api/cart?userId=${session?.user?.id}`
        );
        const products = response.data.cart.products.map((item) => ({
          _id: item.productId._id,
          name: item.productId.name,
          description: item.productId.description,
          price: item.productId.price,
          quantity: item.quantity,
        }));
        setCartItems(products);
      } else {
        // Updating cart in localStorage
        const updatedCart = cartItems.map((cartItem) => {
          if (cartItem._id === item._id) {
            return { ...cartItem, quantity: Number(newQuantity) };
          }
          return cartItem;
        });

        updateCartStorage(updatedCart);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const updateCartStorage = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    triggerCartUpdate();
  };

  const removeItem = async (item) => {
    try {
      if (session) {
        await axios.delete("/api/cart", {
          data: { productId: item._id }, // Correct way to send data in DELETE request
        });

        // After removing, re-fetch the cart items to update the state
        const response = await axios.get(
          `/api/cart?userId=${session?.user?.id}`
        );
        const products = response.data.cart.products.map((item) => ({
          _id: item.productId._id,
          name: item.productId.name,
          description: item.productId.description,
          price: item.productId.price,
          quantity: item.quantity,
        }));
        setCartItems(products);
      } else {
        let updatedCart;
        if (item.uniqueKey) {
          updatedCart = cartItems.filter(
            (cartItem) => cartItem.uniqueKey !== item.uniqueKey
          );
        } else {
          updatedCart = cartItems.filter(
            (cartItem) => cartItem._id !== item._id
          );
        }

        updateCartStorage(updatedCart);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };
  const encodedCartData = encodeURIComponent(JSON.stringify(cartItems));

  return (
    <>
      {cartItems.length > 0 ? (
        <div className="container mx-auto p-6 min-h-screen pt-24">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Your Shopping Cart
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 bg-white p-6 rounded-lg shadow-lg w-full"
                >
                  <Image
                    src="/placeholder.svg"
                    alt={item.name}
                    width={120}
                    height={120}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <div className="flex flex-col flex-grow text-center md:text-left">
                    <h3 className="text-lg font-semibold text-gray-700">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{item.description}</p>
                    <p className="text-gray-500 mt-2">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity1(item.quantity - 1, item)}
                    >
                      <Minus className="h-4 w-4 text-gray-600" />
                    </Button>
                    <span className="w-10 text-center text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity1(item.quantity + 1, item)}
                    >
                      <Plus className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item)}
                    className="text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg h-fit">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Order Summary
              </h2>
              <Separator className="my-4" />
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between text-gray-700"
                  >
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                {/* <span>${total.toFixed(2)}</span> */}
              </div>
              <Link href={`/order?cartData=${encodedCartData}`}>
                {" "}
                <Button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold shadow-md">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="container flex flex-col items-center mx-auto p-6 min-h-screen justify-center space-y-4">
          <h1 className="text-4xl font-bold">Your Cart is Empty</h1>
          <Link href="/shop">
            <Button variant="outline" className="text-lg">
              Go Shopping
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}

export default CartPage;
