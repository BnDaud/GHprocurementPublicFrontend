import { useContext } from "react";
import Logo from "../images/Logo.png";
import { RiDropdownList } from "react-icons/ri";
import { globalContext } from "../App";
import { Link } from "react-router-dom";

function Navbar() {
  const { dropdown, handledropdown, setScrollToSectionValue } =
    useContext(globalContext);

  const navContent = [
    { name: "home", id: 1 },
    { name: "Services", id: 2 },
    { name: "Catalog", id: 3 },
    { name: "Portfolio", id: 4 },

    { name: "Contact", id: 5 },
    //   { name: "Request Quote", id: 6 },
  ];

  const specialStyle = "font-bold bg-purple text-center text-peach  rounded-lg";

  return (
    <div className="relative md:static flex flex-row md:flex-row items-center justify-between h-16  px-[5%] lg:px-[15%] bg-peach">
      {/* Logo */}
      <img
        src={Logo}
        alt="Logo"
        className="h-20 w-20 sm:h-12 sm:w-12 md:h-30 md:w-30 "
      />

      {/* Desktop Navigation */}
      <div className="flex justify-between w-4/5  ">
        {" "}
        <div className="hidden w-1/3 md:flex gap-6 text-purple items-center">
          {navContent.map((content) => (
            <p
              key={content.id}
              onClick={() => setScrollToSectionValue(content.id)}
              className={`font-bold capitalize cursor-pointer hover:bg-purple hover:text-peach px-2 py-1 rounded-xl`}
            >
              {content.name}
            </p>
          ))}
        </div>
        <div className="hidden w-1/3 md:flex gap-6 text-purple items-center">
          <p
            className={`font-bold w-3/5 capitalize cursor-pointer text-xs hover:text-peach  py-3 rounded-lg ${
              specialStyle
            }`}
            onClick={() => setScrollToSectionValue(6)}
          >
            {" "}
            Get Started{" "}
          </p>
          <p className="font-bold border border-purple w-24 text-center text-purple hover:bg-purple hover:text-peach py-1 px-2 rounded-lg cursor-pointer">
            {" "}
            <Link to={"/signin"}> Sign In</Link>
          </p>
        </div>
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
                onClick={() => setScrollToSectionValue(content.id)}
                className={`font-bold capitalize cursor-pointer hover:bg-purple hover:text-peach px-2 py-1 rounded-xl `}
              >
                {content.name}
              </p>
            ))}
            <div className="md:hidden space-y-2 text-purple items-center">
              <p
                className={`font-bold capitalize cursor-pointer hover:bg-purple hover:text-peach px-2 py-1 rounded-lg ${
                  specialStyle
                }`}
                onClick={() => setScrollToSectionValue(6)}
              >
                {" "}
                Get Started{" "}
              </p>
              <p className="font-bold border border-purple w-24 text-center text-purple hover:bg-purple hover:text-peach py-1 px-2 rounded-lg cursor-pointer">
                {" "}
                <Link to={"/signin"}> Sign In</Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
