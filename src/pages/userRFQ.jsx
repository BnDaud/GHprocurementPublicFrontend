import {
  MdLibraryBooks,
  MdOutlineCancel,
  MdRemoveRedEye,
} from "react-icons/md";
import { FaAngleRight, FaPlus } from "react-icons/fa6";
import { BiTask } from "react-icons/bi";
import { FiBox } from "react-icons/fi";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegCheckCircle, FaRegClock, FaSearch } from "react-icons/fa";

export default function UserRfq() {
  const demo = [
    {
      state: "Draft",
      icon: (
        <p className="bg-gray-100 p-2 rounded-lg">
          <MdLibraryBooks className="text-2xl text-gray-500" />
        </p>
      ),
    },
    {
      state: "Awaiting",
      icon: (
        <p className="bg-amber-100 rounded-lg p-2">
          {" "}
          <FiBox className="text-2xl text-amber-500" />
        </p>
      ),
    },
    {
      state: "Review",
      icon: (
        <p className="bg-blue-100 p-2 rounded-lg">
          <MdRemoveRedEye className="text-2xl text-blue-500" />
        </p>
      ),
    },
    {
      state: "Completed",
      icon: (
        <p className="bg-green-100 rounded-lg p-2">
          <BiTask className="text-2xl text-green-500" />
        </p>
      ),
    },
  ];
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const allrfq = [
    {
      id: "dfgaswerfwAS",
      category: "Office",
      items: 3,
      submitted: "Jan 15 2024",
      status: "Awaiting Quote",
    },

    {
      id: "QWE789asdFG",
      category: "Furniture",
      items: 5,
      submitted: "Feb 18 2024",
      status: "Under Review",
    },
    {
      id: "ZXCV456poiU",
      category: "IT Equipment",
      items: 20,
      submitted: "Mar 01 2024",
      status: "Completed",
    },
    {
      id: "MNBG234ertY",
      category: "Cleaning Supplies",
      items: 8,
      submitted: "Mar 10 2024",
      status: "Draft",
    },
    {
      id: "MNBG234ertY",
      category: "Cleaning Supplies",
      items: 8,
      submitted: "Mar 10 2024",
      status: "Cancelled",
    },
  ];

  const statusIcons = {
    "Awaiting Quote": (arg) => (
      <div className="flex justify-center gap-2 bg-amber-100 rounded-full items-center h-7 text-amber-600 font-bold outline lg:w-6/7 px-3 lg:px-0">
        <FaRegClock />
        <p>{arg}</p>
      </div>
    ),
    "Under Review": (arg) => (
      <div className="flex justify-center gap-2 bg-blue-100 rounded-full items-center h-7 text-blue-600 font-bold outline lg:w-6/7 px-3 lg:px-0">
        <FaSearch />
        <p>{arg}</p>
      </div>
    ),
    Completed: (arg) => (
      <div className="flex justify-center gap-2 bg-green-100 rounded-full items-center h-7 text-green-600 font-bold lg:w-5/7 outline px-3 lg:px-0">
        <FaRegCheckCircle />
        <p>{arg}</p>
      </div>
    ),
    Draft: (arg) => (
      <div className="flex justify-center gap-2 bg-gray-100 rounded-full items-center h-7 text-gray-600 font-bold outline lg:w-4/7 px-3 lg:px-0">
        <MdLibraryBooks />
        <p>{arg}</p>
      </div>
    ),
    Cancelled: (arg) => (
      <div className="flex justify-center gap-2 bg-red-100 rounded-full items-center h-7 text-red-600 font-bold outline lg:w-5/7 px-3 lg:px-0">
        <MdOutlineCancel />
        <p>{arg}</p>
      </div>
    ),
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-light/70 lg:px-[15%] px-[5%]">
      <div className="flex justify-between items-center w-full mt-5 h-10 ">
        {" "}
        <div className="flex gap-2 h-10 items-center  bg-peach px-2 py-1 rounded-lg">
          <MdLibraryBooks className="text-2xl text-purple" />
          <div className="font-bold md:text-xl text-lg text-purple">
            {" "}
            My RFQs
          </div>
        </div>
        <div className="flex pl-2 h-10 items-center bg-purple  py-1  rounded-lg cursor-pointer ">
          {" "}
          <FaPlus className="text-peach" />
          <div className="font-bold w-40 text-center text-peach py-2 h-10">
            {" "}
            Create New Quote
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mt-5 w-full">
        {" "}
        {demo.map((d, idx) => (
          <div
            key={idx}
            className="p-2 lg:w-50 w-35 h-20 bg-white rounded-lg shadow-md"
          >
            <div className="flex gap-4 h-full items-center">
              {d.icon}
              <div>
                {" "}
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm  text-gray-800"> {d.state}</p>{" "}
              </div>{" "}
            </div>
          </div>
        ))}
      </div>
      <div className="lg:bg-white min-h-50 mt-10 rounded-lg px-[1%] py-[2%] space-y-5">
        <p className="text-xl font-bold"> All Request</p>
        {/* Desktop View */}
        <div className="hidden lg:block">
          <table className="w-full ">
            <thead className="hover:bg-gray-50 h-10">
              <tr className="border-b border-gray-300 text-sm font-bold text-gray-500">
                <td className="text-left pl-[2%] ">RFQ ID</td>
                <td className="text-left">Category</td>
                <td className="text-center">Items</td>
                <td className="text-center">Submitted</td>
                <td className="text-left">Status</td>
                <td className="text-right pr-[2%]">Action</td>
              </tr>
            </thead>
            <tbody>
              {allrfq.map((rfq) => (
                <tr
                  key={rfq.id}
                  className="group border-b border-gray-300 text-sm font-bold text-gray-500 h-15 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="text-left pl-[2%] ">{rfq.id}</td>
                  <td className="text-left">{rfq.category}</td>
                  <td className="text-center">{rfq.items}</td>
                  <td className="text-center">{rfq.submitted}</td>
                  <td className="text-center">
                    {statusIcons[rfq.status] &&
                      statusIcons[rfq.status](rfq.status)}
                  </td>
                  <td
                    className={`flex items-center h-15 justify-end pr-[2%] opacity-0 group-hover:opacity-100 transition-opacity`}
                  >
                    <div
                      className="flex items-center justify-center  gap-2 h-10  hover:bg-gray-200 px-4 rounded-lg text-black"
                      onClick={() => navigate(`${pathname}/${rfq.id}`)}
                    >
                      <p> View Details</p> <FaAngleRight />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Tablet and Mobile View */}
        <div className="lg:hidden flex flex-wrap justify-center gap-2 ">
          {" "}
          {allrfq.map((rfq) => (
            <div
              key={rfq.id}
              className="relative px-4 py-6 text-sm   sm:w-4/9 w-full h-50 bg-white rounded-xl cursor-pointer"
              onClick={() => navigate(`${pathname}/${rfq.id}`)}
            >
              <div className="flex justify-between">
                {" "}
                <div className="space-y-2 text-gray-800">
                  <p className="text-black font-bold  ">{rfq.id}</p>
                  <p className="text-lg"> {rfq.category}</p>
                </div>
                <div className="tex">
                  {" "}
                  {statusIcons[rfq.status] &&
                    statusIcons[rfq.status](rfq.status)}
                </div>
              </div>
              <div className="absolute bottom-5 flex justify-between w-11/12">
                <p> {rfq.items} items</p>
                <p> {rfq.submitted}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
