// app/order/page.jsx
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import GuestForm from "./GuestForm";
import OrderForm from "./OrderForm";

export default async function OrderPage({ searchParams }) {
  const { cartData } = await searchParams;

  const session = await getServerSession(authOptions);

  let cartDataParsed = null;
  if (cartData) {
    try {
      const decodedCartData = decodeURIComponent(cartData);
      cartDataParsed = JSON.parse(decodedCartData);
    } catch (error) {
      console.error("Failed to decode cartData:", error);
    }
  }

  if (!cartDataParsed) {
    return <div>Loading or no cart data found...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Complete Your Order</h1>
      {session?.user ? (
        <OrderForm session={session} cartData={cartDataParsed} />
      ) : (
        <GuestForm cartData={cartDataParsed} />
      )}
    </div>
  );
}
