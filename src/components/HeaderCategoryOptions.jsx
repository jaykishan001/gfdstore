import Image from "next/image";
import Link from "next/link.js";
import { visitOptions } from "../../constants";
import Container from "./Container.jsx";
import { Label } from "./ui/label";
const HeaderCategoryOptions = ({ activePage }) => {
  return (
    <Container className="mt-6">
      <div
        className={`flex items-center px-4 sm:px-6 gap-x-4 justify-start sm:justify-center overflow-x-auto sm:overflow-visible custom-scrollbar
        ${activePage === "Home" ? "h-[20vh]" : "h-auto py-2"}`}
      >
        {visitOptions.map((option) => (
          <Link key={option.title} href={`/category/${option.route}`} passHref>
            <div
              className={`flex flex-col items-center justify-center p-2 sm:p-4 rounded-lg transition-all duration-300 min-w-[80px] sm:min-w-[120px] 
              ${
                option.title === activePage
                  ? "text-darkColor font-bold"
                  : "text-black"
              } 
              hover:text-darkColor hover:scale-105 cursor-pointer`}
            >
              {/* Show image only on Home Page with a fallback */}
              {activePage === "Home" && (
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden">
                  <Image
                    src={option.image}
                    alt={option.title}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
              )}
              <Label className="mt-2 text-xs sm:text-sm font-semibold">
                {option.title}
              </Label>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
};

export default HeaderCategoryOptions;
