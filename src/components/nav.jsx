import { useContext } from "react";
import Logo from "../images/Logo.png";
import { RiDropdownList } from "react-icons/ri";
import { globalContext } from "../App";

function Navbar({ scrollToSection }) {
  const { dropdown, handledropdown } = useContext(globalContext);

  const navContent = [
    { name: "home", id: 1 },
    { name: "Services", id: 2 },
    { name: "Portfolio", id: 3 },
    { name: "Blog", id: 4 },
    { name: "Contact", id: 5 },
    { name: "Request Quote", id: 6 },
  ];

  const specialStyle =
    "font-bold bg-purple text-center text-peach py-1 px-2 rounded-lg";

  return (
    <div className="relative md:static flex flex-row md:flex-row items-center justify-between h-16  px-4 sm:px-6 lg:px-20 bg-peach">
      {/* Logo */}
      <img
        src={Logo}
        alt="Logo"
        className="h-20 w-20 sm:h-12 sm:w-12 md:h-30 md:w-30"
      />

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-6 text-purple items-center">
        {navContent.map((content) => (
          <p
            key={content.id}
            onClick={() => scrollToSection(content.id)}
            className={`font-bold capitalize cursor-pointer hover:bg-purple hover:text-peach px-2 py-1 rounded-xl ${
              content.id === 6 ? specialStyle : ""
            }`}
          >
            {content.name}
          </p>
        ))}
      </div>

      {/* Mobile Dropdown */}
      <div className="md:hidden relative">
        <div className="bg-purple p-2 rounded-lg" onClick={handledropdown}>
          <RiDropdownList className="text-2xl text-peach" />
        </div>

        {dropdown && (
          <div className="absolute z-20 flex flex-col items-center bg-peach w-40 sm:w-48 top-14 right-0 rounded-lg py-2 space-y-2 px-3 text-purple shadow-md">
            {navContent.map((content) => (
              <p
                key={content.id}
                onClick={() => scrollToSection(content.id)}
                className={`font-bold capitalize cursor-pointer hover:bg-purple hover:text-peach px-2 py-1 rounded-xl ${
                  content.id === 6 ? specialStyle : ""
                }`}
              >
                {content.name}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
