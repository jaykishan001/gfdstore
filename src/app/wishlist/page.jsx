"use client";
import { triggerCartUpdate } from "@/components/CartIcon";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { triggerWishlistUpdate } from "@/components/WishList";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const WishListPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      const storedWishlist =
        JSON.parse(window.localStorage.getItem("wishlist")) || [];
      setWishlist(storedWishlist);

      const storedCart = JSON.parse(window.localStorage.getItem("cart")) || [];
      setCart(storedCart);
    }
  }, [isLoggedIn]);

  const removeFromWishlist = (_id) => {
    console.log("Removed product with ID:", _id);
    const updatedWishlist = wishlist.filter((item) => item._id !== _id);
    window.localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setWishlist(updatedWishlist);
    triggerWishlistUpdate();
  };

  const addToCart = (product) => {
    console.log("Added product with ID:", product._id, "to cart");

    const existingCart = JSON.parse(window.localStorage.getItem("cart")) || [];

    const isInCart = existingCart.some((item) => item._id === product?._id);

    if (!isInCart) {
      const updatedCart = [...existingCart, product];
      window.localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
      triggerCartUpdate();
    }
  };

  return (
    <Container>
      <div className="mt-32 px-4">
        <h1 className="text-2xl font-semibold mb-6">My Wishlist</h1>
        <div className="border w-full p-6 rounded-lg shadow-md bg-white">
          {wishlist?.length === 0 ? (
            <div className="container flex flex-col items-center mx-auto p-6 max-h-screen pt-24 space-y-2 h-[100vh] justify-center">
              <h1 className="text-4xl font-bold">Missing Cart items</h1>
              <p className="text-2xl">Login to see the items you added</p>
              <Button variant="outline" className="text-lg">
                Login
              </Button>
            </div>
          ) : (
            wishlist.map((product) => {
              const isInCart = cart.some((item) => item._id === product._id);

              return (
                <div
                  key={product._id}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b p-4 last:border-b-0"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="hidden sm:block text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>

                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p className="text-gray-600">${product.price.toFixed(2)}</p>
                  </div>

                  <p
                    className={`text-sm ${
                      product.stock ? "text-green-500" : "text-red-500"
                    } w-full sm:w-auto text-center sm:text-left`}
                  >
                    {product.stock ? "In Stock" : "Out of Stock"}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <Button
                      onClick={() => addToCart(product)}
                      disabled={!product.stock || isInCart}
                      className={`w-full sm:w-auto px-4 py-2 rounded-md ${
                        isInCart
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      {isInCart ? "Product Added" : "Add to Cart"}
                    </Button>

                    <Button
                      onClick={() => removeFromWishlist(product._id)}
                      variant="outline"
                      className="w-full sm:hidden px-4 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Container>
  );
};
export default WishListPage;
