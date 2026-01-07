import { useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const logo = "/images/iska-logo.png";
  const navigate = useNavigate();

  return (
    <nav className="bg-white fixed top-0 w-full z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0">
            <img src={logo} alt="Logo" className="h-6 md:h-8" />
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8">
            {["Home", "Features", "About", "Contact"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-[#800000] hover:text-[#b22222] transition "
              >
                {link}
              </a>
            ))}
          </div>

          {/* Desktop Button */}
          <div className="hidden md:block">
            <button
              onClick={() => navigate("/experience")}
              className="relative bg-[#660B05] rounded-xl cursor-pointer inline-flex items-center gap-2 group"
            >
              <span
                className="bg-[#8C1007] text-white font-semibold rounded-xl text-xs
                   px-6 py-3
                   transform -translate-y-1
                   transition-transform duration-100 ease-in-out
                   hover:bg-[#980404]/90
                   active:translate-y-0
                   inline-flex items-center gap-2"
              >
                Visit App
              </span>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#800000] focus:outline-none text-xl p-2 rounded-lg hover:text-white hover:bg-[#800000] transition"
            >
              <HiOutlineMenu />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#800000]/80 text-lg focus:outline-none hover:text-[#800000]"
          >
            <HiOutlineX />
          </button>
        </div>
        <div className="flex flex-col px-4 space-y-4 mt-2 text-sm">
          {["Home", "Features", "About", "Contact"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-[#800000] hover:bg-[#ddb2b2] transition px-2 py-1 rounded"
              onClick={() => setIsOpen(false)}
            >
              {link}
            </a>
          ))}
          <button
            onClick={() => navigate("/experience")}
            className="relative bg-[#660B05] rounded-xl cursor-pointer inline-flex items-center gap-2 group"
          >
            <span
              className="bg-[#8C1007] text-white font-semibold rounded-xl text-xs 
                            px-6 py-3
                            transform -translate-y-1
                            transition-transform duration-100 ease-in-out
                            hover:bg-[#980404]/90
                            active:translate-y-0
                            w-full
                            inline-flex justify-center item-center gap-2"
            >
              Visit App
            </span>
          </button>
        </div>
      </div>

      {/* Optional backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
};
