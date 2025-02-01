import auth from "@/auth"; // Adjust path based on your file structure
import SignupForm from "@/components/SignupForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async () => {
  // Get the session using getServerSession
  const session = await getServerSession(auth); // This uses the auth configuration from your default export

  // If the user is already logged in, redirect them to the home page
  if (session?.user) redirect("/");

  return (
    <div className="h-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Signup</CardTitle>
        </CardHeader>
        <CardContent>
          <SignupForm />

          <p>
            Don't have an account? <Link href="login">Login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
