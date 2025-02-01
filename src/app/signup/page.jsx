import { auth } from "@/auth"; // Adjust path based on your file structure
import SignupForm from "@/components/SignupForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const page = async () => {
  // Get the session using getServerSession
  const session = await getServerSession(auth); // This uses the auth configuration from your default export

  // If the user is already logged in, redirect them to the home page
  if (session?.user) redirect("/");

  return (
    <div className="h-screen flex items-center justify-center">
      <SignupForm />
    </div>
  );
};

export default page;
