"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginhandler } from "../../actions/login";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const LoginForm = () => {
  const router = useRouter();
  return (
    <form
      action={async (FormData) => {
        const email = FormData.get("email");
        const password = FormData.get("password");
        if (!email || !password) {
          return toast.error("Please fill all fields");
        }
        const toastId = toast.loading("Logging in...");
        const error = await loginhandler(email, password);

        if (!error) {
          toast.success("Logged in successfully", { id: toastId });
          router.refresh();
        } else {
          toast.error(error, { id: toastId });
        }
      }}
      className="flex flex-col gap-4"
    >
      <Input type="email" placeholder="Email" name="email" />
      <Input type="password" placeholder="Password" name="password" />
      <Button type="submit">Login</Button>
    </form>
  );
};

export default LoginForm;
