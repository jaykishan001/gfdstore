import Logo from "./Logo";
import Container from "./Container";
import MobileMenu from "./MobileMenu";
import CartIcon from "./CartIcon";
import WishList from "./WishList";
import { SignInButton } from "./SignInButton";
import UserProfile from "./UserProfile";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

const Header = () => {
  // Check if user exists
  const User = null;
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b border-gray-300 py-4">
      <Container className="flex items-center justify-between gap-5 px-4 md:px-6">
        {/* Left Section: Logo */}
        <div className="flex items-center gap-3">
          <MobileMenu />
          <Logo className="text-lg font-bold tracking-tight">
            MYOWN<span className="text-orange-500">STORE</span>
          </Logo>
        </div>

        <div className="hidden md:flex flex-1 justify-center">
          <div className="relative w-1/2">
            <Input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <CartIcon />
          <WishList />
          {!User ? (
            <SignInButton>
              <button className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition">
                Login
              </button>
            </SignInButton>
          ) : (
            <UserProfile />
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
