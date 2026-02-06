import React, { useEffect, useRef } from "react";
import Portfolio from "./portfolio";
import RequestQoute from "./requestQ";
import Services from "./services";
import Contact from "./contact";
import Home from "./home";
import Catalog from "./catalog";
import { useContext } from "react";
import { globalContext } from "../App";

export default function LandingPage() {
  const { scrollToSectionValue } = useContext(globalContext);

  const home = useRef(null);
  const services = useRef(null);
  const portfolio = useRef(null);
  const catalog = useRef(null);
  const contact = useRef(null);
  const rfq = useRef(null);

  const section = {
    1: home,
    2: services,
    3: catalog,
    4: portfolio,

    5: contact,
    6: rfq,
  };

  useEffect(() => {
    const scrollToSection = (id) => {
      section[id].current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    };

    scrollToSection(scrollToSectionValue);
  }, [scrollToSectionValue]);
  return (
    <>
      <section ref={home} className="  scroll-mt-15">
        {" "}
        <Home />{" "}
      </section>{" "}
      <section ref={services} className="scroll-mt-15">
        {" "}
        <Services />{" "}
      </section>
      <section ref={catalog} className=" scroll-mt-15">
        <Catalog />{" "}
      </section>{" "}
      <section ref={portfolio} className=" scroll-mt-15">
        {" "}
        <Portfolio />{" "}
      </section>
      <div className="flex flex-col md:flex-row md:px-5">
        <section ref={contact} className="w-full lg:w-7/12 scroll-mt-15">
          <Contact />
        </section>
        <section ref={rfq} className="w-full lg:w-5/12 scroll-mt-15">
          <RequestQoute />
        </section>
      </div>
    </>
  );
}
