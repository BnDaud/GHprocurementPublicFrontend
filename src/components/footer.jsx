import { useContext } from "react";
import { Link } from "react-router-dom";
import logoWhite from "../images/logo-white.png";
import { globalContext } from "../App";
import { telHref } from "../lib/ui";

export default function Footer() {
  const { metadata } = useContext(globalContext);
  const year = new Date().getFullYear();
  const link = "inline-flex min-h-11 items-center font-bold text-[14.5px] hover:text-peach";
  return (
    <footer className="bg-aubergine text-[#d9c3df]">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-x-8 gap-y-4 px-5 py-10 sm:px-10">
        <img src={logoWhite} alt="Gadgets Home" className="h-11 w-auto" />
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6">
          <Link to="/" className={link}>Home</Link>
          <Link to="/track" className={link}>Track an order</Link>
          <Link to="/signin" className={link}>Sign in</Link>
          <Link to="/request" className={link}>RFQ / Buy</Link>
        </nav>
        <div className="text-[13.5px] sm:text-right">
          {metadata && (
            <p className="mb-1">
              <a href={`mailto:${metadata.email}`} className="hover:text-peach">{metadata.email}</a>
              <span aria-hidden="true"> · </span>
              <a href={telHref(metadata.phone)} className="hover:text-peach">{metadata.phone}</a>
            </p>
          )}
          <p>© 2021–{year} GH Procurement. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
