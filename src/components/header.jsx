import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuMenu, LuX } from "react-icons/lu";
import { globalContext } from "../App";
import { clearSession, markSignedOut } from "../auth/customer";
import logoWhite from "../images/logo-white.png";

const SECTIONS = [
  ["Services", "services"],
  ["Catalog", "catalog"],
  ["How it works", "how"],
  ["Contact", "contact"],
];

// overlay: sits on a photo (white text). solid: its own purple bar.
export default function Header({ overlay = false }) {
  const { session } = useContext(globalContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // the mobile menu closes by itself when the page changes
  const [openOn, setOpenOn] = useState(null);
  const open = openOn === pathname;
  const setOpen = (v) => setOpenOn(typeof v === "function" ? (v(open) ? pathname : null) : v ? pathname : null);

  const goSection = (id) => {
    setOpen(false);
    if (pathname === "/") document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    else navigate("/", { state: { scrollTo: id } });
  };

  const signOut = () => {
    markSignedOut();
    navigate("/", { replace: true });
    clearSession();
  };

  const link = "inline-flex items-center min-h-11 font-bold text-[15px] hover:text-peach transition-colors cursor-pointer";
  const pill =
    "inline-flex items-center min-h-11 px-5 rounded-xl border border-white/30 bg-white/12 backdrop-blur font-bold text-[15px] hover:bg-white/20 transition";
  const cta = "inline-flex items-center min-h-11 px-5 rounded-xl bg-peach text-purple font-extrabold text-[15px] hover:brightness-95 transition";

  const nav = (
    <>
      {SECTIONS.map(([label, id]) => (
        <button key={id} type="button" onClick={() => goSection(id)} className={link}>
          {label}
        </button>
      ))}
      {session ? (
        <>
          <Link to="/account" className={link}>
            My requests
          </Link>
          <button type="button" onClick={signOut} className={pill}>
            Sign out
          </button>
        </>
      ) : (
        <Link to="/signin" className={pill}>
          Sign in
        </Link>
      )}
      <Link to="/request" className={cta}>
        RFQ / Buy
      </Link>
    </>
  );

  return (
    <header className={overlay ? "relative z-20 text-white" : "relative z-20 bg-purple text-white"}>
      <div className="mx-auto flex min-h-[84px] max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-10">
        <Link to="/" aria-label="GH Procurement, home">
          <img src={logoWhite} alt="Gadgets Home" className="h-10 w-auto sm:h-11" />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {nav}
        </nav>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex size-11 items-center justify-center rounded-xl border border-white/30 bg-white/12 lg:hidden"
        >
          {open ? <LuX className="text-xl" /> : <LuMenu className="text-xl" />}
        </button>
      </div>
      {open && (
        <nav aria-label="Main" className="absolute inset-x-0 top-full flex flex-col items-start gap-1 bg-aubergine px-5 pb-6 pt-2 shadow-xl lg:hidden">
          {nav}
        </nav>
      )}
    </header>
  );
}

