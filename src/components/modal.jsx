import React from "react";

function Modal({ toggleModal, DisplayContent }) {
  return (
    <div className="fixed flex items-center justify-center h-screen inset-0 top-0 left-0 z-50 bg-light/30 backdrop-blur-md">
      <div className="relative flex  justify-between px-4 py-5 w-3/4 md:w-1/2 h-120  bg-light rounded-2xl shadow">
        {/* The left hand side */}
        <div className=" md:w-3/5 w-full">
          {" "}
          <p className="text-xl font-bold"> {DisplayContent.name}</p>
          <div className="overflow-auto h-90 mt-5">
            {" "}
            {DisplayContent?.description}
          </div>
        </div>{" "}
        {/* the right hand side */}
        <div className=" w-2/5 hidden md:block">
          {" "}
          <img
            src={DisplayContent.featured_image}
            alt="Logo"
            className="w-full h-1/2 object-cover rounded-t-2xl"
          />{" "}
          <p className="px-2 text-xl font-bold "> {DisplayContent.name}</p>{" "}
          <p className="px-2 text-sm text-gray break-all mt-2">
            Author : <span>{DisplayContent?.Author || "GH Procurement "} </span>
          </p>
          <p className="px-2 text-sm text-gray break-all mb-3">
            Date : <span>{DisplayContent?.created_at} </span>
          </p>
        </div>
        <div
          className="absolute bottom-4 right-4 w-15 py-1 px-2 text-center bg-red-600 text-white font-bold cursor-pointer rounded-xl"
          onClick={toggleModal}
        >
          {" "}
          Close
        </div>
      </div>
    </div>
  );
}

export default Modal;
