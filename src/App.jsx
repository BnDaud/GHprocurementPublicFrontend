import { useRef, useState } from "react";
import Navbar from "./components/nav";
import Home from "./pages/home";
import Blog from "./pages/blog";
import Portfolio from "./pages/portfolio";
import RequestQoute from "./pages/requestQ";
import Services from "./pages/services";
import Contact from "./pages/contact";

function App() {
  const home = useRef(null);
  const services = useRef(null);
  const portfolio = useRef(null);
  const blog = useRef(null);
  const contact = useRef(null);
  const rfq = useRef(null);

  const section = {
    1: home,
    2: services,
    3: portfolio,
    4: blog,
    5: contact,
    6: rfq,
  };
  const scrollToSection = (id) => {
    section[id].current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };
  return (
    <>
      <Navbar scrollToSection={scrollToSection} />
      <section ref={home} className="h-screen bg-amber-300">
        {" "}
        <Home />{" "}
      </section>{" "}
      <section ref={services} className="h-screen bg-black">
        {" "}
        <Services />{" "}
      </section>
      <section ref={portfolio} className="h-screen bg-white">
        {" "}
        <Portfolio />{" "}
      </section>
      <section ref={blog} className="h-screen bg-black">
        <Blog />
      </section>
      <section ref={contact} className="h-screen bg-white">
        {" "}
        <Contact />
      </section>
      <section ref={rfq} className="h-screen bg-black">
        {" "}
        <RequestQoute />
      </section>
    </>
  );
}

export default App;
