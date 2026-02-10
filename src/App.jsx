import { createContext, useEffect, useRef, useState } from "react";
import Navbar from "./components/nav";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { FaRegCopyright } from "react-icons/fa";

import API from "./endpoint/base";

import LandingPage from "./pages/landingpage";
import Loign from "./Auth/login";
import NotFound from "./pages/notFound";
import UserRfq from "./pages/userRFQ";
import RfqDetail from "./pages/RfqDetail";

export const globalContext = createContext();

function App() {
  const currenYear = new Date().getFullYear();

  const homeurl = window.location.origin;
  const location = useLocation();
  const navigate = useNavigate();

  console.log(homeurl);
  console.log(location);

  const [metadata, setMetadata] = useState(null);
  const [service, setServices] = useState(null);
  const [catalogs, setCatalogs] = useState(null);
  const [FAQ, setFAQ] = useState(null);
  const [tweets, setTweets] = useState(null);
  const [scrollToSectionValue, setScrollToSectionValue] = useState(1);

  const [dropdown, setDropDown] = useState(false);

  const handledropdown = () => {
    setDropDown(!dropdown);
  };

  useEffect(() => {
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;

      const timer = setTimeout(() => {
        setScrollToSectionValue(sectionId);

        navigate(location.pathname, { replace: true, state: {} });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location]);

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
          scrollToSectionValue,
          setScrollToSectionValue,
          catalogs,
          metadata,
          service,
          FAQ,
          tweets,
        }}
      >
        {" "}
        <div className="fixed w-full  top-0 left-0 z-10">
          <Navbar />
        </div>
        <main
          className="pt-14 sm:pt-16 bg-light/70"
          onClick={() => setDropDown(false)}
        >
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<Loign />} />
            <Route path="/userrfq" element={<UserRfq />} />
            <Route path="/userrfq/:id" element={<RfqDetail />} />
          </Routes>
        </main>
        <footer>
          <div className=" flex items-center justify-center gap-4 bg-peach w-full h-15 text-sm text-gray">
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
