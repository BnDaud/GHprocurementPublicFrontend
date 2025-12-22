import React, { useContext, useState, useEffect } from "react";
import { globalContext } from "../App";
import { FaArrowRight } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import truck from "../images/truck1.jpg";
import air1 from "../images/air1.jpg";
import air2 from "../images/air2.jpg";
function Home() {
  const { scrollToSection, metadata } = useContext(globalContext);
  const images = [truck, air1, air2];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="md:relative static  px-2 md:px-5 lg:px-20 lg:py-20 py-10 space-y-4">
      {metadata && (
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${images[currentIndex]})` }}
        ></div>
      )}

      <p className="text-3xl font-bold md:w-1/2"> {metadata?.metaIntro}</p>
      <p className="md:w-3/5">{metadata?.metaDescription}</p>
      {/* the 6 pass to the function below is id
      to understand it better study how the useRef hook is used and how the id are assigned both in the nav.jsx(navContent object) and App.jsx(section object) */}
      <div className="flex gap-4">
        <p
          onClick={() => scrollToSection(6)}
          className="font-bold bg-purple w-32 text-center text-peach py-2 px-1 rounded-lg cursor-pointer"
        >
          {" "}
          Request Quote
        </p>{" "}
        <p
          onClick={() => scrollToSection(2)}
          className="font-bold border border-purple w-32 text-center text-purple py-2 px-1 rounded-lg cursor-pointer"
        >
          {" "}
          See Services
        </p>{" "}
      </div>
      <div className="flex flex-col justify-center bg-white w-11/12 text-sm lg:w-87 md:w-3/8 px-4 py-2 rounded-lg hover:shadow-md shadow-black h-20 transition-all duration-1000 hover:-translate-y-1 space-y-2">
        {" "}
        <p> How we help</p>
        <div className="flex justify-between">
          {" "}
          <p className="text-purple font-bold">Supplier Vetting</p>
          <p className="text-purple font-bold">Contract Mgmt</p>
          <p className="text-purple font-bold"> Logistics</p>
        </div>
      </div>
      <div className="md:absolute top-40 lg:right-20 md:right-5 flex flex-col justify-center bg-white lg:w-109 md:w-4/7  px-4 pt-4 pb-6 rounded-lg hover:shadow-md shadow-black h-35 transition-all duration-1000 hover:-translate-y-1 space-y-2">
        <div className="relative">
          {" "}
          <p className="font-bold"> Trusted by</p>
          <p className="text-gray text-sm">
            {" "}
            Manufacturing · Retail · Healthcare
          </p>
          <div
            className="absolute flex gap-2 h-3 items-center top-3 right-0 text-purple font-bold cursor-pointer"
            onClick={() => scrollToSection(6)}
          >
            <p>Get started</p> <FaArrowRight />
          </div>
        </div>
        <div className="flex gap-12 justify-center">
          {" "}
          <div className="text-center space-y-0">
            {" "}
            <p className="font-bold text-xl text-purple">
              {metadata ? (
                metadata?.ordersCompleted + "+"
              ) : (
                <AiOutlineLoading3Quarters className="text-center w-full animate-spin" />
              )}
            </p>{" "}
            <p className="text-sm text-gray"> Orders Completed</p>
          </div>
          <div className="text-center space-y-0 ">
            {" "}
            <p className="font-bold text-xl text-purple">
              {" "}
              {metadata ? (
                metadata?.suppliers
              ) : (
                <AiOutlineLoading3Quarters className="text-center w-full animate-spin" />
              )}
            </p>{" "}
            <p className="text-sm text-gray"> Suppliers</p>
          </div>
          <div className="text-center space-y-0">
            {" "}
            <p className="font-bold text-xl text-purple">
              {" "}
              {metadata ? (
                metadata?.experience
              ) : (
                <AiOutlineLoading3Quarters className="text-center w-full animate-spin" />
              )}
            </p>{" "}
            <p className="text-sm text-gray"> Average Experience</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
