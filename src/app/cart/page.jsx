"use client";
import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Product 1",
      price: 19.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1735078255510-a5455dfe9f22?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      name: "Product 2",
      price: 29.99,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1735078255510-a5455dfe9f22?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity >= 1) {
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = (event) => {
    event.preventDefault();
    console.log("Checkout Data:", cartItems);
    // Send cartItems to backend here (e.g., fetch API call)
  };

  return (
    <>
      {cartItems.length > 0 ? (
        <div className="container mx-auto p-6 max-h-screen pt-24 h-[100vh]">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Your Shopping Cart
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-6 bg-white p-6 rounded-lg shadow-lg"
                >
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={120}
                    height={120}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-700">
                      {item.name}
                    </h3>
                    <p className="text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-gray-100"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4 text-gray-600" />
                    </Button>
                    <span className="w-10 text-center text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-gray-100"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="text-red-500"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
            <form
              onSubmit={handleCheckout}
              className="bg-white p-6 rounded-lg shadow-lg h-fit"
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Order Summary
              </h2>
              <Separator className="my-4" />
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
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
                <span>${total.toFixed(2)}</span>
              </div>
              <input
                type="hidden"
                name="cartData"
                value={JSON.stringify(cartItems)}
              />
              <Button
                type="submit"
                className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold shadow-md transition-all"
              >
                Proceed to Checkout
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="container flex flex-col items-center mx-auto p-6 max-h-screen pt-24 space-y-2 h-[100vh] justify-center">
          <h1 className="text-4xl font-bold">Missing Cart items</h1>
          <p className="text-2xl">Login to see the items you added</p>
          <Button variant="outline" className="text-lg">
            Login
          </Button>
        </div>
      )}
    </>
  );
}

export default CartPage;
