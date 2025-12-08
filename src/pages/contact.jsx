import React, { useContext, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { globalContext } from "../App";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
function Contact() {
  const { FAQ, metadata } = useContext(globalContext);

  /*  const [FAQ, setFAQ] = useState([
    {
      subject: "how long does a typical procurement take ?",
      answer:
        "Timeline varies by category; typical lead times are 2–8 weeks depending on complexity.",
    },
    {
      subject: "What payment methods do you accept?",
      answer:
        "Bank transfer, card, or payment on delivery depending on contract terms.",
    },
    {
      subject: "Can you manage international shipping?",
      answer:
        "Yes — we coordinate shipping, customs clearance, and local logistics partners.",
    },
  ]); */

  const [showFaq, setShowFaq] = useState(null);

  const toggleFaq = (index) => {
    setShowFaq(showFaq === index ? null : index);
  };

  return (
    <div className="w-full min-h-100  px-6 md:px-0 pb-20 space-y-4">
      <p className="text-xl font-bold"> Contact & Request For Quote (RFQ)</p>
      <div className="w-full min-h-85 p-4 bg-white rounded-2xl">
        <p className="text-xl font-bold">Contact Us</p>
        {metadata ? (
          <>
            {" "}
            <p className="text-gray"> Email :{metadata.email}</p>
            <p className="text-gray"> Phone : {metadata.phone}</p>
            <p className="text-gray"> Office: {metadata.office}</p>
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-30 ">
            <AiOutlineLoading3Quarters className="text-3xl animate-spin text-purple" />
          </div>
        )}
        <p className="border border-purple my-2"></p>
        <div>
          <p className="text-xl font-bold uppercase">FAQ</p>
          <div className="space-y-2 mt-2">
            {" "}
            {FAQ ? (
              FAQ.map((faq, index) => {
                return (
                  <div key={index}>
                    {/* Header */}
                    <div
                      className="flex items-center justify-between w-full py-2 px-3 border border-gray rounded-xl cursor-pointer"
                      onClick={() => toggleFaq(index)}
                    >
                      <p>{faq.question}</p>

                      <FaPlus
                        className={`text-xs transition-all duration-500 ${
                          showFaq === index ? "rotate-135" : ""
                        }`}
                      />
                    </div>

                    {/* Animated Content */}
                    <div
                      className={`overflow-hidden transition-all duration-700 ${
                        showFaq === index
                          ? "max-h-40 opacity-100 mt-2"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="px-3 py-2 text-gray-600">{faq.answer}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex items-center justify-center w-full h-50 ">
                <AiOutlineLoading3Quarters className="text-3xl animate-spin text-purple" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
