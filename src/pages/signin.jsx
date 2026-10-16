import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff } from "react-icons/lu";
import Spinner from "../components/spinner";
import { api, errorText, getSession, saveSession } from "../auth/customer";
import API from "../endpoint/base";
import shipSea from "../images/ship-sea.jpg";
import logoWhite from "../images/logo-white.png";
import logoPurple from "../images/logo-purple.png";
import { btnPurple, inputClass, labelClass } from "../lib/ui";

export default function SignIn() {
  const navigate = useNavigate();
  const where = useLocation().state;
  const note = where?.note || "";
  const [mode, setMode] = useState(where?.mode === "forgot" ? "forgot" : "signin"); // signin | forgot | sent
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const signIn = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const res = await api(API.customer.login(), { method: "POST", body: { email: email.trim(), password } });
    setBusy(false);
    if (!res.ok) {
      setPassword("");
      return setError(errorText(res, "Invalid email or password."));
    }
    saveSession(res.data);
    navigate(where?.from || "/account", { replace: true });
  };

  const sendLink = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const res = await api(API.customer.requestLink(), { method: "POST", body: { email: email.trim() } });
    setBusy(false);
    if (!res.ok) return setError(errorText(res));
    setMode("sent");
  };

  if (getSession()) return <Navigate to="/account" replace />; // already signed in

  return (
    <div className="flex min-h-[calc(100vh-220px)] flex-wrap bg-cream lg:min-h-[calc(125vh-125px)]">
      <section className="relative flex min-h-[320px] min-w-0 flex-[1_1_520px] flex-col justify-between overflow-hidden bg-aubergine p-8 text-white sm:p-14 lg:min-h-[calc(125vh-125px)]">
        <img src={shipSea} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(28,6,36,.9)_0%,rgba(28,6,36,.25)_55%,rgba(28,6,36,.5)_100%)]" aria-hidden="true" />
        <Link to="/" className="relative" aria-label="GH Procurement, home"><img src={logoWhite} alt="Gadgets Home" className="h-11 w-auto" /></Link>
        <div className="relative">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[.1em] text-peach">Customer account</p>
          <h2 className="max-w-[520px] text-[38px] font-extrabold leading-[1.05] tracking-[-.03em] sm:text-[52px]">Follow your order from our store to your door.</h2>
          <p className="mt-5 max-w-[480px] text-lg leading-relaxed text-[#f1e3f5]">Every request you send gets a place here, with each step from sourcing to delivery.</p>
        </div>
      </section>

      <main className="relative flex min-w-0 flex-[1_1_520px] items-center justify-center overflow-hidden px-5 py-12 sm:px-14">
        {/* the company logo as a faint, slanted watermark (same as the CMS) */}
        <img src={logoPurple} alt="" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 w-[min(80%,560px)] -translate-x-1/2 -translate-y-1/2 -rotate-[22deg] select-none opacity-[0.05]" />
        <div className="relative z-10 w-full max-w-[440px]">
          {note && <p role="status" className="mb-6 rounded-xl border border-[#bfe0cb] bg-[#e6f2ea] px-4 py-3 text-sm font-semibold text-[#12633a]">{note}</p>}

          {mode === "signin" && (
            <>
              <h1 className="text-[34px] font-extrabold tracking-[-.02em] text-purple">Sign in</h1>
              <p className="mb-6 mt-2 text-base leading-normal text-[#4b3d54]">Follow your quote requests and orders.</p>
              <form onSubmit={signIn} noValidate className="flex flex-col gap-[18px]">
                <label className={labelClass}>Email<input type="email" className={inputClass} value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="example@email.com" autoComplete="username" autoFocus /></label>
                <div className={labelClass}>
                  <label htmlFor="signin-password">Password</label>
                  <div className="relative">
                    <input id="signin-password" type={show ? "text" : "password"} className={`${inputClass} !pr-14`} value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} autoComplete="current-password" aria-invalid={!!error} />
                    <button type="button" onClick={() => setShow((v) => !v)} aria-pressed={show} aria-label={show ? "Hide password" : "Show password"} className="absolute right-1.5 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-[22px] text-muted hover:bg-lilac hover:text-purple">{show ? <LuEyeOff aria-hidden="true" /> : <LuEye aria-hidden="true" />}</button>
                  </div>
                </div>
                {error && <p role="alert" className="text-sm font-semibold text-[#b42318]">{error}</p>}
                <button type="submit" disabled={busy || !email || !password} className={`${btnPurple} min-h-14 text-[17px]`}>{busy ? <Spinner className="text-xl" /> : "Sign in"}</button>
              </form>
              <p className="mt-4 text-[14.5px]"><button type="button" onClick={() => { setMode("forgot"); setError(""); }} className="font-extrabold text-purple underline">Forgot your password? Email me a link</button></p>
              <p className="mt-2.5 text-[14.5px] text-muted">No account yet? It is created when you <Link to="/request" className="font-extrabold text-purple underline">request a quote</Link>.</p>
            </>
          )}

          {mode === "forgot" && (
            <>
              <h1 className="text-[34px] font-extrabold tracking-[-.02em] text-purple">Choose a new password</h1>
              <p className="mb-6 mt-2 text-base leading-normal text-[#4b3d54]">Enter your email and we will send you a link.</p>
              <form onSubmit={sendLink} noValidate className="flex flex-col gap-[18px]">
                <label className={labelClass}>Email<input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" autoFocus /></label>
                {error && <p role="alert" className="text-sm font-semibold text-[#b42318]">{error}</p>}
                <button type="submit" disabled={busy || !email} className={`${btnPurple} min-h-14 text-[17px]`}>{busy ? <Spinner className="text-xl" /> : "Email me the link"}</button>
              </form>
              <p className="mt-4"><button type="button" onClick={() => setMode("signin")} className="text-[14.5px] font-extrabold text-purple underline">Back to sign in</button></p>
            </>
          )}

          {mode === "sent" && (
            <>
              <h1 className="text-[34px] font-extrabold tracking-[-.02em] text-purple">Check your email</h1>
              <p className="mb-6 mt-3 text-base leading-relaxed text-[#4b3d54]">If there is an account for <b>{email}</b>, we have sent a link to choose a password. It works once and expires after 24 hours. Check spam if you do not see it.</p>
              <button type="button" onClick={() => setMode("signin")} className="text-[14.5px] font-extrabold text-purple underline">Back to sign in</button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
