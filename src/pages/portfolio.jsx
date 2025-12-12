import React, { useContext, useState } from "react";
import { AiFillTwitterCircle } from "react-icons/ai";
import { MdOutlineFacebook } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

import Tweets from "../components/tweets";
import Facebook from "../components/facebook";
function Portfolio() {
  const [isActive, setIsActive] = useState("x");

  const [social, setSocial] = useState([
    {
      name: "x",

      tag: (arg1, arg2, isActive) => (
        <div className={arg1} onClick={() => setIsActive("x")}>
          <AiFillTwitterCircle
            className={`text-4xl ${
              isActive === "x" ? "text-purple" : "text-white"
            }`}
          />{" "}
          <p className={arg2}> Twitter</p>
        </div>
      ),
      initial: { x: 30, opacity: 1 },
      exit: { x: -30, opacity: 0 },
    },
    {
      name: "facebook",

      tag: (arg1, arg2, isActive) => (
        <div className={arg1} onClick={() => setIsActive("facebook")}>
          <MdOutlineFacebook
            className={`text-4xl ${
              isActive === "facebook" ? "text-purple" : "text-white"
            }`}
          />
          <p className={arg2}> Facebook</p>
        </div>
      ),
      initial: { x: -30, opacity: 1 },
      exit: { x: 30, opacity: 0 },
    },
  ]);
  return (
    <div className="px-2 md:px-5 lg:px-20 lg:py-20 py-10 space-y-4">
      <div className="flex justify-center gap-4">
        <div className="flex justify-between items-center h-13 px-1 bg-purple w-50 rounded-full overflow-hidden">
          <AnimatePresence mode="wait">
            {social.map((s) =>
              s.name === isActive ? (
                <motion.div
                  key={s.name}
                  initial={s.initial}
                  animate={{ x: 0, opacity: 1 }}
                  exit={s.exit}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  {s.tag(
                    "flex gap-1 h-11 items-center bg-white rounded-full pr-2 pl-1",
                    "block font-bold",
                    s.name
                  )}
                </motion.div>
              ) : (
                // inactive tag must still render (icon only)
                <div key={s.name}>
                  {s.tag("text-4xl cursor-pointer", "hidden")}
                </div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="mt-5">{isActive === "x" ? <Tweets /> : <Facebook />}</div>
    </div>
  );
}

export default Portfolio;
