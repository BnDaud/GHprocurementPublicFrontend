import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { LuPackage } from "react-icons/lu";
import { globalContext } from "../App";
import Header from "../components/header";
import Spinner from "../components/spinner";
import { api, errorText, justSignedOut } from "../auth/customer";
import API from "../endpoint/base";
import truck from "../images/truck1.jpg";
import { longDate, secure } from "../lib/ui";

const chip = (status) =>
  status === "delivered" ? "bg-[#e6f2ea] text-[#12633a]" : status === "customs" ? "bg-[#fff1d6] text-[#7a4b00]" : "bg-lilac text-purple";

export default function Account() {
  const { session } = useContext(globalContext);
  const here = useLocation();
  const welcome = here.state?.welcome;
  const [list, setList] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const [reload, setReload] = useState(0);

  // load the list, and again when the tab comes back or every minute, so a new update shows up by itself
  useEffect(() => {
    if (!session) return;
    let alive = true;
    const load = () =>
      api(API.customer.requests(), { auth: true }).then((r) => {
        if (!alive) return;
        if (r.ok) {
          setList(r.data);
          setError("");
        } else if (r.status !== 401) setError(errorText(r));
      });
    load();
    const again = () => document.visibilityState === "visible" && load();
    const timer = setInterval(again, 60000);
    window.addEventListener("focus", again);
    document.addEventListener("visibilitychange", again);
    return () => {
      alive = false;
      clearInterval(timer);
      window.removeEventListener("focus", again);
      document.removeEventListener("visibilitychange", again);
    };
  }, [session, reload]);

  if (!session) return justSignedOut() ? <Navigate to="/" replace /> : <Navigate to="/signin" replace state={{ from: here.pathname }} />;

  const done = (list || []).filter((r) => r.status === "delivered");
  const shown = (list || []).filter((r) => (filter === "all" ? true : filter === "delivered" ? r.status === "delivered" : r.status !== "delivered"));
  const first = (session.user.name || "").split(" ")[0] || "there";

  return (
    <div className="bg-cream">
      <section className="relative overflow-hidden bg-aubergine pb-24 text-white">
        <img src={truck} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" style={{ objectPosition: "center 40%" }} />
        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(28,6,36,.94)_0%,rgba(46,10,58,.8)_55%,rgba(46,10,58,.35)_100%)]" aria-hidden="true" />
        <div className="relative">
          <Header overlay />
          <div className="mx-auto max-w-[1280px] px-5 pt-8 sm:px-10">
            <p className="mb-2.5 text-sm font-extrabold uppercase tracking-[.1em] text-peach">My account</p>
            <h1 className="text-[44px] font-extrabold leading-[1.05] tracking-[-.03em] sm:text-[56px]">Hello, {first}.</h1>
            <p className="mt-3.5 text-lg text-[#f1e3f5]">Everything you have asked us to source, and where it is now.</p>
          </div>
        </div>
      </section>

      <main className="relative mx-auto -mt-14 max-w-[1280px] px-5 pb-20 sm:px-10">
        {welcome && <p role="status" className="mb-5 rounded-2xl border border-[#bfe0cb] bg-[#e6f2ea] px-5 py-3.5 text-[15px] font-semibold text-[#12633a]">Your password is saved. You are signed in.</p>}
        <div className="mb-8 grid grid-cols-3 gap-3 sm:gap-[18px]">
          {[["Requests in total", list?.length, "text-purple"], ["In progress", list ? list.length - done.length : null, "text-plum"], ["Delivered", list ? done.length : null, "text-[#12633a]"]].map(([label, n, color]) => (
            <div key={label} className="rounded-[20px] bg-white px-4 py-5 shadow-[0_14px_36px_rgba(46,10,58,.14)] sm:px-7">
              <p className={`text-3xl font-extrabold sm:text-4xl ${color}`}>{n ?? <Spinner className="text-2xl" />}</p>
              <p className="mt-0.5 text-[13px] font-semibold text-muted sm:text-sm">{label}</p>
            </div>
          ))}
        </div>

        <div role="group" aria-label="Filter" className="mb-5 flex flex-wrap gap-2.5">
          {[["all", "All", list?.length], ["progress", "In progress", list && list.length - done.length], ["delivered", "Delivered", list && done.length]].map(([k, label, n]) => (
            <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}
              className={`inline-flex min-h-11 items-center rounded-full px-5 text-sm font-bold ${filter === k ? "bg-purple text-peach" : "border border-[#d8c7df] bg-white hover:bg-lilac"}`}>{label} {n ?? ""}</button>
          ))}
        </div>

        {error && (
          <p role="alert" className="mb-4 flex flex-wrap items-center gap-3 rounded-xl bg-[#fdeceb] px-4 py-3 text-sm font-semibold text-[#8a1f15]">
            {error}
            <button type="button" onClick={() => { setError(""); setReload((n) => n + 1); }} className="font-extrabold underline">Try again</button>
          </p>
        )}
        {!list && !error ? (
          <div className="flex justify-center py-16"><Spinner className="text-3xl text-purple" /></div>
        ) : list && list.length === 0 ? (
          <div className="rounded-3xl border border-line bg-white p-10 text-center">
            <p className="text-lg font-extrabold text-purple">No requests yet.</p>
            <Link to="/request" className="mt-4 inline-flex min-h-12 items-center rounded-[14px] bg-purple px-7 font-extrabold text-peach">Request a quote</Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {shown.length === 0 && <li className="rounded-3xl border border-line bg-white p-8 text-center font-bold text-muted">{filter === "delivered" ? "Nothing has been delivered yet." : "Nothing is in progress right now."}</li>}
            {shown.map((r) => (
              <li key={r.id}>
                <Link to={`/account/${r.id}`} className="flex flex-wrap items-center gap-x-7 gap-y-4 rounded-3xl border border-line bg-white px-6 py-5 transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(66,14,81,.14)] sm:px-7">
                  <span className="flex size-[84px] flex-none items-center justify-center overflow-hidden rounded-2xl border border-line bg-lilac">
                    {r.image_url ? <img src={secure(r.image_url)} alt="" className="size-full object-cover" /> : <LuPackage className="text-[34px] text-purple" aria-hidden="true" />}
                  </span>
                  <div className="min-w-0 flex-[1_1_240px]">
                    <p className="text-[13px] font-bold text-muted">{r.reference} · sent {longDate(r.created_at)}</p>
                    <p className="mt-1 text-[22px] font-extrabold text-purple break-words">{r.title}</p>
                    <p className="mt-1.5 text-[14.5px] text-[#4b3d54]">Latest: {r.latest}</p>
                  </div>
                  <div className="min-w-0 flex-[1_1_260px] lg:w-[360px] lg:flex-none">
                    <div className="flex gap-1.5" aria-hidden="true">
                      {Array.from({ length: r.steps }, (_, i) => <span key={i} className={`h-2 flex-1 rounded ${i < r.step ? (r.status === "delivered" ? "bg-[#12633a]" : "bg-purple") : "bg-[#e7dcec]"}`} />)}
                    </div>
                    <p className="mt-2 text-[13px] text-muted">Step {r.step} of {r.steps}</p>
                  </div>
                  <span className={`inline-flex min-h-[38px] items-center justify-center rounded-full px-4 text-[13.5px] font-extrabold lg:w-[132px] ${chip(r.status)}`}>{r.status_label}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
