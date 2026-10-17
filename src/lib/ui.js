// class strings shared by the pages
export const btnPeach =
  "inline-flex items-center justify-center gap-2 min-h-12 px-7 rounded-[14px] bg-peach text-purple font-extrabold hover:brightness-95 transition disabled:opacity-60";
export const btnPurple =
  "inline-flex items-center justify-center gap-2 min-h-12 px-7 rounded-[14px] bg-purple text-peach font-extrabold hover:bg-[#33093f] transition disabled:opacity-60";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 min-h-12 px-7 rounded-[14px] border-2 border-purple text-purple font-extrabold hover:bg-lilac transition";
export const btnGlass =
  "inline-flex items-center justify-center gap-2 min-h-12 px-7 rounded-[14px] bg-white/12 border border-white/30 backdrop-blur text-white font-extrabold hover:bg-white/20 transition";
export const inputClass =
  "h-[52px] w-full rounded-[14px] border border-[#cdbfd4] bg-white px-4 text-[15.5px] outline-none focus:border-purple focus:ring-4 focus:ring-[#d9b6e3]/60 placeholder:text-[#8d7f96]";
export const labelClass = "flex flex-col gap-1.5 text-sm font-bold";
export const eyebrow = "text-[13px] font-extrabold tracking-[.1em] uppercase text-plum";

export const dateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : "";
export const dayMonth = (iso) => (iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "");
export const longDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "";

// images saved with an http:// address would be blocked on an https page
export const secure = (url) => (url ? String(url).replace(/^http:\/\//, "https://") : url);
const WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
export const countWord = (n) => WORDS[n] ?? String(n);
// FAQ answers can say {phone}, {whatsapp}, {email} and {office}: the site fills them in from the CMS Settings,
// so a changed number or address updates everywhere by itself.
export const fillContact = (text, metadata) =>
  String(text ?? "")
    .replace(/\{phone\}/gi, metadata?.phone || "our phone number")
    .replace(/\{whatsapp\}/gi, metadata?.whatsapp_number || metadata?.phone || "our WhatsApp number")
    .replace(/\{email\}/gi, metadata?.email || "our email address")
    .replace(/\{office\}/gi, metadata?.office?.trim() || "our office");

export const telHref = (phone) => `tel:${String(phone || "").replace(/[^\d+]/g, "")}`;

// Prices are shown in the currency chosen in the CMS Settings (US dollars until one is chosen).
const LOCALES = { NGN: "en-NG", GBP: "en-GB", EUR: "en-IE", ZAR: "en-ZA", GHS: "en-GH", AED: "en-AE", CNY: "zh-CN" };
export const money = (value, currency = "USD") => {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return "";
  try {
    return n.toLocaleString(LOCALES[currency] || "en-US", { style: "currency", currency });
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
};

// A WhatsApp chat link with the message already typed. The number is the "WhatsApp number" in the CMS Settings,
// or the phone number when that is empty. A local number starting with 0 is read as Nigerian.
export const waLink = (metadata, text = "") => {
  let digits = String(metadata?.whatsapp_number || metadata?.phone || "").replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `234${digits.slice(1)}`;
  return digits ? `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}` : "";
};
