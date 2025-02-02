"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Package, MapPin, CreditCard, LogOut, User } from "lucide-react"

export function ProfileContent() {
  const [activeTab, setActiveTab] = useState("personal")

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
              <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
            <Button>Change Avatar</Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" placeholder="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" placeholder="Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="john.doe@example.com" type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input id="phone" placeholder="+1 (555) 000-0000" type="tel" />
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
          <CardDescription>View and manage your recent orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((order) => (
              <div key={order} className="flex items-center space-x-4 rounded-lg border p-4">
                <Package className="h-10 w-10 flex-shrink-0 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <p className="font-medium">Order #{order.toString().padStart(5, "0")}</p>
                  <p className="text-sm text-muted-foreground">Placed on April {order}, 2023</p>
                </div>
                <Button variant="outline">View Details</Button>
              </div>
            ))}
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
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Textarea id="address" placeholder="123 Main St, Apt 4B" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="New York" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" placeholder="NY" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input id="zipCode" placeholder="10001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" placeholder="United States" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Address</Button>
        </CardFooter>
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
  }

  const tabItems = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "address", label: "Address", icon: MapPin },
    { id: "payment", label: "Payment", icon: CreditCard },
  ]

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
  )
}
