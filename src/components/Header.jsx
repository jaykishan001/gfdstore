import React from "react";
import HeaderMenu from "./HeaderMenu";
import Logo from "./Logo";
import Container from "./Container";
import MobileMenu from "./MobileMenu";
import CartIcon from "./CartIcon";
import SearchBar from "./SearchBar";
import WishList from "./WishList";
import { SignInButton } from "./SignInButton";
import { Popover } from "./ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "./ui/button";
import { User2Icon } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const Header = () => {
  //check user exist or not
  const User = 1;
  return (
    <header className="bg-red-white border-b border-b-gray-400 py-5">
      <Container className="flex items-center justify-between gap-7 text-lightColor ">
        <HeaderMenu />
        <div className="w-auto md:w-1/3 flex item-center justify-center gap-2.5">
          <MobileMenu />
          <Logo className="tracking-tight">
            GFD <span className="text-black">Store</span>
          </Logo>
        </div>
        <div className="flex items-center justify-center gap-4">
          <SearchBar />
          <CartIcon />
          <WishList />
          {!User ? (
            <SignInButton>
              <div className="">
                <button className="text-sm font-semibold hover:text-darkColor hoverEffect border p-2 bg-[#FFA500] rounded-lg">
                  Login
                </button>
              </div>
            </SignInButton>
          ) : (
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <User2Icon />
                </PopoverTrigger>
                <PopoverContent className="w-60 bg-white shadow-lg rounded-lg p-4">
                {/* Profile Info */}
                <div className="text-center">
                  <h4 className="font-medium text-lg">{User.name}</h4>
                  <p className="text-sm text-gray-500">{User.email}</p>
                </div>

                <div className="mt-4 space-y-2">
                  {/* Edit Profile */}
                  <Button
                    variant="outline"
                    className="w-full text-sm"
                  >
                    Edit Profile
                  </Button>

                  {/* View Orders */}
                  <Button
                    variant="outline"
                    className="w-full text-sm"
                  >
                    My Orders
                  </Button>

                  {/* Logout */}
                  <Button
                    variant="destructive"
                    className="w-full text-sm"
                    
                  >
                    Logout
                  </Button>
                </div>
              </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
