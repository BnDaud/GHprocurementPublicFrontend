import { useState } from "react";
import { LuBadgeCheck } from "react-icons/lu";
import Spinner from "./spinner";
import { api, errorText } from "../auth/customer";
import API from "../endpoint/base";
import { btnPurple } from "../lib/ui";

// Shown while the order is Quoted: the customer accepts the quotation here and the order moves to Confirmed.
export default function AcceptCard({ id, onAccepted }) {
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const accept = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    const res = await api(API.customer.accept(id), { method: "POST", auth: true });
    setBusy(false);
    if (res.ok) return onAccepted(res.data);
    setAsking(false);
    setError(res.status === 409 ? "This order has already moved on. Reload the page to see where it is." : errorText(res));
  };

  return (
    <section aria-labelledby="accept-title" className="mb-7 rounded-[28px] border-2 border-peach bg-white px-6 py-7 shadow-[0_18px_44px_rgba(46,10,58,.12)] sm:px-10">
      <div className="flex items-start gap-4">
        <span className="mt-1 flex size-12 flex-none items-center justify-center rounded-full bg-lilac text-2xl text-purple"><LuBadgeCheck aria-hidden="true" /></span>
        <div className="min-w-0">
          <h2 id="accept-title" className="text-[24px] font-extrabold text-purple">Your quotation is ready</h2>
          <p className="mt-1.5 text-[15.5px] leading-relaxed text-[#4b3d54]">
            Read it first: open the Quotation update below and choose "See the email we sent". If you are happy with it, accept it here and we will start sourcing. Questions? Contact us before you accept.
          </p>
          {error && <p role="alert" className="mt-3 text-[14.5px] font-semibold text-[#b42318]">{error}</p>}
          {!asking ? (
            <button type="button" onClick={() => setAsking(true)} className={`${btnPurple} mt-5 min-h-12 px-7`}>Accept quotation</button>
          ) : (
            <div className="mt-5 flex flex-wrap items-center gap-3" role="group" aria-label="Confirm accepting the quotation">
              <span className="text-[15px] font-bold text-purple">Accept this quotation and confirm your order?</span>
              <button type="button" onClick={accept} disabled={busy} className={`${btnPurple} min-h-12 px-6`}>{busy ? <Spinner className="text-xl" /> : "Yes, accept"}</button>
              <button type="button" onClick={() => setAsking(false)} disabled={busy} className="inline-flex min-h-12 cursor-pointer items-center rounded-xl border border-[#cdbfd4] px-5 text-[15px] font-bold text-purple hover:bg-lilac">Not yet</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
