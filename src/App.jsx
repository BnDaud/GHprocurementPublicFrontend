import { createContext, useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import API from "./endpoint/base";
import { getSession, onSessionChange } from "./auth/customer";
import WhatsAppButton from "./components/whatsapp";
import Footer from "./components/footer";
import Home from "./pages/home";
import Rfq from "./pages/rfq";
import Sent from "./pages/sent";
import SignIn from "./pages/signin";
import SetPassword from "./pages/setpassword";
import Account from "./pages/account";
import Track from "./pages/track";
import { useSeo, SITE } from "./components/seo";
import { secure, fillContact } from "./lib/ui";

export const globalContext = createContext({});

// every page change starts at the top, unless it asked for a section of the home page
function ScrollManager() {
  const { pathname, state } = useLocation();
  useEffect(() => {
    if (pathname === "/" && state?.scrollTo) {
      const t = setTimeout(() => document.getElementById(state.scrollTo)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, state]);
  return null;
}

const HOME_TITLE = "GH Procurement | Sourcing & Logistics in Lagos, Nigeria";
const HOME_DESCRIPTION =
  "GH Procurement sources quality suppliers, negotiates contracts and ships anywhere in the world. Request a quote and track your order online. Lagos, Nigeria.";

// The title and search description for every page. Only the home page is for search engines.
const PAGES = {
  "/request": ["Request a quote | GH Procurement", "Tell us what you need and we will send a formal quotation within 48 hours. Sourcing, contracts and logistics from Lagos, Nigeria."],
  "/sent": ["Request received | GH Procurement", "Your quote request has been received."],
  "/signin": ["Sign in | GH Procurement", "Sign in to follow your quote requests and orders."],
  "/set-password": ["Choose your password | GH Procurement", "Choose a password for your GH Procurement account."],
  "/account": ["My requests | GH Procurement", "Your quote requests and where each one is now."],
  "/track": ["Track an order | GH Procurement", "Follow your order from our store to your door."],
};

function RouteSeo() {
  const { pathname } = useLocation();
  const { FAQ, catalogs, metadata } = useContext(globalContext);
  const home = pathname === "/";
  const key = Object.keys(PAGES).find((k) => pathname === k || pathname.startsWith(k + "/"));
  // the home page description is the CMS description (cut to the length search engines show)
  const cms = (metadata?.metaDescription || "").trim();
  const homeDescription = cms.length >= 70 ? (cms.length > 160 ? cms.slice(0, 157).replace(/\s+\S*$/, "") + "..." : cms) : HOME_DESCRIPTION;
  const [title, description] = home ? [HOME_TITLE, homeDescription] : PAGES[key] || [HOME_TITLE, HOME_DESCRIPTION];
  const jsonLd = [];
  if (home && metadata) {
    // business details straight from the CMS, so search results always match the site
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${SITE}/#organization-details`,
      name: "GH Procurement",
      url: `${SITE}/`,
      telephone: metadata.phone,
      email: metadata.email,
      address: { "@type": "PostalAddress", streetAddress: String(metadata.office || "").replace(/\s+/g, " ").trim(), addressCountry: "NG" },
    });
  }
  if (home && FAQ?.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: fillContact(f.answer, metadata) } })),
    });
  }
  if (home && catalogs?.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "GH Procurement catalog",
      itemListElement: catalogs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "Product", name: c.name, description: c.description, image: secure(c.featured_image), url: `${SITE}/` },
      })),
    });
  }
  // pages for signed-in customers, and the form steps, are not for search results
  useSeo({ title, description, path: pathname, noindex: !(home || pathname === "/request"), jsonLd });
  return null;
}

function App() {
  const [data, setData] = useState({ metadata: null, service: null, catalogs: null, FAQ: null, showcase: null, tweets: null });
  const [session, setSession] = useState(getSession);

  useEffect(() => onSessionChange(() => setSession(getSession())), []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(API.alldata());
        if (!res.ok) throw new Error("server down");
        const d = await res.json();
        if (!alive) return;
        setData({ metadata: d.metadata?.[0] ?? null, service: d.service, catalogs: d.catalogs, FAQ: d.faq, showcase: d.showcase, tweets: d.twitter });
      } catch (err) {
        console.log(err);
        if (alive) setData((p) => ({ ...p, failed: true }));
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <globalContext.Provider value={{ ...data, session }}>
      <BrowserRouter>
        <ScrollManager />
        <RouteSeo />
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/request" element={<Rfq />} />
              <Route path="/sent" element={<Sent />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/set-password" element={<SetPassword />} />
              <Route path="/account" element={<Account />} />
              <Route path="/account/:id" element={<Track />} />
              <Route path="/track" element={<Track />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </BrowserRouter>
    </globalContext.Provider>
  );
}

export default App;
