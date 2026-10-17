import { useEffect, useRef, useState } from "react";
import Spinner from "./spinner";
import { api, errorText } from "../auth/customer";
import API from "../endpoint/base";
import { btnPurple, dateTime, inputClass } from "../lib/ui";

// The customer's thread with the team on one order. The team's replies also arrive by email.
export default function MessagesCard({ id }) {
  const [list, setList] = useState(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const box = useRef(null);

  // open it, and look again every half minute while the page is visible
  useEffect(() => {
    let alive = true;
    const load = () =>
      api(API.customer.messages(id), { auth: true }).then((res) => {
        if (alive && res.ok) setList(res.data);
      });
    load();
    const again = () => document.visibilityState === "visible" && load();
    const timer = setInterval(again, 30000);
    document.addEventListener("visibilitychange", again);
    return () => {
      alive = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", again);
    };
  }, [id]);

  // keep the newest message in view
  useEffect(() => {
    if (box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [list?.length]);

  const send = async (e) => {
    e.preventDefault();
    const body = text.trim();
    if (!body || busy) return;
    setBusy(true);
    setError("");
    const res = await api(API.customer.messages(id), { method: "POST", auth: true, body: { body } });
    setBusy(false);
    if (!res.ok) return setError(errorText(res, "We could not send that. Please try again."));
    setText("");
    setList((l) => [...(l || []), res.data]);
  };

  return (
    <section className="rounded-[28px] border border-line bg-white p-7" aria-labelledby="msg-title">
      <h2 id="msg-title" className="mb-1 text-xl font-extrabold text-purple">Messages</h2>
      <p className="mb-4 text-[14px] leading-relaxed text-muted">Ask us anything about this order. We reply here and by email.</p>
      <div ref={box} className="mb-4 flex max-h-[360px] min-h-[96px] flex-col gap-3 overflow-y-auto rounded-2xl bg-blush p-3.5" aria-live="polite">
        {list === null ? (
          <div className="flex justify-center py-6"><Spinner className="text-2xl" /></div>
        ) : list.length === 0 ? (
          <p className="m-auto text-center text-[14px] text-muted">No messages yet.</p>
        ) : (
          list.map((m) => (
            <div key={m.id} className={`max-w-[88%] ${m.sender === "customer" ? "self-end" : "self-start"}`}>
              {m.sender === "team" && <p className="mb-1 text-[12px] font-extrabold text-plum">GH Procurement</p>}
              <p className={`whitespace-pre-line break-words px-4 py-2.5 text-[14.5px] leading-snug ${m.sender === "customer" ? "rounded-[18px] rounded-br-md bg-purple text-white" : "rounded-[18px] rounded-bl-md bg-lilac text-ink"}`}>{m.body}</p>
              <p className={`mt-1 text-[11.5px] text-muted ${m.sender === "customer" ? "text-right" : ""}`}>{dateTime(m.created_at)}</p>
            </div>
          ))
        )}
      </div>
      <form onSubmit={send} className="flex flex-col gap-2.5">
        <label htmlFor="msg-text" className="sr-only">Your question</label>
        <textarea id="msg-text" rows={3} maxLength={2000} value={text} onChange={(e) => { setText(e.target.value); setError(""); }} placeholder="Write your question…"
          className={`${inputClass} !h-auto py-3 leading-normal`} />
        {error && <p role="alert" className="text-[13.5px] font-semibold text-[#b42318]">{error}</p>}
        <button type="submit" disabled={busy || !text.trim()} className={`${btnPurple} min-h-12 self-start px-7`}>
          {busy ? <Spinner className="text-xl" /> : "Send"}
        </button>
      </form>
    </section>
  );
}
