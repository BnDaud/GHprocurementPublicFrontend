import { useState } from "react";
import { LuDownload, LuExternalLink, LuFileText } from "react-icons/lu";
import Spinner from "./spinner";
import { getSession } from "../auth/customer";
import API from "../endpoint/base";
import { btnGhost, longDate } from "../lib/ui";

// Carrier and tracking number, typed in by the team when the goods ship.
export function ShipmentCard({ shipment: s }) {
  const rows = [
    ["Shipped by", s.carrier],
    ["Tracking number", s.tracking_number],
    ["Left us", s.shipped_at ? longDate(s.shipped_at) : ""],
    ["Expected", s.estimated_delivery ? longDate(s.estimated_delivery) : ""],
  ].filter(([, v]) => v);
  return (
    <section className="rounded-[28px] border border-line bg-white p-7" aria-labelledby="ship-title">
      <h2 id="ship-title" className="mb-4 text-xl font-extrabold text-purple">Your shipment</h2>
      <dl className="grid grid-cols-[110px_1fr] gap-3 text-[14.5px]">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted">{k}</dt>
            <dd className="break-all font-bold">{v}</dd>
          </div>
        ))}
      </dl>
      {s.tracking_url && (
        <a href={s.tracking_url} target="_blank" rel="noreferrer noopener" className={`${btnGhost} mt-5 min-h-11 px-5 text-[14.5px]`}>
          Open carrier tracking <LuExternalLink aria-hidden="true" />
        </a>
      )}
    </section>
  );
}

// PDFs the team added (invoice, packing list, airway bill). Downloaded through the API, only for the signed-in owner.
export function DocumentsCard({ id, documents }) {
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const download = async (d) => {
    if (busy) return;
    setBusy(d.id);
    setError("");
    try {
      const s = getSession();
      const res = await fetch(API.customer.document(id, d.id), { headers: s ? { Authorization: `Bearer ${s.token}` } : {} });
      if (!res.ok) throw new Error("fail");
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = `${d.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError("We could not download that file. Please try again in a moment.");
    }
    setBusy("");
  };

  return (
    <section className="rounded-[28px] border border-line bg-white p-7" aria-labelledby="docs-title">
      <h2 id="docs-title" className="mb-4 text-xl font-extrabold text-purple">Documents</h2>
      <ul className="flex flex-col gap-2.5">
        {documents.map((d) => (
          <li key={d.id} className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3">
            <LuFileText className="flex-none text-2xl text-purple" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-extrabold" title={d.title}>{d.title}</span>
              <span className="block text-[12.5px] text-muted">{d.kind_label} · added {longDate(d.created_at)}</span>
            </span>
            <button type="button" onClick={() => download(d)} disabled={!!busy} aria-label={`Download ${d.title}`}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#cdbfd4] px-4 text-[14px] font-bold text-purple hover:bg-lilac disabled:opacity-60">
              {busy === d.id ? <Spinner className="text-lg" /> : <LuDownload aria-hidden="true" />} Download
            </button>
          </li>
        ))}
      </ul>
      {error && <p role="alert" className="mt-3 text-[14px] font-semibold text-[#b42318]">{error}</p>}
    </section>
  );
}
