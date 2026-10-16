import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { LuCheck } from "react-icons/lu";
import { LuEye, LuEyeOff } from "react-icons/lu";
import Spinner from "../components/spinner";
import { api, errorText, saveSession } from "../auth/customer";
import API from "../endpoint/base";
import air1 from "../images/air1.jpg";
import logoWhite from "../images/logo-white.png";
import logoPurple from "../images/logo-purple.png";
import { btnPurple, inputClass, labelClass } from "../lib/ui";

export default function SetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(!token);
  const [busy, setBusy] = useState(false);

  const rules = [
    ["At least 8 characters", pw.length >= 8],
    ["Not only numbers", pw.length > 0 && !/^\d+$/.test(pw)],
    ["Matches the confirmation", pw.length > 0 && pw === confirm],
  ];
  const ok = rules.every((r) => r[1]);

  const submit = async (e) => {
    e.preventDefault();
    if (!ok || busy) return;
    setBusy(true);
    setError("");
    const res = await api(API.customer.setPassword(), { method: "POST", body: { token, password: pw } });
    setBusy(false);
    if (res.ok) {
      saveSession(res.data);
      return navigate("/account", { replace: true, state: { welcome: true } });
    }
    if (/expired|already used/i.test(res.data?.detail || "")) setExpired(true);
    else setError(errorText(res));
  };

  return (
    <div className="flex min-h-[calc(100vh-220px)] flex-wrap bg-cream lg:min-h-[calc(125vh-125px)]">
      <section className="relative flex min-h-[260px] min-w-0 flex-[1_1_520px] flex-col justify-between overflow-hidden bg-aubergine p-8 text-white sm:p-14 lg:min-h-[calc(125vh-125px)]">
        <img src={air1} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(28,6,36,.9)_0%,rgba(28,6,36,.25)_55%,rgba(28,6,36,.5)_100%)]" aria-hidden="true" />
        <Link to="/" className="relative" aria-label="GH Procurement, home"><img src={logoWhite} alt="Gadgets Home" className="h-11 w-auto" /></Link>
        <h2 className="relative max-w-[520px] text-[38px] font-extrabold leading-[1.05] tracking-[-.03em] sm:text-[52px]">Welcome. One last step.</h2>
      </section>
      <main className="relative flex min-w-0 flex-[1_1_520px] items-center justify-center overflow-hidden px-5 py-12 sm:px-14">
        {/* the company logo as a faint, slanted watermark (same as the CMS) */}
        <img src={logoPurple} alt="" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 w-[min(80%,560px)] -translate-x-1/2 -translate-y-1/2 -rotate-[22deg] select-none opacity-[0.05]" />
        <div className="relative z-10 w-full max-w-[440px]">
          {expired ? (
            <>
              <h1 className="text-[34px] font-extrabold tracking-[-.02em] text-purple">This link has expired</h1>
              <p className="mb-6 mt-3 text-base leading-relaxed text-[#4b3d54]">The link works once and for 24 hours. Ask for a new one and we will email it.</p>
              <Link to="/signin" state={{ mode: "forgot" }} className={`${btnPurple} min-h-14 text-[17px]`}>Email me a new link</Link>
            </>
          ) : (
            <>
              <h1 className="text-[34px] font-extrabold tracking-[-.02em] text-purple">Choose your password</h1>
              <p className="mb-6 mt-2 text-base text-[#4b3d54]">You will use it to sign in and follow your requests.</p>
              <form onSubmit={submit} noValidate className="flex flex-col gap-[18px]">
                <div className={labelClass}>
                  <label htmlFor="new-pw">New password</label>
                  <div className="relative">
                    <input id="new-pw" type={show ? "text" : "password"} className={`${inputClass} !pr-14`} value={pw} onChange={(e) => { setPw(e.target.value); setError(""); }} autoComplete="new-password" autoFocus />
                    <button type="button" onClick={() => setShow((v) => !v)} aria-pressed={show} aria-label={show ? "Hide passwords" : "Show passwords"} className="absolute right-1.5 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-[22px] text-muted hover:bg-lilac hover:text-purple">{show ? <LuEyeOff aria-hidden="true" /> : <LuEye aria-hidden="true" />}</button>
                  </div>
                </div>
                <div className={labelClass}>
                  <label htmlFor="confirm-pw">Confirm password</label>
                  <div className="relative">
                    <input id="confirm-pw" type={show ? "text" : "password"} className={`${inputClass} !pr-14`} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
                    <button type="button" onClick={() => setShow((v) => !v)} aria-pressed={show} aria-label={show ? "Hide passwords" : "Show passwords"} className="absolute right-1.5 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-[22px] text-muted hover:bg-lilac hover:text-purple">{show ? <LuEyeOff aria-hidden="true" /> : <LuEye aria-hidden="true" />}</button>
                  </div>
                </div>
                <ul aria-label="Password rules" className="flex flex-col gap-1.5 text-[13.5px] text-[#4b3d54]">
                  {rules.map(([t, done]) => (
                    <li key={t} data-ok={done} className="flex items-center gap-2">
                      <span className={`flex size-4 items-center justify-center rounded-full ${done ? "bg-[#12633a] text-white" : "border-[1.5px] border-[#b9a9c2]"}`}>{done && <LuCheck className="text-[10px]" />}</span>{t}
                    </li>
                  ))}
                </ul>
                {error && <p role="alert" className="text-sm font-semibold text-[#b42318]">{error}</p>}
                <button type="submit" disabled={!ok || busy} className={`${btnPurple} min-h-14 text-[17px]`}>{busy ? <Spinner className="text-xl" /> : "Save and continue"}</button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
