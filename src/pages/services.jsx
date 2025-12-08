import React, { useContext, useState } from "react";
import { globalContext } from "../App";

function Services() {
  const { service } = useContext(globalContext);
  console.log(service);
  return (
    <div className=" px-6 md:px-20 pb-20 space-y-4">
      <p className="text-lg font-bold">Services</p>
      <div className="md:flex flex-wrap gap-4 justify-center md:space-y-0 space-y-4">
        {service ? (
          service.map((s) => (
            <div className="md:w-65 md:h-50 w-full min-h-30 bg-white rounded-lg px-6 pt-4 space-y-2 font-sans shadow">
              <p className="text-xl font-bold">{s.title}</p>
              <p> {s.description}</p>
            </div>
          ))
        ) : (
          <>
            {" "}
            <div className="md:w-65 md:h-50 w-full min-h-30 bg-gray/10 rounded-lg px-6 pt-4 space-y-2 font-sans shadow animate-pulse duration-200 transition-all">
              <p className="text-xl font-bold w-25 bg-white/80 h-3 animate-pulse md:mb-10 ">
                {" "}
              </p>
              <p className=" text-xl font-bold w-70 md:w-30 bg-white/80 h-3 animate-pulse">
                {" "}
              </p>{" "}
              <p className=" text-xl font-bold w-80 md:w-40 bg-white/80 h-3 animate-pulse">
                {" "}
              </p>{" "}
              <p className=" text-xl font-bold w-100 md:w-50 bg-white/80 h-3 animate-pulse">
                {" "}
              </p>{" "}
              <p className=" text-xl font-bold w-50 md:w-20 bg-white/80 h-3 animate-pulse">
                {" "}
              </p>
            </div>
            <div className="md:w-65 md:h-50 w-full min-h-30 bg-gray/10 rounded-lg px-6 pt-4 space-y-2 font-sans shadow animate-pulse duration-800 transition-all">
              <p className="text-xl font-bold w-25 bg-white/80 h-3 animate-pulse md:mb-10 ">
                {" "}
              </p>
              <p className=" text-xl font-bold w-70 md:w-30 bg-white/80 h-3 animate-pulse">
                {" "}
              </p>{" "}
              <p className=" text-xl font-bold w-80 md:w-40 bg-white/80 h-3 animate-pulse">
                {" "}
              </p>{" "}
              <p className=" text-xl font-bold w-100 md:w-50 bg-white/80 h-3 animate-pulse">
                {" "}
              </p>{" "}
              <p className=" text-xl font-bold w-50 md:w-20 bg-white/80 h-3 animate-pulse">
                {" "}
              </p>
            </div>
            <div className="md:w-65 md:h-50 w-full min-h-30 bg-gray/10 rounded-lg px-6 pt-4 space-y-2 font-sans shadow animate-pulse duration-1400 transition-all">
              <p className="text-xl font-bold w-25 bg-white/80 h-3 animate-pulse md:mb-10 ">
                {" "}
              </p>
              <p className=" text-xl font-bold w-70 md:w-30 bg-white/80 h-3 animate-pulse">
                {" "}
              </p>{" "}
              <p className=" text-xl font-bold w-80 md:w-40 bg-white/80 h-3 animate-pulse">
                {" "}
              </p>{" "}
              <p className=" text-xl font-bold w-100 md:w-50 bg-white/80 h-3 animate-pulse">
                {" "}
              </p>{" "}
              <p className=" text-xl font-bold w-50 md:w-20 bg-white/80 h-3 animate-pulse">
                {" "}
              </p>
            </div>
            <div className="md:w-65 md:h-50 w-full min-h-30 bg-gray/10 rounded-lg px-6 pt-4 space-y-2 font-sans shadow animate-pulse duration-2000 transition-all">
              <p className="text-xl font-bold w-25 bg-white/80 h-3 animate-pulse md:mb-10 ">
                {" "}
              </p>
              <p className=" text-xl font-bold w-70 md:w-30 bg-white/80 h-3 animate-pulse">
                {" "}
              </p>{" "}
              <p className=" text-xl font-bold w-80 md:w-40 bg-white/80 h-3 animate-pulse">
                {" "}
              </p>{" "}
              <p className=" text-xl font-bold w-100 md:w-50 bg-white/80 h-3 animate-pulse">
                {" "}
              </p>{" "}
              <p className=" text-xl font-bold w-50 md:w-20 bg-white/80 h-3 animate-pulse">
                {" "}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Services;
