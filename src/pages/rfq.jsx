import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { LuArrowRight } from "react-icons/lu";
import Header from "../components/header";
import Spinner from "../components/spinner";
import { globalContext } from "../App";
import { api, errorText } from "../auth/customer";
import API from "../endpoint/base";
import air2 from "../images/air2.jpg";
import { btnPurple, inputClass, labelClass } from "../lib/ui";

const MAX_MB = 10;

export default function Rfq() {
  const { session } = useContext(globalContext);
  const prefill = useLocation().state?.item || "";
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const formRef = useRef(null);
  const [form, setForm] = useState({
    name: session?.user?.name || "",
    company: session?.user?.company || "",
    email: session?.user?.email || "",
    phone: "",
    item: prefill,
  });
  const [file, setFile] = useState(null);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState("");
  const [busy, setBusy] = useState(false);

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const pick = (e) => {
    const f = e.target.files?.[0];
    setErrors((x) => ({ ...x, file: undefined }));
    if (!f) return setFile(null);
    if (!f.type.startsWith("image/")) {
      setErrors((x) => ({ ...x, file: "Choose a picture (JPG or PNG)." }));
      e.target.value = "";
      return setFile(null);
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setErrors((x) => ({ ...x, file: `The picture must be under ${MAX_MB} MB.` }));
      e.target.value = "";
      return setFile(null);
    }
    setFile(f);
  };

  const validate = () => {
    const x = {};
    if (!form.name.trim()) x.name = "Enter your name.";
    if (!form.company.trim()) x.company = "Enter your company.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) x.email = "Enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 6) x.phone = "Enter your phone number.";
    if (!form.item.trim()) x.item = "Tell us what you need.";
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
    body.append("item", form.item.trim());
    body.append("consent", "true"); // the box above is ticked (the page will not send without it)
    if (file) body.append("file", file);
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
    navigate("/sent", { state: { reference: res.data.reference, email: res.data.email, newAccount: res.data.new_account, id: res.data.id, name: form.name.trim(), company: form.company.trim(), item: form.item.trim() }, replace: true });
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
            <label className={labelClass}>What do you need?
              <textarea rows={5} aria-invalid={!!errors.item} className={`${inputClass} !h-auto py-3.5 leading-normal ${bad("item")}`} value={form.item} onChange={set("item")} placeholder="Items, quantities, specifications, delivery address…" />{err("item")}</label>
            <div className={labelClass}>
              <label htmlFor="rfq-file">Picture <span className="font-medium text-muted">(optional)</span></label>
              <div className="flex min-h-[68px] flex-wrap items-center gap-3.5 rounded-[14px] border-2 border-dashed border-[#cdbfd4] bg-blush px-4 py-3 text-sm font-medium text-[#4b3d54]">
                <input id="rfq-file" ref={fileRef} type="file" accept="image/*" onChange={pick} className="text-sm" />
                JPG or PNG, up to {MAX_MB} MB
              </div>
              {err("file")}
              {preview && <img src={preview} alt="Preview" className="mt-1 size-28 rounded-xl border border-line object-cover" />}
            </div>
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
