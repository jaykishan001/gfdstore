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
import { removeproduct, updateQuantity } from "../../../actions/cart";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isCouponValid, setIsCouponValid] = useState(true);
  const [isCouponPopoverOpen, setIsCouponPopoverOpen] = useState(false);

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
            size: item.size, // Store selected size
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
          size: item.size || "N/A", // Default size if not set
        }));
        setCartItems(validCart);
      }
    };
    fetchCart();
  }, [session, status]);

  const updateQuantity1 = async (newQuantity, item) => {
    if (newQuantity < 1 || isNaN(newQuantity)) return;
    const itemid = item._id;
    if (session) {
      await updateQuantity(newQuantity, itemid);
    } else {
      const updatedCart = cartItems.map((cartItem) => {
        return cartItem._id === item._id
          ? { ...cartItem, quantity: Number(newQuantity) }
          : cartItem;
      });
      updateCartStorage(updatedCart);
    }
  };

  const updateCartStorage = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    triggerCartUpdate();
  };

  const removeItem = async (item) => {
    if (session) {
      const id = item._id;
      const update = await removeproduct(id);
    } else {
      let updatedCart = cartItems.filter((cartItem) => cartItem._id !== item._id);
      updateCartStorage(updatedCart);
    }
  };

  const applyCoupon = () => {
    // Example: validating coupon code
    const validCoupons = {
      "DISCOUNT10": 10, // 10% discount
      "DISCOUNT20": 20, // 20% discount
    };

    if (validCoupons[couponCode.toUpperCase()]) {
      setIsCouponValid(true);
      setDiscount(validCoupons[couponCode.toUpperCase()]);
    } else {
      setIsCouponValid(false);
      setDiscount(0);
    }
    setIsCouponPopoverOpen(false);
  };

  const handleCouponChange = (event) => {
    const newCouponCode = event.target.value;
    setCouponCode(newCouponCode);
    if (!newCouponCode) {
      setDiscount(0);
      setIsCouponValid(true); // Reset to original price when coupon code is cleared
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountedTotal = total - (total * (discount / 100));

  return (
    <>
      {cartItems.length > 0 ? (
        <div className="container mx-auto p-6 min-h-screen pt-24">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Shopping Cart</h1>
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
                    <h3 className="text-lg font-semibold text-gray-700">{item.name}</h3>
                    <p className="text-gray-500 text-sm">{item.description}</p>
                    <p className="text-gray-500 mt-2">${item.price.toFixed(2)}</p>
                    <p className="text-gray-500 mt-2">Size: {item.size}</p> {/* Show size */}
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
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Order Summary</h2>
              <Separator className="my-4" />
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const originalPrice = item.price * item.quantity;
                  const discountedPrice = originalPrice - (originalPrice * (discount / 100));

                  return (
                    <div key={item._id} className="flex justify-between text-gray-700">
                      <span>
                        {item.name} x {item.quantity} (Size: {item.size}) {/* Show selected size */}
                      </span>
                      {discount > 0 ? (
                        <>
                          <span>
                            <del className="text-red-500">${originalPrice.toFixed(2)}</del> 
                            <span className="text-green-500 ml-2">${discountedPrice.toFixed(2)}</span>
                          </span>
                        </>
                      ) : (
                        <span>${originalPrice.toFixed(2)}</span> // Only show original price if no discount
                      )}
                    </div>
                  );
                })}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                {discount > 0 ? (
                  <>
                    <del className="text-red-500">${total.toFixed(2)}</del>
                    <span className="text-green-500 ml-2">${discountedTotal.toFixed(2)}</span>
                  </>
                ) : (
                  <span>${total.toFixed(2)}</span> // Only show original price if no discount
                )}
              </div>
              {discount > 0 && (
                <p className="text-green-500 mt-2">Discount Applied: {discount}%</p> // Discount applied message
              )}
              <Button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold shadow-md">
                Proceed to Checkout
              </Button>
              {/* Apply Coupon Link */}
              <div className="mt-4 text-sm text-gray-600 cursor-pointer" onClick={() => setIsCouponPopoverOpen(true)}>
                <Link href="#">Apply Coupon</Link>
              </div>
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

      {/* Coupon Popover */}
      {isCouponPopoverOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-semibold">Enter Coupon Code</h2>
            <input
              type="text"
              value={couponCode}
              onChange={handleCouponChange}
              className="border border-gray-300 p-2 mt-2 w-full"
              placeholder="Coupon Code"
            />
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={applyCoupon}>
                Apply
              </Button>
              <Button variant="ghost" onClick={() => setIsCouponPopoverOpen(false)}>
                Close
              </Button>
            </div>
            {isCouponValid === false && (
              <p className="text-red-500 mt-2">Invalid coupon code</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default CartPage;
