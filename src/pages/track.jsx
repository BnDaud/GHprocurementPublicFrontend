import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import { globalContext } from "../App";
import Header from "../components/header";
import Spinner from "../components/spinner";
import { RouteCard, Stepper, UpdatesFeed } from "../components/tracker";
import AcceptCard from "../components/acceptcard";
import PayCard from "../components/paycard";
import MessagesCard from "../components/messages";
import { DocumentsCard, ShipmentCard } from "../components/shipment";
import { api, errorText, getSession, justSignedOut } from "../auth/customer";
import API from "../endpoint/base";
import air1 from "../images/air1.jpg";
import { btnPeach, btnPurple, inputClass, labelClass, longDate, waLink } from "../lib/ui";

function Banner({ children }) {
  return (
    <section className="relative overflow-hidden bg-aubergine pb-36 text-white">
      <img src={air1} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" style={{ objectPosition: "center 55%" }} />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(28,6,36,.94)_0%,rgba(46,10,58,.78)_55%,rgba(46,10,58,.3)_100%)]" aria-hidden="true" />
      <div className="relative">
        <Header overlay />
        <div className="mx-auto max-w-[1280px] px-5 pt-6 sm:px-10">{children}</div>
      </div>
    </section>
  );
}

// the form for tracking without signing in
function GuestForm({ initial, error }) {
  const navigate = useNavigate();
  const [ref, setRef] = useState(initial.ref);
  const [email, setEmail] = useState(initial.email);
  const submit = (e) => {
    e.preventDefault();
    navigate(`/track?ref=${encodeURIComponent(ref.trim())}&email=${encodeURIComponent(email.trim())}`);
  };
  return (
    <div className="bg-cream">
      <Banner>
        <h1 className="text-[40px] font-extrabold leading-[1.05] tracking-[-.03em] sm:text-[56px]">Track your order</h1>
        <p className="mt-3.5 text-lg text-[#f1e3f5]">Enter the reference from your email and the address you used.</p>
      </Banner>
      <main className="relative mx-auto -mt-20 max-w-[560px] px-5 pb-20">
        <form onSubmit={submit} className="flex flex-col gap-[18px] rounded-[28px] bg-white p-8 shadow-[0_24px_60px_rgba(46,10,58,.18)] sm:p-10">
          <label className={labelClass}>Reference<input className={inputClass} value={ref} onChange={(e) => setRef(e.target.value)} placeholder="RFQ-2026-K7M2Q9" required /></label>
          <label className={labelClass}>Email<input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" required /></label>
          {error && <p role="alert" className="rounded-xl bg-[#fdeceb] px-4 py-3 text-sm font-semibold text-[#8a1f15]">{error}</p>}
          <button type="submit" className={`${btnPurple} min-h-14 text-[17px]`}>Track</button>
          <p className="text-sm text-muted">Have an account? <Link to="/signin" className="font-extrabold text-purple underline">Sign in</Link> to see all your requests.</p>
        </form>
      </main>
    </div>
  );
}

function TrackView() {
  const here = useLocation();
  const { id } = useParams();
  const [params] = useSearchParams();
  const { session, metadata } = useContext(globalContext);
  const ref = params.get("ref") || "";
  const email = params.get("email") || "";
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const hasData = useRef(false);

  // load the order, and again when the tab comes back or every minute, so new updates show up by themselves
  useEffect(() => {
    let alive = true;
    const run = async () => {
      let res = null;
      if (id) {
        if (!session) return;
        res = await api(API.customer.request(id), { auth: true });
      } else if (ref && email) {
        res = await api(API.customer.track(), { method: "POST", body: { reference: ref, email } });
      }
      if (!alive || !res) return;
      if (res.ok) {
        hasData.current = true;
        setData(res.data);
        setError("");
      } else if (res.status !== 401 && (res.status === 404 || !hasData.current)) {
        // a failed refresh must not wipe an order that is already on screen
        setError(res.status === 404 ? (id ? "We could not find that request." : "We could not find a request with that reference and email.") : errorText(res));
      }
    };
    run();
    const again = () => document.visibilityState === "visible" && run();
    const timer = setInterval(again, 60000);
    window.addEventListener("focus", again);
    document.addEventListener("visibilitychange", again);
    return () => {
      alive = false;
      clearInterval(timer);
      window.removeEventListener("focus", again);
      document.removeEventListener("visibilitychange", again);
    };
  }, [id, ref, email, session]);

  // the email behind one update, as HTML text (signed in: by order; guest: by reference and email)
  const loadEmail = useCallback(
    async (u) => {
      try {
        const s = getSession();
        const res = id
          ? await fetch(API.customer.updateEmail(id, u.id), { headers: s ? { Authorization: `Bearer ${s.token}` } : {} })
          : await fetch(API.customer.trackEmail(), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reference: ref, email, update: u.id }) });
        return res.ok ? await res.text() : null;
      } catch {
        return null;
      }
    },
    [id, ref, email]
  );

  if (id && !session) return justSignedOut() ? <Navigate to="/" replace /> : <Navigate to="/signin" replace state={{ from: here.pathname }} />;
  if (!id && (!ref || !email || error)) return <GuestForm initial={{ ref, email }} error={error} />;

  if (error) return (
    <div className="bg-cream"><Banner><h1 className="text-4xl font-extrabold">Request not found</h1></Banner>
      <main className="relative mx-auto -mt-20 max-w-[560px] px-5 pb-20"><div className="rounded-[28px] bg-white p-8 shadow-[0_24px_60px_rgba(46,10,58,.18)]"><p role="alert" className="font-semibold text-[#8a1f15]">{error}</p><Link to="/account" className="mt-4 inline-flex min-h-11 items-center font-extrabold text-purple underline">Back to my requests</Link></div></main></div>
  );

  if (!data) return <div className="flex min-h-screen items-center justify-center bg-cream"><Spinner className="text-4xl text-purple" /></div>;

  const delivered = data.status === "delivered";
  const deliveredOn = data.stages.find((x) => x.key === "delivered")?.date || data.updates[0]?.created_at;

  return (
    <div className="bg-cream">
      <Banner>
        {id ? <Link to="/account" className="inline-flex min-h-11 items-center text-[15px] font-bold text-peach">← All my requests</Link> : <Link to="/track" className="inline-flex min-h-11 items-center text-[15px] font-bold text-peach">← Track another order</Link>}
        <div className="mt-2.5 flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-[#f1e3f5]">{data.reference} · sent {longDate(data.created_at)}</p>
            <h1 className="mt-1.5 text-[38px] font-extrabold leading-[1.05] tracking-[-.03em] break-words sm:text-[56px]">{data.title}</h1>
          </div>
          <div className="rounded-[18px] border border-white/30 bg-white/12 px-6 py-4 backdrop-blur sm:text-right">
            <p className="text-[12.5px] font-extrabold uppercase tracking-[.08em] text-peach">{delivered ? "Delivered on" : "Estimated delivery"}</p>
            <p className="mt-0.5 text-2xl font-extrabold">{delivered ? longDate(deliveredOn) : data.estimated_delivery ? longDate(data.estimated_delivery) : "We will confirm soon"}</p>
          </div>
        </div>
      </Banner>

      <main className="relative mx-auto -mt-24 max-w-[1280px] px-5 pb-20 sm:px-10">
        <Stepper stages={data.stages} step={data.step} total={data.steps} />
        <div className="mt-7 flex flex-wrap items-start gap-7">
          <div className="min-w-0 flex-[1_1_600px]">{id && data.status === "confirmed" && <PayCard />}{id && data.status === "quoted" && <AcceptCard id={id} onAccepted={(d) => { hasData.current = true; setData(d); }} />}<UpdatesFeed updates={data.updates} loadEmail={loadEmail} reference={data.reference} /></div>
          <aside className="flex min-w-0 flex-[1_1_340px] flex-col gap-5">
            <RouteCard step={data.step} total={data.steps} address={data.delivery_address} estimate={data.estimated_delivery ? longDate(data.estimated_delivery) : ""} />
            {data.shipment && <ShipmentCard shipment={data.shipment} />}
            <section className="rounded-[28px] border border-line bg-white p-7">
              <h2 className="mb-4 text-xl font-extrabold text-purple">Order details</h2>
              <dl className="grid grid-cols-[110px_1fr] gap-3 text-[14.5px]">
                <dt className="text-muted">Item</dt><dd className="font-bold break-words whitespace-pre-line">{data.item}</dd>
                <dt className="text-muted">Company</dt><dd className="font-bold break-words">{data.company}</dd>
                {data.delivery_address && <><dt className="text-muted">Deliver to</dt><dd className="font-bold break-words">{data.delivery_address}</dd></>}
                {data.quotation_reference && <><dt className="text-muted">Quotation</dt><dd className="font-bold">{data.quotation_reference}</dd></>}
              </dl>
            </section>
            {id && data.documents?.length > 0 && <DocumentsCard id={id} documents={data.documents} />}
            {id && <MessagesCard id={id} />}
            <section className="rounded-[28px] bg-purple p-7 text-[#f1e3f5]">
              <h2 className="mb-2.5 text-xl font-extrabold text-peach">Question about this order?</h2>
              <p className="mb-4 text-[14.5px] leading-relaxed">Quote {data.reference} and we will find it straight away.</p>
              <p className="font-extrabold text-white">{metadata?.email || "info@ghprocurement.com"}</p>
              <p className="mt-1 font-extrabold text-white">{metadata?.phone || "+234 8057962920"}</p>
              {waLink(metadata) && (
                <a href={waLink(metadata, `Hello GH Procurement, I have a question about my order ${data.reference}.`)} target="_blank" rel="noreferrer" className={`${btnPeach} mt-5`}>Chat on WhatsApp</a>
              )}
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

// a new address (another request, another reference) starts from a clean state
export default function Track() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { session } = useContext(globalContext);
  return <TrackView key={`${id || ""}|${params.get("ref")}|${params.get("email")}|${session ? 1 : 0}`} />;
}
