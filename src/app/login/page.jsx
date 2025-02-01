import { auth } from "@/auth";
import LoginForm from "@/components/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession(auth);

  if (session?.user) redirect("/");

  return (
    <div className="h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default page;
