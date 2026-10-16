import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { LuArrowRight, LuImage, LuPlus, LuTrash2, LuX } from "react-icons/lu";
import Header from "../components/header";
import Spinner from "../components/spinner";
import { globalContext } from "../App";
import { api, errorText } from "../auth/customer";
import API from "../endpoint/base";
import air2 from "../images/air2.jpg";
import { btnPurple, inputClass, labelClass } from "../lib/ui";

const MAX_MB = 10;
const MAX_ITEMS = 10;
const blank = (description = "") => ({ description, quantity: "1", file: null });

// shrink a photo in the browser first (about 1200 px, JPEG), so a phone picture uploads in kilobytes, not megabytes
async function shrink(file) {
  try {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, 1200 / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * k);
    canvas.height = Math.round(bmp.height * k);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.8));
    return blob && blob.size < file.size ? new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : file;
  } catch {
    return file; // the server shrinks it too
  }
}

function Thumb({ file }) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return <img src={url} alt="" className="size-full object-cover" />;
}

export default function Rfq() {
  const { session } = useContext(globalContext);
  const prefill = useLocation().state?.item || "";
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [form, setForm] = useState({
    name: session?.user?.name || "",
    company: session?.user?.company || "",
    email: session?.user?.email || "",
    phone: "",
    item: prefill.split("\n").slice(1).join("\n").trim(), // a note: anything beyond the first line
  });
  const [rows, setRows] = useState([blank(prefill.split("\n")[0].slice(0, 200))]);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const setRow = (i, patch) => {
    setRows((r) => r.map((x, k) => (k === i ? { ...x, ...patch } : x)));
    setErrors((x) => ({ ...x, items: undefined, file: undefined }));
  };
  const pickPicture = async (i, e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!f.type.startsWith("image/")) return setErrors((x) => ({ ...x, file: "Choose a picture (JPG or PNG)." }));
    if (f.size > MAX_MB * 1024 * 1024) return setErrors((x) => ({ ...x, file: `Each picture must be under ${MAX_MB} MB.` }));
    setRow(i, { file: await shrink(f) });
  };

  const validate = () => {
    const x = {};
    if (!form.name.trim()) x.name = "Enter your name.";
    if (!form.company.trim()) x.company = "Enter your company.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) x.email = "Enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 6) x.phone = "Enter your phone number.";
    const used = rows.filter((r) => r.description.trim());
    if (used.length === 0) x.items = "Add at least one item.";
    else if (used.some((r) => !(Number(String(r.quantity).replace(/,/g, "")) > 0))) x.items = "Give each item a quantity.";
    if (!agree) x.agree = "Please agree so we can reply and create your account.";
    return x;
  };

  // move the cursor to the first thing that needs fixing (after the page has shown the messages)
  const focusFirst = () =>
    setTimeout(() => formRef.current?.querySelector('[aria-invalid="true"], input.\\!border-\\[\\#b42318\\]')?.focus(), 30);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    const x = validate();
    setErrors(x);
    setFailure("");
    if (Object.keys(x).length) return focusFirst();
    setBusy(true);
    const body = new FormData();
    body.append("name", form.name.trim());
    body.append("company", form.company.trim());
    body.append("email", form.email.trim());
    body.append("phone", form.phone);
    const used = rows.filter((r) => r.description.trim());
    const pics = used.filter((r) => r.file);
    let next = 0;
    body.append("items_json", JSON.stringify(used.map((r) => ({ description: r.description.trim(), quantity: String(r.quantity).replace(/,/g, ""), image: r.file ? next++ : null }))));
    pics.forEach((r) => body.append("item_images", r.file));
    body.append("item", form.item.trim()); // the note
    body.append("consent", "true"); // the box above is ticked (the page will not send without it)
    const res = await api(API.sendRFQ(), { method: "POST", body });
    setBusy(false);
    if (!res.ok) {
      // keep everything they typed
      const fields = res.data?.fields;
      if (fields) setErrors(Object.fromEntries(Object.entries(fields).map(([k, v]) => [k === "consent" ? "agree" : k, [].concat(v).join(" ")])));
      setFailure(res.status === 0 ? errorText(res) : res.status === 429 ? (res.data?.detail || "Too many tries. Please wait a while and try again.") : "We could not send your request. Check the details and try again.");
      focusFirst();
      return;
    }
    navigate("/sent", { state: { reference: res.data.reference, email: res.data.email, newAccount: res.data.new_account, id: res.data.id, name: form.name.trim(), company: form.company.trim(), item: rows.filter((r) => r.description.trim()).map((r) => `${r.quantity} x ${r.description.trim()}`).join("\n") }, replace: true });
  };

  const err = (k) => errors[k] && <span role="alert" className="text-[13px] font-semibold text-[#b42318]">{errors[k]}</span>;
  const bad = (k) => (errors[k] ? "!border-[#b42318]" : "");

  return (
    <div className="bg-cream">
      <Header />
      <main className="mx-auto flex max-w-[1280px] flex-wrap items-stretch gap-7 px-5 pb-20 pt-10 sm:px-10">
        <section className="relative flex min-h-[420px] min-w-0 flex-[1_1_380px] flex-col justify-end overflow-hidden rounded-[32px] p-8 text-white sm:p-11 lg:min-h-[760px]">
          <img src={air2} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(28,6,36,.94)_0%,rgba(28,6,36,.4)_60%,rgba(28,6,36,.55)_100%)]" aria-hidden="true" />
          <div className="relative">
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[.1em] text-peach">Request for quote</p>
            <h1 className="text-[38px] font-extrabold leading-[1.05] tracking-[-.03em] sm:text-5xl">Tell us what you need. We will get it to you.</h1>
            <ul className="mt-7 flex flex-col gap-3.5">
              {[
                ["Your account is made from your email.", "We email a link to choose your own password."],
                ["We quote within 48 hours.", "A formal quotation with a reference number."],
                ["You follow every step.", "Sourcing, quality check, shipping, customs, delivery."],
              ].map(([t, s], i) => (
                <li key={t} className="flex items-start gap-3.5 rounded-2xl border border-white/30 bg-white/12 px-4 py-4 backdrop-blur">
                  <span className="flex size-[30px] flex-none items-center justify-center rounded-full bg-peach text-sm font-extrabold text-purple">{i + 1}</span>
                  <span className="text-[15px] leading-normal"><b>{t}</b><br /><span className="text-[#f1e3f5]">{s}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="min-w-0 flex-[1.4_1_560px] rounded-[32px] border border-line bg-white p-7 shadow-[0_20px_50px_rgba(66,14,81,.08)] sm:p-11" aria-label="Request form">
          <h2 className="text-[30px] font-extrabold tracking-[-.02em] text-purple">Your details</h2>
          <p className="mb-6 mt-1.5 text-[15px] text-muted">
            {session ? "Signed in. Your details are filled in." : <>Already have an account? <Link to="/signin" className="font-extrabold text-purple underline">Sign in</Link> and these are filled in for you.</>}
          </p>
          <form ref={formRef} onSubmit={submit} noValidate className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>Full name<input aria-invalid={!!errors.name} className={`${inputClass} ${bad("name")}`} value={form.name} onChange={set("name")} placeholder="Ada Obi" autoComplete="name" />{err("name")}</label>
              <label className={labelClass}>Company<input aria-invalid={!!errors.company} className={`${inputClass} ${bad("company")}`} value={form.company} onChange={set("company")} placeholder="Company name" autoComplete="organization" />{err("company")}</label>
              <label className={labelClass}>Email<input type="email" aria-invalid={!!errors.email} className={`${inputClass} ${bad("email")}`} value={form.email} onChange={set("email")} placeholder="example@email.com" autoComplete="email" readOnly={!!session} />
                {err("email") || <span className="text-[12.5px] font-medium text-muted">Your account and updates use this address.</span>}</label>
              <div className={labelClass}>
                <span>Phone</span>
                <PhoneInput country="ng" enableSearch value={form.phone} onChange={(p) => { setForm((f) => ({ ...f, phone: `+${p}` })); setErrors((x) => ({ ...x, phone: undefined })); }}
                  containerClass="!w-full" inputClass={`!h-[52px] !w-full !rounded-[14px] !border !border-[#cdbfd4] !bg-white !pl-12 !text-[15.5px] ${errors.phone ? "!border-[#b42318]" : ""}`} buttonClass="!rounded-l-[14px] !border-[#cdbfd4]" />
                {err("phone")}
              </div>
            </div>
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-1 text-[15px] font-bold">What do you need?</legend>
              {rows.map((r, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="relative flex-none">
                    <label className="flex size-[52px] cursor-pointer items-center justify-center overflow-hidden rounded-[14px] border-2 border-dashed border-[#cdbfd4] bg-blush text-xl text-purple hover:bg-lilac focus-within:outline focus-within:outline-2 focus-within:outline-purple" title={r.file ? "Change picture" : "Add a picture (optional)"}>
                      {r.file ? <Thumb file={r.file} /> : <LuImage aria-hidden="true" />}
                      <input type="file" accept="image/*" className="sr-only" aria-label={`Item ${i + 1} picture (optional)`} onChange={(e) => pickPicture(i, e)} />
                    </label>
                    {r.file && (
                      <button type="button" aria-label={`Remove item ${i + 1} picture`} onClick={() => setRow(i, { file: null })} className="absolute -right-1.5 -top-1.5 flex size-5 cursor-pointer items-center justify-center rounded-full bg-white text-[11px] text-[#a3261a] shadow ring-1 ring-line"><LuX /></button>
                    )}
                  </span>
                  <input aria-label={`Item ${i + 1} description`} aria-invalid={!!errors.items} className={`${inputClass} min-w-0 flex-1 ${bad("items")}`} value={r.description} maxLength={200} onChange={(e) => setRow(i, { description: e.target.value })} placeholder={i === 0 ? "Item, size, model, colour…" : "Another item"} />
                  <input aria-label={`Item ${i + 1} quantity`} inputMode="decimal" className={`${inputClass} !w-20 flex-none text-center ${bad("items")}`} value={r.quantity} onChange={(e) => setRow(i, { quantity: e.target.value })} placeholder="Qty" />
                  {rows.length > 1 && (
                    <button type="button" aria-label={`Remove item ${i + 1}`} onClick={() => setRows((x) => x.filter((_, k) => k !== i))} className="flex size-11 flex-none cursor-pointer items-center justify-center rounded-xl text-lg text-[#a3261a] hover:bg-[#fdeceb]"><LuTrash2 /></button>
                  )}
                </div>
              ))}
              {err("items")}
              {err("file")}
              <div className="flex flex-wrap items-center gap-3">
                {rows.length < MAX_ITEMS && (
                  <button type="button" onClick={() => setRows((x) => [...x, blank()])} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-[#cdbfd4] px-4 text-sm font-bold text-purple hover:bg-lilac"><LuPlus /> Add another item</button>
                )}
                <span className="text-[12.5px] font-medium text-muted">A picture for each item is optional. JPG or PNG.</span>
              </div>
            </fieldset>
            <label className={labelClass}>Anything else we should know? <span className="font-medium text-muted">(optional)</span>
              <textarea rows={3} className={`${inputClass} !h-auto py-3.5 leading-normal`} value={form.item} onChange={set("item")} placeholder="Specifications, delivery address, deadline…" /></label>
            <label className={`flex items-start gap-3 rounded-xl text-sm leading-normal text-[#4b3d54] ${errors.agree ? "bg-[#fdeceb] p-3 ring-1 ring-[#b42318]/40" : ""}`}>
              <input type="checkbox" aria-invalid={!!errors.agree} checked={agree} onChange={(e) => { setAgree(e.target.checked); setErrors((x) => ({ ...x, agree: undefined })); }} className="mt-0.5 size-5 accent-purple" />
              <span>I agree that GH Procurement may use these details to reply to this request and to create my account.{errors.agree && <span role="alert" className="mt-1 block text-[13px] font-semibold text-[#b42318]">{errors.agree}</span>}</span>
            </label>
            {failure && <p role="alert" className="rounded-xl bg-[#fdeceb] px-4 py-3 text-sm font-semibold text-[#8a1f15]">{failure}</p>}
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" disabled={busy} className={`${btnPurple} min-h-14 px-9 text-[17px]`}>
                {busy ? <Spinner className="text-xl" /> : <>Send request <LuArrowRight /></>}
              </button>
              <span className="text-sm font-semibold text-muted">We reply within 48 hours.</span>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
