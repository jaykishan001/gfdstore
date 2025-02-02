"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { CreditCard, LogOut, MapPin, Package, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export function ProfileContent() {
  const [activeTab, setActiveTab] = useState("personal");
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false); // To toggle address form
  const [selectedAddress, setSelectedAddress] = useState(null); // To manage selected address
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/users?id=${session.user.id}`
          );
          console.log("response of user", response.data);
          setUserData(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError("Failed to fetch user data. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    } else {
      redirect("/login");
    }
  }, [session, status]);

  const handleAddressChange = (e) => {
    const { id, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveAddress = () => {
    if (!userData.address) {
      userData.address = [];
    }
    const updatedAddresses = [...userData.address, newAddress];
    setUserData((prev) => ({ ...prev, address: updatedAddresses }));
    setShowAddressForm(false); // Hide the form after saving
    setNewAddress({
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    }); // Reset form
  };

  if (status === "loading" || loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const tabContent = {
    personal: (
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={session?.user?.image || "/placeholder-avatar.jpg"}
                alt="User"
              />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
            <Button>Change Avatar</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                defaultValue={
                  userData?.firstName || session?.user?.name || "John"
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                defaultValue={
                  userData?.email ||
                  session?.user?.email ||
                  "john.doe@example.com"
                }
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                defaultValue={userData?.phone || ""}
                placeholder="+1 (555) 000-0000"
                type="tel"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    ),
    orders: (
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userData?.orderHistory?.length > 0 ? (
              userData.orderHistory.map((order) => (
                <div
                  key={order}
                  className="flex items-center space-x-4 rounded-lg border p-4"
                >
                  <Package className="h-10 w-10 flex-shrink-0 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">
                      Order #{order.toString().padStart(5, "0")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Placed on April {order}, 2023
                    </p>
                  </div>
                  <Button variant="outline">View Details</Button>
                </div>
              ))
            ) : (
              <h1>There is no order. Buy some products!</h1>
            )}
          </div>
        </CardContent>
      </Card>
    ),
    address: (
      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
          <CardDescription>Manage your shipping addresses.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {userData?.address?.length > 0 ? (
            <>
              <div className="space-y-2">
                <Label>Select Address</Label>
                <select
                  className="w-full p-2 border rounded"
                  onChange={(e) =>
                    setSelectedAddress(userData.address[e.target.value])
                  }
                >
                  <option value="">Select an address</option>
                  {userData.address.map((addr, index) => (
                    <option key={index} value={index}>
                      {addr.street}, {addr.city}, {addr.state}, {addr.zipCode},{" "}
                      {addr.country}
                    </option>
                  ))}
                </select>
              </div>
              {selectedAddress && (
                <div className="space-y-2">
                  <p className="font-medium">Selected Address:</p>
                  <p>
                    {selectedAddress.street}, {selectedAddress.city},{" "}
                    {selectedAddress.state}, {selectedAddress.zipCode},{" "}
                    {selectedAddress.country}
                  </p>
                </div>
              )}
            </>
          ) : (
            <p>No addresses found.</p>
          )}
          <Button onClick={() => setShowAddressForm(true)}>
            Add New Address
          </Button>
          {showAddressForm && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Textarea
                  id="street"
                  value={newAddress.street}
                  onChange={handleAddressChange}
                  placeholder="123 Main St, Apt 4B"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={newAddress.city}
                    onChange={handleAddressChange}
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={newAddress.state}
                    onChange={handleAddressChange}
                    placeholder="NY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={newAddress.zipCode}
                    onChange={handleAddressChange}
                    placeholder="10001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={newAddress.country}
                    onChange={handleAddressChange}
                    placeholder="United States"
                  />
                </div>
              </div>
              <Button onClick={handleSaveAddress}>Save Address</Button>
            </div>
          )}
        </CardContent>
      </Card>
    ),
    payment: (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment options.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4 rounded-lg border p-4">
            <CreditCard className="h-10 w-10 flex-shrink-0 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">Visa ending in 1234</p>
              <p className="text-sm text-muted-foreground">Expires 12/2024</p>
            </div>
            <Button variant="outline">Edit</Button>
          </div>
          <Button className="w-full">Add New Payment Method</Button>
        </CardContent>
      </Card>
    ),
  };

  const tabItems = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "address", label: "Address", icon: MapPin },
    { id: "payment", label: "Payment", icon: CreditCard },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="grid gap-6 md:grid-cols-[240px_1fr]">
        <Card>
          <CardContent className="p-4">
            <nav className="flex flex-col space-y-1">
              {tabItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {tabContent[activeTab]}
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" className="w-full sm:w-auto">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
