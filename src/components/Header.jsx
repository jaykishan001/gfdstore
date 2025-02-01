import { auth } from "@/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import CartIcon from "./CartIcon";
import Container from "./Container";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import SearchBar from "./SearchBar";
import { Button } from "./ui/button";
import UserProfile from "./UserProfile";
import WishList from "./WishList";

const Header = async () => {
  // Check if user exists

  const session = await getServerSession(auth);
  const User = session?.user;
  return (
    <header className="fixed  top-0 left-0 w-full z-50 bg-white shadow-md border-b border-gray-300 py-4">
      <Container className="flex items-center justify-between gap-5 px-4 md:px-6">
        {/* Left Section: Logo */}
        <div className="flex items-center gap-3">
          <MobileMenu />
          <Logo className="text-lg font-bold tracking-tight">
            MYOWN<span className="text-orange-500">STORE</span>
          </Logo>
        </div>

        <div className="relative md:flex flex-1 justify-center">
          <SearchBar />
        </div>

        <div className="flex items-center gap-4">
          <CartIcon />
          <WishList />
          {!User ? (
            <Link href="/login">
              {" "}
              <Button
                variant="outline"
                className="bg-yellow-400 hover:bg-yellow-500"
              >
                Sign In
              </Button>
            </Link>
          ) : (
            <UserProfile />
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
