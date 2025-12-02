import { useContext, useState } from "react";
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
  const style =
    "font-bold bg-purple w-32 text-center text-peach py-1 px-1 rounded-lg ";
  return (
    <div className="relative md:static flex h-15 gap-4 px-6 md:px-20 justify-between bg-peach items-center">
      <img src={Logo} alt="Logo" className=" h-30 w-30" />{" "}
      <div className=" md:flex gap-8  text-purple items-center hidden">
        {navContent.map((content) => {
          return (
            <p
              onClick={() => scrollToSection(content.id)}
              className={`font-bold capitalize cursor-pointer hover:bg-purple hover:text-peach px-2 py-1 rounded-xl ${
                content.id === 6 ? style : ""
              } `}
            >
              {" "}
              {content.name}
            </p>
          );
        })}
      </div>
      <div className="md:hidden">
        {" "}
        <div className="bg-purple p-2 rounded-lg" onClick={handledropdown}>
          {" "}
          <RiDropdownList className="text-2xl text-peach" />
        </div>
        {dropdown ? (
          <div className="absolute z-10 flex flex-col items-center bg-peach min-w-35 top-17 right-5 rounded-lg py-2 space-y-2 pb-4 px-3 text-purple ">
            {" "}
            {navContent.map((content) => {
              return (
                <p
                  onClick={() => scrollToSection(content.id)}
                  className={`font-bold capitalize cursor-pointer hover:bg-purple hover:text-peach px-2 py-1 rounded-xl ${
                    content.id === 6 ? style : ""
                  } `}
                >
                  {" "}
                  {content.name}
                </p>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Navbar;
