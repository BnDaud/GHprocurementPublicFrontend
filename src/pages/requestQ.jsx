import React from "react";

function RequestQuote() {
  return (
    <div className="w-full min-h-100  px-2  md:pr-5 lg:pr-10 pb-20 space-y-4 mt-10">
      <div className="w-full min-h-85 p-4 bg-white rounded-2xl">
        <p className="text-xl font-bold">Request For Quote</p>

        <form className="mt-5 space-y-2 text-sm md:text-base">
          {" "}
          <div className="flex justify-between">
            <label className="font-semibold mr-2 md:mr-4">
              {" "}
              Name<span className="text-red-600"> *</span>
            </label>
            <input
              className="h-10 w-55 md:w-70  p-2 px-3 rounded-xl  bg-white border-gray border"
              placeholder="Full Name"
              required
              type="text"
            />
          </div>{" "}
          <div className="flex justify-between">
            <label className="font-semibold md:mr-4 mr-2">
              {" "}
              Email<span className="text-red-600"> *</span>
            </label>
            <input
              className="h-10 md:w-70 w-55 p-2 px-3 rounded-xl  bg-white border-gray border"
              placeholder="example@email.com"
              required
              type="email"
            />
          </div>{" "}
          <div className="flex justify-between">
            <label className="font-semibold mr-2 md:mr-4">
              {" "}
              From<span className="text-red-600"> *</span>
            </label>
            <input
              className="h-10 md:w-70 w-55 p-2 px-3 rounded-xl  bg-white border-gray border"
              placeholder="Company Name"
              required
              type="text"
            />
          </div>{" "}
          <div className="flex justify-between">
            <label className="font-semibold mr-2 md:mr-4">
              {" "}
              Item<span className="text-red-600"> *</span>
            </label>
            <textarea
              className="h-40 md:w-70 w-55 p-2 px-3 rounded-xl  bg-white border-gray border"
              placeholder="Full Name"
              required
              type="text"
            ></textarea>
          </div>{" "}
          <div className="flex justify-between">
            <label className="font-semibold mr-4">
              {" "}
              File<span className="text-red-600"> *</span>
            </label>
            <input
              className="h-10 md:w-70 w-55 p-2 px-3 rounded-xl  bg-white border-gray border"
              placeholder="Description"
              required
              type="file"
              accept="image/*"
            />
          </div>
          <div className="flex gap-4 mt-5">
            {" "}
            <div className="bg-purple px-4 py-2 text-center text-peach font-bold rounded-xl">
              Send RFQ
            </div>
            <div className=" px-4 py-2 text-center text-purple outline hover:bg-purple hover:text-peach hover-outline-none font-bold rounded-xl">
              {" "}
              Reset
            </div>{" "}
          </div>
          <p className="mt-5 text-sm font-bold text-center text-gray">
            {" "}
            We will follow up within 48 hours{" "}
          </p>
        </form>
      </div>
    </div>
  );
}

export default RequestQuote;
