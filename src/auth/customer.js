// The customer's sign-in, kept in the browser. Same idea as the CMS: a signed
// token with an expiry; the server is the one that decides what it allows.
const KEY = "gh_cust_session";
const EVENT = "gh-customer-session";

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
};

export function getSession() {
  const s = read();
  if (!s || !s.token || Date.now() > s.expires) {
    if (s) clearSession();
    return null;
  }
  return s;
}

export function saveSession({ token, expires_in, user }) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ token, user, expires: Date.now() + expires_in * 1000 }));
  } catch {
    /* private window: the page keeps working for this visit only */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
  window.dispatchEvent(new Event(EVENT));
}

export const onSessionChange = (fn) => {
  window.addEventListener(EVENT, fn);
  window.addEventListener("storage", fn); // another tab signed in or out
  return () => {
    window.removeEventListener(EVENT, fn);
    window.removeEventListener("storage", fn);
  };
};

// fetch JSON from the API; returns {ok, status, data}. A 401 ends the session.
export async function api(url, { method = "GET", body, auth = false } = {}) {
  const headers = {};
  const isForm = body instanceof FormData;
  if (body && !isForm) headers["Content-Type"] = "application/json";
  if (auth) {
    const s = getSession();
    if (s) headers.Authorization = `Bearer ${s.token}`;
  }
  try {
    const res = await fetch(url, { method, headers, body: body ? (isForm ? body : JSON.stringify(body)) : undefined });
    let data = null;
    try {
      data = await res.json();
    } catch {
      /* empty body */
    }
    if (res.status === 401 && auth) clearSession();
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: { detail: "We could not reach the server. Check your connection and try again." } };
  }
}

export const errorText = (res, fallback = "Something went wrong. Please try again.") => {
  if (res?.status === 429 && !res?.data?.fields) return "Too many tries. Wait a minute and try again.";
  const d = res?.data;
  if (!d) return fallback;
  if (typeof d.detail === "string") return d.detail;
  if (d.fields) return Object.values(d.fields).flat().join(" ");
  return fallback;
};

// Signing out on purpose should land on the home page; a session that simply ran out should land on Sign in.
let signedOutAt = 0;
export const markSignedOut = () => {
  signedOutAt = Date.now();
};
export const justSignedOut = () => Date.now() - signedOutAt < 1500;
