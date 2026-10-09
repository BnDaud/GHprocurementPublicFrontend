import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { LuCheck } from "react-icons/lu";
import Header from "../components/header";
import Spinner from "../components/spinner";
import { api, getSession, errorText } from "../auth/customer";
import API from "../endpoint/base";
import truck from "../images/truck1.jpg";
import air1 from "../images/air1.jpg";
import logoWhite from "../images/logo-white.png";
import { btnPeach, btnGlass, longDate } from "../lib/ui";

// a small copy of the email the customer was just sent (same layout as the real one)
function EmailPreview({ s }) {
  const first = (s.name || "").split(" ")[0] || "there";
  const item = (s.item || "").split("\n")[0].slice(0, 60);
  const rows = [
    ["Request", item || "Quote request"],
    ["Company", s.company],
    ["Received", longDate(new Date().toISOString())],
    ["Quotation within", "48 hours"],
  ].filter(([, v]) => v);
  return (
    <div className="overflow-hidden rounded-[22px] bg-white text-ink shadow-[0_30px_70px_rgba(0,0,0,.4)]">
      <div className="border-b border-line px-6 py-4 text-[13px] leading-[1.7] text-muted">
        From: GH Procurement &lt;info@ghprocurement.com&gt;<br />
        Subject: <b className="text-ink">We have your request {s.reference}</b>
      </div>
      <div className="bg-aubergine text-[#f1e3f5]">
        <div className="relative flex h-40 flex-col justify-between px-7 py-5">
          <img src={air1} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,6,36,.55)_0%,rgba(28,6,36,.97)_100%)]" aria-hidden="true" />
          <div className="relative flex items-center justify-between">
            <img src={logoWhite} alt="Gadgets Home" className="h-7 w-auto" />
            <span className="text-[10.5px] font-extrabold uppercase tracking-[.1em] text-peach">Request receipt</span>
          </div>
          <p className="relative text-[22px] font-extrabold leading-tight text-white">We have your request, {first}.</p>
        </div>
        <div className="px-7 pb-7 pt-5">
          <div className="rounded-xl border-2 border-dashed border-peach bg-[#2a0a36] px-4 py-3.5 text-center">
            <p className="text-[10.5px] font-extrabold uppercase tracking-[.14em] text-peach">Your reference</p>
            <p className="text-[24px] font-extrabold tracking-[.04em] text-white">{s.reference}</p>
          </div>
          <p className="my-4 text-[14px] leading-relaxed">Thank you. We received your request and will send your quotation within 48 hours.</p>
          <dl className="rounded-xl bg-[#2a0a36] px-4">
            {rows.map(([k, v], i) => (
              <div key={k} className={`flex justify-between gap-4 py-2.5 text-[13px] ${i < rows.length - 1 ? "border-b border-[#43185a]" : ""}`}>
                <dt className="text-[#c7b0cf]">{k}</dt>
                <dd className="text-right font-bold text-white">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 text-center">
            <span className="inline-flex min-h-11 items-center rounded-full bg-peach px-7 text-[14px] font-extrabold text-purple">{s.newAccount ? "Choose my password" : "Track my request"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sent() {
  const s = useLocation().state;
  const [again, setAgain] = useState("idle"); // idle | busy | done | failed
  const [problem, setProblem] = useState("");
  if (!s?.reference) return <Navigate to="/" replace />; // opened directly, nothing was just sent

  const resend = async () => {
    setAgain("busy");
    setProblem("");
    const res = await api(API.customer.requestLink(), { method: "POST", body: { email: s.email } });
    if (res.ok) return setAgain("done");
    setProblem(res.status === 429 ? "Too many tries. Wait a minute and try again." : errorText(res, "We could not send it. Try again in a moment."));
    setAgain("failed");
  };

  const signedIn = !!getSession();

  return (
    <div className="relative min-h-[calc(100vh-220px)] overflow-hidden bg-aubergine text-white lg:min-h-[calc(125vh-125px)]">
      <img src={truck} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(28,6,36,.95)_0%,rgba(46,10,58,.86)_50%,rgba(46,10,58,.55)_100%)]" aria-hidden="true" />
      <div className="relative">
        <Header overlay />
        <main className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-14 px-5 pb-20 pt-10 sm:px-10">
          <section className="min-w-0 flex-[1_1_440px]">
            <span className="flex size-[68px] items-center justify-center rounded-full bg-peach" aria-hidden="true"><LuCheck className="text-3xl text-purple" strokeWidth={3} /></span>
            <h1 className="mt-6 text-[44px] font-extrabold leading-[1.04] tracking-[-.03em] sm:text-[64px]">Request received.</h1>
            <p className="mt-5 max-w-[540px] text-xl leading-relaxed text-[#f1e3f5]">
              Your reference is <b className="text-peach">{s.reference}</b>. We will send your quotation to <b className="text-white">{s.email}</b> within 48 hours.
            </p>
            <div className="mt-7 max-w-[540px] rounded-[20px] border border-white/30 bg-white/12 p-6 backdrop-blur">
              {s.newAccount ? (
                <>
                  <p className="mb-1.5 text-lg font-extrabold text-peach">Your account is ready</p>
                  <p className="text-[15.5px] leading-relaxed text-[#f1e3f5]">We emailed a link to <b className="text-white">{s.email}</b> so you can choose your password. Then sign in to follow this request, step by step.</p>
                </>
              ) : (
                <>
                  <p className="mb-1.5 text-lg font-extrabold text-peach">You already have an account</p>
                  <p className="text-[15.5px] leading-relaxed text-[#f1e3f5]">Sign in with <b className="text-white">{s.email}</b> to follow this request, step by step.</p>
                </>
              )}
            </div>
            <div className="mt-7 flex flex-wrap gap-3.5">
              {signedIn ? (
                <Link to={`/account/${s.id}`} className={`${btnPeach} min-h-14 text-[17px]`}>Track this request</Link>
              ) : s.newAccount ? null : (
                <Link to="/signin" className={`${btnPeach} min-h-14 text-[17px]`}>Sign in</Link>
              )}
              <Link to="/" className={`${s.newAccount && !signedIn ? btnPeach : btnGlass} min-h-14 text-[17px]`}>Back to the site</Link>
            </div>
            {s.newAccount && !signedIn && (
              <p className="mt-5 text-[14.5px] leading-normal text-[#d9c3df]" aria-live="polite">
                Not in your inbox? Check spam, or{" "}
                {again === "done" ? (
                  <b className="text-white">we sent the link again.</b>
                ) : (
                  <button type="button" onClick={resend} disabled={again === "busy"} className="font-extrabold text-white underline disabled:no-underline disabled:opacity-80">
                    {again === "busy" ? <Spinner className="inline text-white" /> : "send the link again"}
                  </button>
                )}
                {again === "failed" && <span role="alert" className="mt-1 block font-semibold text-[#ffb4ac]">{problem}</span>}
              </p>
            )}
          </section>

          <section className="min-w-0 flex-[1_1_420px]" aria-label="The email we sent you">
            <p className="mb-3 text-[13px] font-extrabold uppercase tracking-[.08em] text-peach">The email we sent you</p>
            <EmailPreview s={s} />
          </section>
        </main>
      </div>
    </div>
  );
}
