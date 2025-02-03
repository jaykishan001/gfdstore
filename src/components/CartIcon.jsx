// "use client";
// import { ShoppingBagIcon } from "lucide-react";
// import Link from "next/link";
// import React, { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import axios from "axios";

// const CartIcon = () => {
//   const { data: session } = useSession(); 
//   const [cartItemNumber, setCartItemNumber] = useState(0);
//   const userId = session?.user;

//   async function fetchCart() {
//     if (userId) {
//       try {

//         const res = await axios(`http://localhost:3000/api/users?id=${session.user.id}`); 
//         setCartItemNumber(res.data.cart.length);
//       } catch (error) {
//         console.error("Error fetching cart:", error);
//       }
//     } else {
//       const cart = JSON.parse(window.localStorage.getItem("cart")) || [];
//       setCartItemNumber(cart.length);
//     }
//   }

//   useEffect(() => {
//     fetchCart();

//     const handleCartChange = () => {
//       fetchCart();
//     };
//     window.addEventListener("cartUpdated", handleCartChange);

//     return () => {
//       window.removeEventListener("cartUpdated", handleCartChange);
//     };
//   }, [session]); 

//   return (
//     <Link href={"/cart"} className="group relative">
//       <ShoppingBagIcon className="w-5 h-5 group-hover:text-darkColor hoverEffect" />
//       {cartItemNumber > 0 && (
//         <span className="absolute -top-1 -right-1 bg-darkColor text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
//           {cartItemNumber}
//         </span>
//       )}
//     </Link>
//   );
// };

// export default CartIcon;

// export const triggerCartUpdate = () => {
//   window.dispatchEvent(new Event("cartUpdated"));
// };


"use client";
import { ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const CartIcon = () => {
  const { data: session } = useSession(); 
  const [cartItemNumber, setCartItemNumber] = useState(0);

  async function fetchCart() {
    if (session?.user) {
      try {
        const res = await axios.get(`/api/cart?userId=${session.user.id}`);
        
        setCartItemNumber(res.data.cart.product.length);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    } else {
      const cart = JSON.parse(window.localStorage.getItem("cart")) || [];
      setCartItemNumber(cart.length);
    }
  }

  useEffect(() => {
    fetchCart();

    const handleCartChange = () => {
      fetchCart();
    };
    window.addEventListener("cartUpdated", handleCartChange);

    return () => {
      window.removeEventListener("cartUpdated", handleCartChange);
    };
  }, [session]);

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
