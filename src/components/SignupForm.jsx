"use client";

import { Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { signup } from "../../actions/signup";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const SignupForm = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Create an account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={async (formData) => {
            const name = formData.get("name");
            const email = formData.get("email");
            const password = formData.get("password");
            if (!name || !email || !password) {
              return toast.error("Please fill all fields");
            }
            const toastId = toast.loading("Signing up...");

            const error = await signup(formData);

            if (!error) {
              toast.success("Signed up successfully", { id: toastId });
              redirect("/login");
            } else {
              toast.error(error, { id: toastId });
            }
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                name="name"
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                name="email"
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                name="password"
                className="pl-10"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase"></div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-2">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
