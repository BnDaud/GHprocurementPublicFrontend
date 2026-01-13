import { createContext, useEffect, useRef, useState } from "react";
import Navbar from "./components/nav";
import Home from "./pages/home";
import { FaRegCopyright } from "react-icons/fa";
import Portfolio from "./pages/portfolio";
import RequestQoute from "./pages/requestQ";
import Services from "./pages/services";
import Contact from "./pages/contact";
import API from "./endpoint/base";
import Catalog from "./pages/catalog";

export const globalContext = createContext();

function App() {
  const currenYear = new Date().getFullYear();

  const [metadata, setMetadata] = useState(null);
  const [service, setServices] = useState(null);
  const [catalogs, setCatalogs] = useState(null);
  const [FAQ, setFAQ] = useState(null);
  const [tweets, setTweets] = useState(null);

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

  useEffect(() => {
    const url = API.alldata();

    const fetchAllData = async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("server down");
        const data = await res.json();

        console.log(data);

        setFAQ(data.faq);
        setMetadata(data.metadata[0]);
        setCatalogs(data.catalogs);
        setServices(data.service);
        setTweets(data.twitter);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllData();
  }, []);

  return (
    <>
      <globalContext.Provider
        value={{
          dropdown,
          handledropdown,
          scrollToSection,
          catalogs,
          metadata,
          service,
          FAQ,
          tweets,
        }}
      >
        {" "}
        <div className="fixed w-full  top-0 left-0 z-10">
          <Navbar scrollToSection={scrollToSection} />
        </div>
        <main
          className="pt-14 sm:pt-16 bg-light/70"
          onClick={() => setDropDown(false)}
        >
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
        </main>
        <footer>
          <div className="flex items-center justify-center gap-4 bg-peach w-full h-15 text-sm text-gray">
            {" "}
            <FaRegCopyright />{" "}
            <p> 2021 - {currenYear} Gh Procurement. All rights reserved.</p>
          </div>
        </footer>
      </globalContext.Provider>
    </>
  );
}

export default App;
