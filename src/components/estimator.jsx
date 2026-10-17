import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";
import { globalContext } from "../App";
import { eyebrow, inputClass, money, secure } from "../lib/ui";

const MODES = [
  ["air", "Air", "air_rate_per_kg"],
  ["sea", "Sea", "sea_rate_per_kg"],
];

// A rough cost for products in the catalog: goods + shipping by weight + duties, shown as a range.
// It needs a weight on the product and a shipping rate in the CMS Settings; without them it does not show.
export default function Estimator() {
  const { catalogs, metadata } = useContext(globalContext);
  const navigate = useNavigate();
  const currency = metadata?.currency || "USD";
  const products = useMemo(() => (catalogs || []).filter((c) => Number(c.weight_kg) > 0 && Number(c.price) > 0), [catalogs]);
  const modes = MODES.filter(([, , key]) => Number(metadata?.[key]) > 0);
  const [pick, setPick] = useState("");
  const [qty, setQty] = useState("");
  const [mode, setMode] = useState("");

  if (!metadata || !products.length || !modes.length) return null;

  const product = products.find((p) => p.id === pick) || products[0];
  const min = Number(product.min_quantity) || 0;
  const amount = Number(String(qty === "" ? min || 1 : qty).replace(/,/g, ""));
  const ship = (modes.find(([k]) => k === mode) || modes[0])[0];
  const rate = Number(metadata[MODES.find(([k]) => k === ship)[2]]);
  const valid = Number.isFinite(amount) && amount > 0;

  const kg = valid ? Number(product.weight_kg) * amount : 0;
  const goods = valid ? Number(product.price) * amount : 0;
  const shipping = kg * rate;
  const dutyPct = Number(metadata.duty_percent) || 0;
  const duties = ((goods + shipping) * dutyPct) / 100;
  const total = goods + shipping + duties;
  const spread = Math.min(50, Math.max(0, Number(metadata.estimate_range_percent) || 0)) / 100;
  const low = total * (1 - spread);
  const high = total * (1 + spread);

  const ask = () =>
    navigate("/request", {
      state: { products: [{ name: product.name, quantity: String(valid ? amount : min || 1), min, thumb: secure(product.featured_image) }] },
    });

  return (
    <section id="estimate" className="scroll-mt-4 pb-24">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-10">
        <p className={`${eyebrow} mb-2.5`}>Estimator</p>
        <h2 className="mb-3 text-[36px] font-extrabold leading-[1.08] tracking-[-.025em] text-purple sm:text-5xl">What will it cost to bring in?</h2>
        <p className="mb-8 max-w-[640px] text-[16.5px] leading-relaxed text-[#4b3d54]">A rough guide for products in our catalog. Your formal quotation, with exact prices, comes within 48 hours of your request.</p>
        <div className="flex flex-wrap items-stretch gap-6">
          <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-5 rounded-[28px] border border-line bg-white p-7 sm:p-9">
            <label className="flex flex-col gap-1.5 text-sm font-bold" htmlFor="est-product">
              Product
              <select id="est-product" value={product.id} onChange={(e) => { setPick(e.target.value); setQty(""); }} className={`${inputClass} cursor-pointer`}>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-bold" htmlFor="est-qty">
              Quantity
              <input id="est-qty" inputMode="numeric" value={qty === "" ? String(min || 1) : qty} onChange={(e) => setQty(e.target.value)} className={inputClass} />
              {min > 0 && valid && amount < min && <span className="text-[12.5px] font-semibold text-[#7a4b00]">The usual minimum order is {min.toLocaleString("en-GB")}.</span>}
              {!valid && <span role="alert" className="text-[12.5px] font-semibold text-[#b42318]">Enter a quantity.</span>}
            </label>
            {modes.length > 1 && (
              <div role="group" aria-label="Ship by" className="flex flex-col gap-1.5 text-sm font-bold">
                Ship by
                <div className="flex gap-2.5">
                  {modes.map(([k, label]) => (
                    <button key={k} type="button" aria-pressed={ship === k} onClick={() => setMode(k)}
                      className={`inline-flex min-h-12 flex-1 cursor-pointer items-center justify-center rounded-[14px] px-5 text-[15px] font-extrabold transition ${ship === k ? "bg-purple text-peach" : "border border-[#cdbfd4] bg-white text-purple hover:bg-lilac"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-[1_1_420px] flex-col justify-center gap-4 rounded-[32px] bg-purple p-8 text-white sm:p-11" aria-live="polite">
            <p className="text-sm font-extrabold uppercase tracking-[.1em] text-peach">Rough range, delivered to you</p>
            {valid ? (
              <>
                <p className="text-[34px] font-extrabold leading-tight tracking-[-.02em] sm:text-[42px]">{money(low, currency)} to {money(high, currency)}</p>
                <dl className="flex flex-col gap-2 border-t border-white/20 pt-4 text-[15px] text-[#f1e3f5]">
                  <div className="flex justify-between gap-4"><dt>Goods ({amount.toLocaleString("en-GB")} × {money(product.price, currency)})</dt><dd className="font-bold text-white">{money(goods, currency)}</dd></div>
                  <div className="flex justify-between gap-4"><dt>{ship === "air" ? "Air" : "Sea"} shipping (about {kg.toLocaleString("en-GB", { maximumFractionDigits: 1 })} kg)</dt><dd className="font-bold text-white">{money(shipping, currency)}</dd></div>
                  {dutyPct > 0 && <div className="flex justify-between gap-4"><dt>Duties and clearance (about {dutyPct}%)</dt><dd className="font-bold text-white">{money(duties, currency)}</dd></div>}
                </dl>
              </>
            ) : (
              <p className="text-lg text-[#f1e3f5]">Enter a quantity to see the range.</p>
            )}
            <p className="text-[13.5px] leading-relaxed text-[#d9c3df]">A guide only. Prices, weight and duties change, and your quotation will have the exact figures.</p>
            <button type="button" onClick={ask} className="inline-flex min-h-[54px] cursor-pointer items-center justify-center gap-2 self-start rounded-[14px] bg-peach px-7 text-base font-extrabold text-purple transition hover:brightness-95">
              Get my exact quotation <LuArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
