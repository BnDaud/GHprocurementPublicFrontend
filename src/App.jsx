import { createContext, useRef, useState } from "react";
import Navbar from "./components/nav";
import Home from "./pages/home";
import Blog from "./pages/blog";
import Portfolio from "./pages/portfolio";
import RequestQoute from "./pages/requestQ";
import Services from "./pages/services";
import Contact from "./pages/contact";
export const globalContext = createContext();

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
  const [dropdown, setDropDown] = useState(false);

  const handledropdown = () => {
    setDropDown(!dropdown);
  };

  return (
    <>
      <globalContext.Provider
        value={{ dropdown, handledropdown, scrollToSection }}
      >
        {" "}
        <div className="fixed w-full top-0 left-0 z-50">
          {" "}
          <Navbar scrollToSection={scrollToSection} />
        </div>
        <main className="pt-15 bg-light/70" onClick={() => setDropDown(false)}>
          <section ref={home} className="  scroll-mt-15">
            {" "}
            <Home />{" "}
          </section>{" "}
          <section ref={services} className="scroll-mt-15">
            {" "}
            <Services />{" "}
          </section>
          <section ref={portfolio} className="h-screen bg-white scroll-mt-15">
            {" "}
            <Portfolio />{" "}
          </section>
          <section ref={blog} className=" scroll-mt-15">
            <Blog />
          </section>
          <div className=" md:flex">
            {" "}
            <section ref={contact} className="w-2/3 scroll-mt-15">
              {" "}
              <Contact />
            </section>
            <section ref={rfq} className="scroll-mt-15">
              {" "}
              <RequestQoute />
            </section>
          </div>
        </main>
      </globalContext.Provider>
    </>
  );
}

export default App;
