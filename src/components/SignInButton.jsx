"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function SignInButton() {
  const [open, setOpen] = React.useState(false);
  const [signUpOpen, setSignUpOpen] = React.useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-yellow-400 hover:bg-yellow-500"
          >
            Sign In
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              Enter your email and password to sign in to your account
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="m@example.com" type="email" />
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="password" type="password" />
            </div>
            <Button type="submit" className="w-full">
              Sign In with Email
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button variant="outline">
              {/* Add Google Icon Here */}
              Google
            </Button>
          </div>

          {/* Popover for Sign Up */}
          <Popover>
            <PopoverTrigger asChild>
              <p className="text-sm text-center text-muted-foreground cursor-pointer hover:underline">
                Don't have an account?{" "}
                <span className="text-blue-500">Register</span>
              </p>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="text-sm text-center">
                Create an account to access all features.
              </div>
              <div className="flex justify-center mt-3">
                <DialogTrigger asChild onClick={() => setSignUpOpen(true)}>
                  <Button variant="default">Sign Up</Button>
                </DialogTrigger>
              </div>
            </PopoverContent>
          </Popover>
        </DialogContent>
      </Dialog>

      {/* Sign Up Dialog */}
      <Dialog open={signUpOpen} onOpenChange={setSignUpOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign Up</DialogTitle>
            <DialogDescription>
              Create an account to get started
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" type="text" />
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="m@example.com" type="email" />
              <Label htmlFor="password">Password</Label>
              <Input id="password" placeholder="password" type="password" />
            </div>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
