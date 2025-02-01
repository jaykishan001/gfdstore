import auth from "@/auth";
import LoginForm from "@/components/LoginForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession(auth);

  if (session?.user) redirect("/");

  return (
    <div className="h-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />

          <p>
            Don't have an account? <Link href="signup">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
