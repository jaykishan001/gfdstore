"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import {
  BanknoteIcon as Bank,
  CurrencyIcon as CashIcon,
  CreditCard,
  Truck,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { AddressSelect } from "./AddressSelect";
import { PaymentMethodSelect } from "./PaymentMethodSelect";
import { ProductSummary } from "./ProductSummary";

export const calculateTotalAmount = (products) => {
  return products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );
};

export const PAYMENT_METHODS = [
  { value: "Card", label: "Credit/Debit Card", icon: CreditCard },
  { value: "UPI", label: "UPI", icon: Wallet },
  { value: "NetBanking", label: "Net Banking", icon: Bank },
  { value: "COD", label: "Cash on Delivery", icon: CashIcon },
  { value: "Wallet", label: "Digital Wallet", icon: Wallet },
];

const OrderForm = ({ session, cartData }) => {
  const [products] = useState(cartData);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressOptions, setAddressOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/api/address?userId=${session?.user?.id}`
        );
        setAddressOptions(response.data.address);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchAddresses();
    }
  }, [session?.user?.id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const totalAmount = calculateTotalAmount(products);
      const orderData = {
        userId: session.user.id,
        products,
        totalAmount,
        payment: paymentMethod,
        shippingAddress: selectedAddress,
      };

      const response = await axios.post("/api/order", orderData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response?.data?.success) {
        router.push("/"); // Redirect on success
      }
      // Handle successful order placement (e.g., redirect to confirmation page)
      console.log("Order placed successfully:", response.data);
    } catch (error) {
      // Handle error (e.g., show error message)
      console.error("Error placing order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please log in to place an order
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="pt-6">
          <p className="text-center text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  const totalAmount = calculateTotalAmount(products);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Complete Your Order
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>
              Review your items and shipping details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProductSummary products={products} />
            <Separator />
            <div className="flex justify-between items-center font-medium">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Shipping & Payment</CardTitle>
            <CardDescription>
              Enter your shipping and payment details
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <AddressSelect
                addresses={addressOptions}
                value={selectedAddress}
                onChange={setSelectedAddress}
              />
              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <PaymentMethodSelect
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !selectedAddress || !paymentMethod}
              >
                {isSubmitting ? (
                  <>
                    <Truck className="mr-2 h-4 w-4 animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <Truck className="mr-2 h-4 w-4" />
                    Place Order
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default OrderForm;
