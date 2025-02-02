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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { Mail, MapPin, Phone, Truck, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PaymentMethodSelect } from "./PaymentMethodSelect";
import { ProductSummary } from "./ProductSummary";

const calculateTotalAmount = (products) => {
  return products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );
};

const GuestForm = ({ cartData }) => {
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [products] = useState(cartData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestDetails, setGuestDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [guestShippingAddress, setGuestShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const handleGuestDetailsChange = (e) => {
    const { name, value } = e.target;
    setGuestDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleGuestShippingAddressChange = (e) => {
    const { name, value } = e.target;
    setGuestShippingAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const totalAmount = calculateTotalAmount(products);
    const orderData = {
      guestDetails,
      payment: paymentMethod,
      totalAmount,
      products,
      guestShippingAddress,
    };

    try {
      const response = await axios.post("/api/order", orderData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response?.data) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <CardDescription>Review your items and total</CardDescription>
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
            <CardTitle>Guest Information</CardTitle>
            <CardDescription>
              Enter your details and shipping address
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="relative">
                    <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      value={guestDetails.name}
                      onChange={handleGuestDetailsChange}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={guestDetails.email}
                      onChange={handleGuestDetailsChange}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={guestDetails.phone}
                      onChange={handleGuestDetailsChange}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Shipping Address</h3>
                <div className="space-y-2">
                  <Label htmlFor="street">Street</Label>
                  <div className="relative">
                    <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="street"
                      name="street"
                      value={guestShippingAddress.street}
                      onChange={handleGuestShippingAddressChange}
                      className="pl-8"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={guestShippingAddress.city}
                      onChange={handleGuestShippingAddressChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={guestShippingAddress.state}
                      onChange={handleGuestShippingAddressChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={guestShippingAddress.postalCode}
                      onChange={handleGuestShippingAddressChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={guestShippingAddress.country}
                      onChange={handleGuestShippingAddressChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <PaymentMethodSelect
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
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

export default GuestForm;
