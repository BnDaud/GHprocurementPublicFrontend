import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { LuArrowRight, LuSearch, LuFileText, LuTruck, LuMapPin, LuX } from "react-icons/lu";
import { globalContext } from "../App";
import Header from "../components/header";
import Spinner from "../components/spinner";
import truck from "../images/truck1.jpg";
import air1 from "../images/air1.jpg";
import air2 from "../images/air2.jpg";
import logoPurple from "../images/logo-purple.png";
import { btnPeach, btnPurple, btnGlass, inputClass, eyebrow, secure, countWord, telHref, money } from "../lib/ui";

const SLIDES = [
  { src: truck, label: "Road freight" },
  { src: air1, label: "Air freight" },
  { src: air2, label: "Global delivery" },
];

const SERVICE_ICONS = [LuSearch, LuFileText, LuTruck, LuMapPin];

const humanize = (value) =>
  (value || "Other")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/^\w/, (c) => c.toUpperCase());

const plainTweet = (text) => (text || "").replace(/https?:\/\/t\.co\/\S+/g, "").replace(/\s+\n/g, "\n").trim();

function Section({ id, className = "", children }) {
  return (
    <section id={id} className={`scroll-mt-4 ${className}`}>
      <div className="mx-auto max-w-[1280px] px-5 sm:px-10">{children}</div>
    </section>
  );
}

function Hero() {
  const { metadata } = useContext(globalContext);
  const navigate = useNavigate();
  const [slide, setSlide] = useState(0);
  const [ref, setRef] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  // the headline is the "Intro" from the CMS Settings; its last words are picked out in peach
  const intro = (metadata?.metaIntro || "").trim() || "Procurement made simple, from the factory to your door.";
  const words = intro.split(/\s+/);
  const headline = words.length > 4 ? { start: words.slice(0, -3).join(" "), end: words.slice(-3).join(" ") } : { start: intro, end: "" };

  const stats = [
    [metadata ? `${metadata.ordersCompleted}+` : null, "Orders completed"],
    [metadata ? String(metadata.suppliers) : null, "Suppliers"],
    [metadata ? `${metadata.experience} yrs` : null, "Average experience"],
    ["Global", "We ship anywhere"], // not a CMS number: a fixed statement
  ];

  const track = (e) => {
    e.preventDefault();
    navigate(`/track?ref=${encodeURIComponent(ref.trim())}&email=${encodeURIComponent(email.trim())}`);
  };

  return (
    <div className="relative bg-aubergine text-white">
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {SLIDES.map((s, i) => (
          <img key={s.label} src={s.src} alt="" className={`absolute inset-0 size-full object-cover transition-opacity duration-[1400ms] ${i === slide ? "opacity-100" : "opacity-0"}`} />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(28,6,36,.94)_0%,rgba(46,10,58,.82)_42%,rgba(46,10,58,.25)_100%)]" />
      </div>

      <Header overlay />

      <div className="relative z-10 mx-auto flex max-w-[1280px] flex-wrap items-center gap-12 px-5 pb-44 pt-12 sm:px-10 sm:pt-14">
        <div className="min-w-0 flex-[1_1_520px]">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/12 px-4 py-2 text-[13px] font-bold uppercase tracking-[.06em] backdrop-blur">
            <span className="size-2 rounded-full bg-peach" /> Sourcing · Contracts · Logistics
          </span>
          <h1 className="mt-6 text-[44px] font-extrabold leading-[1.04] tracking-[-.035em] sm:text-[64px] lg:text-[76px]">
            {headline.start}
            {headline.end && <span className="text-peach"> {headline.end}</span>}
          </h1>
          <p className="mt-6 max-w-[600px] text-lg leading-relaxed text-[#f1e3f5] sm:text-xl">
            {metadata?.metaDescription ||
              "We source quality suppliers, negotiate contracts and coordinate logistics, so your team can focus on what matters."}
          </p>
          <div className="mt-9 flex flex-wrap gap-3.5">
            <Link to="/request" className={`${btnPeach} min-h-14 text-[17px]`}>
              Request a quote <LuArrowRight />
            </Link>
            <button type="button" className={`${btnGlass} min-h-14 text-[17px]`} onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}>
              See our services
            </button>
          </div>
        </div>

        <aside className="min-w-[300px] flex-[0_1_400px] rounded-3xl border border-white/30 bg-white/12 p-7 backdrop-blur-md" aria-labelledby="hero-track">
          <p className="text-[13px] font-bold uppercase tracking-[.08em] text-peach">Already ordered?</p>
          <h2 id="hero-track" className="mb-4 mt-2 text-[26px] font-extrabold">Track your order</h2>
          <form onSubmit={track} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5 text-[13px] font-bold text-[#f1e3f5]">
              Reference
              <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="RFQ-2026-K7M2Q9" className={`${inputClass} !h-12 !text-[#1d1325]`} required />
            </label>
            <label className="flex flex-col gap-1.5 text-[13px] font-bold text-[#f1e3f5]">
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" className={`${inputClass} !h-12 !text-[#1d1325]`} required />
            </label>
            <button type="submit" className="mt-1 inline-flex min-h-[50px] items-center justify-center rounded-xl border border-peach/50 bg-purple font-extrabold text-peach hover:bg-[#33093f]">
              Track
            </button>
          </form>
          <p className="mt-4 text-[13.5px] leading-normal text-[#f1e3f5]">
            Or <Link to="/signin" className="font-extrabold text-white underline">sign in</Link> to see all your requests.
          </p>
        </aside>
      </div>

      <div className="absolute inset-x-0 bottom-[118px] z-10 mx-auto hidden max-w-[1280px] items-center gap-3.5 px-10 sm:flex" aria-label="Slides">
        {SLIDES.map((s, i) => (
          <button key={s.label} type="button" aria-label={`Show ${s.label}`} onClick={() => setSlide(i)} className="flex h-6 items-center">
            <span className={`h-[5px] rounded-full transition-all ${i === slide ? "w-14 bg-peach" : "w-7 bg-white/40"}`} />
          </button>
        ))}
        <span className="ml-1.5 text-[13px] font-bold uppercase tracking-[.06em] text-[#f1e3f5]">{SLIDES[slide].label}</span>
      </div>

      <div className="absolute inset-x-0 -bottom-14 z-20 mx-auto max-w-[1280px] px-5 sm:px-10">
        <div className="grid grid-cols-2 rounded-3xl bg-white text-ink shadow-[0_24px_60px_rgba(46,10,58,.22)] lg:grid-cols-4">
          {stats.map(([value, label], i) => (
            <div key={label} className={`px-6 py-6 sm:px-8 ${i % 2 === 0 ? "border-r border-line" : ""} ${i < 2 ? "border-b border-line lg:border-b-0" : ""} lg:border-r lg:last:border-r-0`}>
              <p className="text-[32px] font-extrabold leading-none tracking-[-.02em] text-purple sm:text-[40px]">
                {value ?? <Spinner className="text-2xl" />}
              </p>
              <p className="mt-1.5 text-sm font-semibold text-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Services() {
  const { service } = useContext(globalContext);
  return (
    <Section id="services" className="pb-24 pt-40">
      <p className={`${eyebrow} mb-2.5`}>What we do</p>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <h2 className="max-w-[640px] text-[36px] font-extrabold leading-[1.08] tracking-[-.025em] text-purple sm:text-5xl">{service?.length ? `${countWord(service.length)} ${service.length === 1 ? "thing" : "things"}, done end to end.` : "What we do, end to end."}</h2>
        <p className="max-w-[440px] text-[17px] leading-relaxed text-[#4b3d54]">Trusted by teams in manufacturing, retail and healthcare.</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {service ? (
          service.map((s, i) => {
            const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
            const tracking = /track/i.test(s.title);
            return (
              <article key={s.id} className={`rounded-3xl p-7 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(66,14,81,.18)] ${tracking ? "bg-purple text-white" : "border border-line bg-white"}`}>
                <span className={`flex size-14 items-center justify-center rounded-2xl ${tracking ? "bg-peach" : "bg-lilac"}`}>
                  <Icon className="text-[26px] text-purple" />
                </span>
                <p className={`mt-5 text-[13px] font-extrabold ${tracking ? "text-peach" : "text-plum"}`}>{String(i + 1).padStart(2, "0")}</p>
                <h3 className={`mb-2.5 mt-1 text-[22px] font-extrabold leading-tight ${tracking ? "text-white" : "text-purple"}`}>{s.title}</h3>
                <p className={`text-[15.5px] leading-relaxed ${tracking ? "text-[#f1e3f5]" : "text-[#4b3d54]"}`}>{s.description}</p>
                {tracking && (
                  <Link to="/track" className="mt-4 inline-flex min-h-11 items-center font-extrabold text-peach">
                    Track an order →
                  </Link>
                )}
              </article>
            );
          })
        ) : (
          <div className="col-span-full flex justify-center py-10"><Spinner className="text-3xl text-purple" /></div>
        )}
      </div>
    </Section>
  );
}

function HowItWorks() {
  const steps = [
    ["Send a request", "Tell us what you need. Your account is created from your email."],
    ["Get your quote", "A formal quotation by email within 48 hours."],
    ["We source and ship", "Purchase, quality check, packing and dispatch."],
    ["Follow it home", "Sign in any time and see it move until delivery."],
  ];
  return (
    <section id="how" className="relative scroll-mt-4 overflow-hidden bg-aubergine py-24 text-white">
      <img src={air1} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(28,6,36,.94)_0%,rgba(28,6,36,.62)_60%,rgba(28,6,36,.25)_100%)]" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-[1280px] flex-wrap items-center gap-14 px-5 sm:px-10">
        <div className="min-w-0 flex-[1_1_420px]">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[.1em] text-peach">How it works</p>
          <h2 className="text-[38px] font-extrabold leading-[1.06] tracking-[-.03em] sm:text-[52px]">One request. One account. Every step in sight.</h2>
          <p className="mt-5 max-w-[520px] text-lg leading-relaxed text-[#f1e3f5]">
            Send a request and your account is created from your email. We quote you, source, check, ship and clear customs, and you watch each step as it happens.
          </p>
          <Link to="/request" className={`${btnPeach} mt-8 min-h-[54px] text-base`}>Start a request</Link>
        </div>
        <ol className="grid min-w-0 flex-[1_1_440px] gap-4 sm:grid-cols-2">
          {steps.map(([title, text], i) => (
            <li key={title} className="rounded-[20px] border border-white/30 bg-white/12 p-5 backdrop-blur">
              <span className="flex size-10 items-center justify-center rounded-full bg-peach font-extrabold text-purple">{i + 1}</span>
              <p className="mb-1 mt-3.5 text-lg font-extrabold">{title}</p>
              <p className="text-[14.5px] leading-normal text-[#f1e3f5]">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProductDialog({ item, currency, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-aubergine/60 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={item.name} onClick={(e) => e.stopPropagation()} className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl md:flex-row">
        <div className="flex h-56 items-center justify-center bg-white p-4 md:h-auto md:w-[45%] md:border-r md:border-line">
          <img src={secure(item.featured_image)} alt={item.name} className="max-h-full max-w-full object-contain" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col p-7">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-[26px] font-extrabold text-purple">{item.name}</h3>
            <button type="button" aria-label="Close" onClick={onClose} className="-mr-2 flex size-11 shrink-0 items-center justify-center rounded-xl hover:bg-lilac"><LuX className="text-xl" /></button>
          </div>
          <p className="mt-1 text-[13px] font-bold uppercase tracking-[.06em] text-plum">{humanize(item.category)}</p>
          {money(item.price, currency) && <p className="mt-3 text-[28px] font-extrabold text-purple">{money(item.price, currency)}</p>}
          {item.min_quantity > 0 && <p className="mt-1 text-sm font-bold text-ink">Minimum order: {item.min_quantity.toLocaleString("en-GB")}</p>}
          <p className="mt-4 flex-1 overflow-y-auto whitespace-pre-line text-[15.5px] leading-relaxed text-[#4b3d54]">{item.description}</p>
          <Link to="/request" state={{ item: `I would like a quote for: ${item.name}` }} className={`${btnPurple} mt-6 min-h-[52px]`}>
            Request a quote
          </Link>
        </div>
      </div>
    </div>
  );
}

function Catalog() {
  const { catalogs, metadata } = useContext(globalContext);
  const currency = metadata?.currency || "USD";
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [open, setOpen] = useState(null);

  const categories = useMemo(() => [...new Set((catalogs || []).map((c) => c.category).filter(Boolean))], [catalogs]);
  const shown = (catalogs || []).filter(
    (c) => (cat === "all" || c.category === cat) && `${c.name} ${c.description}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <Section id="catalog" className="py-24">
      <p className={`${eyebrow} mb-2.5`}>Catalog</p>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <h2 className="text-[36px] font-extrabold leading-[1.08] tracking-[-.025em] text-purple sm:text-5xl">Products we source every day.</h2>
        <label className="flex flex-col gap-1.5 text-[13px] font-bold text-muted">
          Search the catalog
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Power bank, helmet…" className={`${inputClass} !h-[50px] sm:!w-[340px]`} />
        </label>
      </div>
      {categories.length > 1 && (
        <div role="group" aria-label="Filter" className="mb-7 flex flex-wrap gap-2.5">
          {["all", ...categories].map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}
              className={`inline-flex min-h-11 items-center rounded-full px-5 text-sm font-bold transition ${cat === c ? "bg-purple text-peach" : "border border-[#d8c7df] bg-white hover:bg-lilac"}`}>
              {c === "all" ? "All" : humanize(c)}
            </button>
          ))}
        </div>
      )}
      {!catalogs ? (
        <div className="flex justify-center py-16"><Spinner className="text-3xl text-purple" /></div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((c) => (
            <article key={c.id} className="overflow-hidden rounded-[22px] border border-line bg-white transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(66,14,81,.18)]">
              <div className="flex h-[230px] items-center justify-center bg-white p-3.5">
                <img src={secure(c.featured_image)} alt={c.name} loading="lazy" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="bg-blush px-5 pb-5 pt-4">
                <p className="text-[19px] font-extrabold text-purple">{c.name}</p>
                <p className="mt-1.5 line-clamp-2 text-[14.5px] leading-normal text-[#4b3d54]">{c.description}</p>
                {money(c.price, currency) && <p className="mt-2 text-xl font-extrabold text-purple">{money(c.price, currency)}</p>}
                {c.min_quantity > 0 && <p className={`${money(c.price, currency) ? "mt-0.5" : "mt-2"} text-[13px] font-bold text-plum`}>Minimum order: {c.min_quantity.toLocaleString("en-GB")}</p>}
                <span className="block h-2.5" />
                <button type="button" onClick={() => setOpen(c)} className="inline-flex min-h-11 items-center font-extrabold text-purple hover:underline">Read more →</button>
              </div>
            </article>
          ))}
          <Link to="/request" className="flex min-h-[230px] flex-col justify-center gap-2.5 rounded-[22px] bg-purple p-7 text-white">
            <span className="text-[13px] font-extrabold uppercase tracking-[.08em] text-peach">Not listed?</span>
            <span className="text-2xl font-extrabold leading-tight">We buy, customise or build your product of choice.</span>
            <span className="font-extrabold text-peach">Tell us what you need →</span>
          </Link>
          {shown.length === 0 && <p className="col-span-full text-muted">No products match your search.</p>}
        </div>
      )}
      {open && <ProductDialog item={open} currency={currency} onClose={() => setOpen(null)} />}
    </Section>
  );
}

function Promise() {
  return (
    <Section className="pb-24">
      <div className="flex flex-wrap items-stretch gap-6">
        <div className="flex min-w-0 flex-[1_1_520px] flex-col justify-center rounded-[32px] bg-purple p-8 text-white sm:p-14">
          <p className="mb-3.5 text-sm font-extrabold uppercase tracking-[.1em] text-peach">Our promise</p>
          <p className="text-[28px] font-extrabold leading-tight tracking-[-.02em] sm:text-4xl">
            We are licensed with lots of manufacturers in China. We buy, customise or build your product of choice, and ship it anywhere across the globe.
          </p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <Link to="/request" className={btnPeach}>Request a quote</Link>
            <Link to="/track" className={btnGlass}>Track an order</Link>
          </div>
        </div>
        <div className="relative min-h-[380px] min-w-0 flex-[1_1_340px] overflow-hidden rounded-[32px] text-white">
          <img src={air2} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(28,6,36,.78)_0%,rgba(28,6,36,0)_55%)]" />
          <div className="absolute inset-x-7 bottom-6">
            <p className="text-[13px] font-extrabold uppercase tracking-[.08em] text-peach">Air freight</p>
            <p className="mt-1 text-[22px] font-extrabold leading-snug">Lagos, the UK, and anywhere else you ship to.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

function XIcon({ className = "size-5" }) {
  return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
}

function Feed() {
  const { tweets } = useContext(globalContext);
  const [tab, setTab] = useState("x"); // what is on screen
  const [leaving, setLeaving] = useState(false);
  const wrap = useRef(null);
  const posts = tweets && Array.isArray(tweets.data) ? tweets.data : null;
  const media = tweets?.includes?.media || [];

  const mediaFor = (t) => {
    const key = t.attachments?.media_keys?.[0];
    return key ? media.find((m) => m.media_key === key) : null;
  };

  // Switch: the old cards fade out, the box eases to the new height, the new cards fade in one by one.
  const choose = (next) => {
    if (next === tab || leaving) return;
    const el = wrap.current;
    if (el) {
      el.style.height = `${el.offsetHeight}px`;
      el.style.overflow = "hidden";
    }
    setLeaving(true);
    setTimeout(() => {
      setTab(next);
      setLeaving(false);
      requestAnimationFrame(() => {
        if (!el) return;
        const from = el.offsetHeight;
        el.style.height = "auto"; // measure the new content at its natural height
        const to = el.offsetHeight;
        el.style.height = `${from}px`;
        void el.offsetHeight; // apply the old height first, so the change below animates
        el.style.height = `${to}px`;
        setTimeout(() => {
          el.style.height = "";
          el.style.overflow = "";
        }, 600);
      });
    }, 320);
  };

  // each card gets its own delay, so they appear (and leave) in a wave
  const anim = (i) => ({ "--i": i });
  const cls = `feed-card ${leaving ? "feed-out" : "feed-in"}`;

  return (
    <section className="border-t border-[#f0e4ea] bg-white py-24">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-10">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div>
            <p className={`${eyebrow} mb-2.5`}>From our feed</p>
            <h2 className="text-[36px] font-extrabold leading-[1.08] tracking-[-.025em] text-purple sm:text-5xl">Latest from @GHprocure on {tab === "x" ? "X" : "Facebook"}.</h2>
          </div>
          <div role="group" aria-label="Feed" className="relative grid grid-cols-2 rounded-full bg-lilac p-1.5">
            <span
              aria-hidden="true"
              className="absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] rounded-full bg-purple shadow-md transition-transform duration-[450ms] ease-[cubic-bezier(.2,.7,.2,1)]"
              style={{ transform: tab === "x" ? "translateX(0)" : "translateX(100%)" }}
            />
            {[["x", "X", <XIcon key="x" className="size-4" />], ["fb", "Facebook", <FaFacebook key="fb" className="size-[18px]" />]].map(([k, label, icon]) => (
              <button key={k} type="button" aria-pressed={tab === k} onClick={() => choose(k)}
                className={`relative z-10 inline-flex min-h-11 min-w-[8.5rem] cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-sm font-extrabold transition-colors duration-300 ${tab === k ? "text-peach" : "text-purple"}`}>
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>

        <div ref={wrap} className="transition-[height] duration-[550ms] ease-[cubic-bezier(.2,.7,.2,1)]" aria-live="polite">
          {tab === "fb" ? (
            <div key="fb" className="grid auto-rows-fr items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
              <a href="https://x.com/GHprocure" target="_blank" rel="noreferrer" className={`${cls} flex min-h-[230px] flex-col justify-center gap-2.5 rounded-[22px] bg-purple p-7 text-white`} style={anim(0)}>
                <FaFacebook className="size-8 text-peach" aria-hidden="true" />
                <span className="text-[13px] font-extrabold uppercase tracking-[.08em] text-peach">Facebook</span>
                <span className="text-2xl font-extrabold leading-tight">Facebook posts are coming soon.</span>
                <span className="font-extrabold text-peach">Meanwhile, follow us on X →</span>
              </a>
            </div>
          ) : !tweets ? (
            <div className="flex justify-center py-16"><Spinner className="text-3xl text-purple" /></div>
          ) : !posts ? (
            <p className="rounded-3xl bg-blush p-10 text-center text-lg font-bold text-muted">Posts are not available right now.</p>
          ) : (
            <div key="x" className="grid auto-rows-fr items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 9).map((t, i) => {
                const m = mediaFor(t);
                const mp4 = m?.type === "video" ? (m.variants || []).filter((v) => v.content_type === "video/mp4").sort((a, b) => (b.bit_rate || 0) - (a.bit_rate || 0))[0] : null;
                return (
                  <article key={t.id} className={`${cls} flex h-full flex-col overflow-hidden rounded-[22px] border border-line bg-blush`} style={anim(i)}>
                    {/* every card has the same media area, so all cards are the same height */}
                    {m?.type === "photo" ? (
                      <img src={m.url} alt="" loading="lazy" className="h-52 w-full shrink-0 object-cover" />
                    ) : mp4 ? (
                      <video controls preload="none" poster={m.preview_image_url} className="h-52 w-full shrink-0 bg-black object-contain"><source src={mp4.url} type="video/mp4" /></video>
                    ) : (
                      <div aria-hidden="true" className="flex h-52 w-full shrink-0 items-center justify-center bg-gradient-to-br from-purple to-aubergine text-peach"><XIcon className="size-14 opacity-90" /></div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <header className="flex items-center gap-3">
                        <span className="flex size-11 items-center justify-center overflow-hidden rounded-full border border-line bg-white"><img src={logoPurple} alt="" className="w-8" /></span>
                        <span className="flex-1 leading-tight"><b className="block text-[15px]">GH Procurement</b><span className="text-[13.5px] text-muted">@GHprocure</span></span>
                        <XIcon />
                      </header>
                      <p className="mt-4 line-clamp-4 min-h-[6.5rem] whitespace-pre-line text-base leading-relaxed text-[#2b1f33]">{plainTweet(t.text)}</p>
                      <a href={`https://x.com/i/web/status/${t.id}`} target="_blank" rel="noreferrer" className="mt-auto inline-flex min-h-11 items-center pt-2 text-sm font-extrabold text-purple hover:underline">View on X →</a>
                    </div>
                  </article>
                );
              })}
              <a href="https://x.com/GHprocure" target="_blank" rel="noreferrer" className={`${cls} flex min-h-[200px] flex-col justify-center gap-3 rounded-[22px] bg-purple p-7 text-white`} style={anim(Math.min(posts.length, 9))}>
                <span className="text-[22px] font-extrabold leading-snug">Follow us for new products and shipping updates.</span>
                <span className="inline-flex min-h-12 items-center self-start rounded-xl bg-peach px-5 font-extrabold text-purple">Follow @GHprocure</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FaqContact() {
  const { FAQ, metadata } = useContext(globalContext);
  return (
    <Section id="contact" className="py-24">
      <div className="flex flex-wrap items-start gap-8">
        <div className="min-w-0 flex-[1_1_520px]">
          <p className={`${eyebrow} mb-2.5`}>FAQ</p>
          <h2 className="mb-7 text-[34px] font-extrabold leading-[1.08] tracking-[-.025em] text-purple sm:text-[44px]">Questions, answered.</h2>
          <div className="flex flex-col gap-2.5">
            {FAQ ? (
              FAQ.map((f) => (
                <details key={f.id} className="group rounded-2xl border border-line bg-white px-5 py-1.5">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-[16.5px] font-extrabold text-purple">
                    {f.question}
                    <span className="text-2xl font-bold transition group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="pb-4 text-[15.5px] leading-relaxed text-[#4b3d54]">{f.answer}</p>
                </details>
              ))
            ) : (
              <div className="flex justify-center py-10"><Spinner className="text-3xl text-purple" /></div>
            )}
          </div>
        </div>
        <aside className="min-w-0 flex-[1_1_360px] rounded-[32px] bg-purple p-8 text-[#f1e3f5] sm:p-11" aria-labelledby="contact-t">
          <h2 id="contact-t" className="mb-6 text-[34px] font-extrabold tracking-[-.02em] text-peach">Contact us</h2>
          {metadata ? (
            <dl className="flex flex-col gap-4.5 gap-y-[18px]">
              {[["Email", metadata.email, `mailto:${metadata.email}`], ["Phone", metadata.phone, telHref(metadata.phone)], ["Office", metadata.office]].map(([k, v, href]) => (
                <div key={k}>
                  <dt className="text-[12.5px] font-extrabold uppercase tracking-[.08em] text-peach">{k}</dt>
                  <dd className="mt-1 text-lg font-bold">{href ? <a href={href} className="hover:underline">{v}</a> : v}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <Spinner className="text-3xl" />
          )}
          <Link to="/request" className={`${btnPeach} mt-8 min-h-[54px] text-base`}>Request a quote</Link>
        </aside>
      </div>
    </Section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <HowItWorks />
      <Catalog />
      <Promise />
      <Feed />
      <FaqContact />
    </>
  );
}
