import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { globalContext } from "../App";
import { waLink } from "../lib/ui";

// A round button that follows the visitor and opens a WhatsApp chat with the message already started.
export default function WhatsAppButton() {
  const { metadata } = useContext(globalContext);
  const { pathname } = useLocation();
  const href = waLink(metadata, "Hello GH Procurement, I would like to ask about ");
  if (!href || pathname === "/signin" || pathname === "/set-password") return null;
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp" title="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_rgba(28,6,36,.3)] transition-transform duration-300 hover:scale-105">
      <FaWhatsapp className="text-[30px]" aria-hidden="true" />
    </a>
  );
}
