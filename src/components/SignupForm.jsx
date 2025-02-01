"use client";

import { redirect } from "next/navigation";
import { toast } from "sonner";
import { signup } from "../../actions/signup";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const SignupForm = () => {
  return (
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
      className="flex flex-col gap-4"
    >
      <Input type="String" placeholder="Name" name="name" />
      <Input type="email" placeholder="Email" name="email" />
      <Input type="password" placeholder="Password" name="password" />
      <Button type="submit">Login</Button>
    </form>
  );
};

export default SignupForm;
