"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { User2Icon } from "lucide-react";
import { signOut } from "next-auth/react"; // Import signOut from NextAuth
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";

const UserProfile = () => {
  const User = { name: "John Doe", email: "johndoe@example.com" };
  const [open, setOpen] = useState(false);

  const handleNavigation = (path) => {
    setOpen(false);
  };

  const handleLogout = async () => {
    // Calling NextAuth's signOut function
    await signOut({
      redirect: true, // This will handle redirection automatically after logout
      callbackUrl: "/login", // Redirect to the login page after logout
    });
    setOpen(false); // Close the Popover on logout
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button>
            <User2Icon className="w-6 h-6" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-60 bg-white shadow-lg rounded-lg p-4">
          <div className="text-center">
            <h4 className="font-medium text-lg">{User.name}</h4>
            <p className="text-sm text-gray-500">{User.email}</p>
          </div>

          <div className="mt-4 space-y-3">
            <Link href="/user/profile">
              <Button variant="outline" className="w-full text-sm">
                My Profile
              </Button>
            </Link>

            <Link href="/order" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full text-sm mt-3">
                My Orders
              </Button>
            </Link>

            <Button
              variant="destructive"
              className="w-full text-sm"
              onClick={handleLogout} // Call handleLogout on click
            >
              Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserProfile;
