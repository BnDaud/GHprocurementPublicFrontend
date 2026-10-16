import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LuCheck, LuMail, LuX } from "react-icons/lu";
import Spinner from "./spinner";
import { dateTime, dayMonth } from "../lib/ui";

// the 8 steps, from the server's `stages`
export function Stepper({ stages, step, total }) {
  const current = stages.find((s) => s.state === "current");
  return (
    <section aria-label="Progress" className="rounded-[28px] bg-white px-6 py-8 shadow-[0_24px_60px_rgba(46,10,58,.18)] sm:px-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[22px] font-extrabold text-purple">
          {current ? `Step ${step} of ${total}: ${current.label}` : `All ${total} steps done`}
        </p>
        {current && stages[current.step] && (
          <span className="inline-flex min-h-9 items-center rounded-full bg-lilac px-4 text-[13.5px] font-extrabold text-purple">
            Next: {stages[current.step].label}
          </span>
        )}
      </div>

      {/* wide screens: every step */}
      <ol className="hidden grid-cols-8 md:grid">
        {stages.map((s, i) => (
          <li key={s.key} className="relative text-center">
            {i < stages.length - 1 && (
              <span aria-hidden="true" className={`absolute left-1/2 top-[21px] h-1 w-full ${s.state === "done" ? "bg-purple" : "bg-[#e7dcec]"}`} />
            )}
            <span
              aria-current={s.state === "current" ? "step" : undefined}
              className={`relative inline-flex size-[46px] items-center justify-center rounded-full text-base font-extrabold ${
                s.state === "done"
                  ? "bg-purple text-peach"
                  : s.state === "current"
                  ? "border-[3px] border-purple bg-peach text-purple shadow-[0_0_0_6px_#f3e8f6]"
                  : "border-2 border-[#cdbfd4] bg-white text-muted"
              }`}
            >
              {s.state === "done" ? <LuCheck /> : s.step}
            </span>
            <p className={`mt-3 text-[13.5px] ${s.state === "todo" ? "font-bold text-muted" : "font-extrabold"} ${s.state === "current" ? "text-purple" : ""}`}>
              {s.label}
            </p>
            <p className={`mt-0.5 text-[12.5px] ${s.state === "current" ? "font-extrabold text-purple" : "text-muted"}`}>
              {s.state === "current" ? "Now" : s.state === "done" ? dayMonth(s.date) : ""}
            </p>
          </li>
        ))}
      </ol>

      {/* phones: one bar */}
      <div className="md:hidden" aria-hidden="true">
        <div className="flex gap-1">
          {stages.map((s) => (
            <span key={s.key} className={`h-2 flex-1 rounded ${s.state === "done" ? "bg-purple" : s.state === "current" ? "bg-plum" : "bg-[#e7dcec]"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

// The email that went with one update, shown right here (so no one has to dig through their inbox).
// `load()` returns the email's HTML text, or null when it cannot be fetched.
function EmailDialog({ update, load, onClose }) {
  const [html, setHtml] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let live = true;
    load(update).then((t) => live && (t ? setHtml(t) : setFailed(true)));
    return () => {
      live = false;
    };
  }, [update, load]);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-5" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="The email we sent you" onClick={(e) => e.stopPropagation()}
        className="flex h-[92vh] w-full max-w-[720px] flex-col overflow-hidden rounded-t-[24px] bg-white shadow-2xl sm:h-[88vh] sm:rounded-[24px]">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-muted">The email we sent you</p>
            <p className="truncate text-[17px] font-extrabold text-purple">{update.headline}</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-xl text-xl text-muted hover:bg-lilac"><LuX /></button>
        </div>
        <div className="min-h-0 flex-1 bg-[#efecf3]">
          {failed ? (
            <p role="alert" className="p-6 text-[15px] font-semibold text-[#8a1f15]">We could not load that email. Please try again in a moment.</p>
          ) : html === null ? (
            <div className="flex justify-center py-16"><Spinner className="text-3xl" /></div>
          ) : (
            <iframe title="Email" sandbox="" srcDoc={html} className="size-full border-0" />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function UpdatesFeed({ updates, loadEmail }) {
  const [open, setOpen] = useState(null);
  return (
    <section className="rounded-[28px] border border-line bg-white px-6 py-8 sm:px-10" aria-labelledby="feed-title">
      <h2 id="feed-title" className="text-[26px] font-extrabold text-purple">Updates</h2>
      <p className="mb-7 mt-1.5 text-[14.5px] text-muted">Newest first. We also email you each time something changes.</p>
      <ol className="flex flex-col">
        {updates.map((u, i) => (
          <li key={u.id} className={`flex gap-4 ${i < updates.length - 1 ? "pb-7" : ""}`}>
            <span className="flex flex-none flex-col items-center">
              <span className={`mt-1.5 size-4 rounded-full ${i === 0 ? "bg-purple shadow-[0_0_0_6px_#f3e8f6]" : "bg-[#b9a9c2]"}`} />
              {i < updates.length - 1 && <span className="mt-1.5 w-0.5 flex-1 bg-[#e7dcec]" />}
            </span>
            <div className="min-w-0">
              <p className="text-[13.5px] font-semibold text-muted">
                {dateTime(u.created_at)} · {u.stage_label}
              </p>
              <p className="mt-1 text-[19px] font-extrabold break-words">{u.headline}</p>
              {u.details && <p className="mt-1.5 whitespace-pre-line text-[15.5px] leading-relaxed text-[#4b3d54] break-words">{u.details}</p>}
              {u.location && <p className="mt-2 text-[13.5px] text-muted">Location: {u.location}</p>}
              {loadEmail && (
                <button type="button" onClick={() => setOpen(u)} className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#cdbfd4] px-4 text-[14px] font-bold text-purple hover:bg-lilac">
                  <LuMail aria-hidden="true" /> See the email we sent
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>
      {open && <EmailDialog update={open} load={loadEmail} onClose={() => setOpen(null)} />}
    </section>
  );
}

// where the goods are: supplier, then our store, then the delivery address (worked out from the step)
export function RouteCard({ step, total, address, estimate }) {
  const delivered = step >= total;
  const nodes = [
    { name: "Supplier", note: step >= 4 ? "Order placed" : "Not yet", state: step >= 5 ? "done" : step === 4 ? "current" : "todo" },
    { name: "Our store", note: step === 5 ? "You are here: quality check" : step >= 6 ? "Left our store" : "Goods arrive here", state: step >= 6 ? "done" : step === 5 ? "current" : "todo" },
    { name: address || "Your delivery address", note: delivered ? "Delivered" : step >= 6 ? "On its way" : estimate ? `Estimated ${estimate}` : "", state: delivered ? "done" : step >= 6 ? "current" : "todo" },
  ];
  return (
    <section className="rounded-[28px] border border-line bg-white p-7" aria-labelledby="route-title">
      <h2 id="route-title" className="mb-5 text-xl font-extrabold text-purple">Route</h2>
      <ol>
        {nodes.map((n, i) => (
          <li key={n.name} className={`flex gap-3.5 ${i < nodes.length - 1 ? "pb-5" : ""}`} data-state={n.state}>
            <span className="flex flex-none flex-col items-center">
              <span className={`mt-1 size-3.5 rounded-full ${n.state === "done" ? "bg-[#12633a]" : n.state === "current" ? "bg-purple shadow-[0_0_0_5px_#f3e8f6]" : "border-2 border-[#cdbfd4]"}`} />
              {i < nodes.length - 1 && <span className={`mt-1 w-0.5 flex-1 ${n.state === "done" ? "bg-[#cfe6d8]" : "bg-[#e7dcec]"}`} />}
            </span>
            <div className="min-w-0">
              <p className={`text-[15.5px] font-extrabold break-words ${n.state === "todo" ? "text-muted" : n.state === "current" ? "text-purple" : ""}`}>{n.name}</p>
              {n.note && <p className={`text-[13.5px] ${n.state === "current" ? "font-bold text-purple" : "text-muted"}`}>{n.note}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
