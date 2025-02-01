import auth from "@/auth";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function RootLayout({ children }) {
  const session = await getServerSession(auth);

  if (!session?.user) redirect("/login");

  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-screen mx-auto px-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
