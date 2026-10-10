import { useEffect } from "react";

export const SITE = (import.meta.env.VITE_SITE_URL || "https://www.ghprocurement.com").replace(/\/$/, "");

const upsert = (selector, make) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = make();
    document.head.appendChild(el);
  }
  return el;
};
const meta = (attr, name, content) => {
  const el = upsert(`meta[${attr}="${name}"]`, () => {
    const m = document.createElement("meta");
    m.setAttribute(attr, name);
    return m;
  });
  el.setAttribute("content", content);
};

/**
 * Title, description, canonical link, share tags and (optionally) extra
 * structured data for the current page. Private pages pass noindex.
 */
export function useSeo({ title, description, path = "/", noindex = false, jsonLd = [] }) {
  const ld = JSON.stringify(jsonLd);
  useEffect(() => {
    document.title = title;
    meta("name", "description", description);
    meta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    meta("property", "og:title", title);
    meta("property", "og:description", description);
    meta("name", "twitter:title", title);
    meta("name", "twitter:description", description);
    // a page points to its own address; private pages (marked noindex) point to the home page
    upsert('link[rel="canonical"]', () => {
      const l = document.createElement("link");
      l.setAttribute("rel", "canonical");
      return l;
    }).setAttribute("href", `${SITE}${noindex ? "/" : path}`);

    const scripts = JSON.parse(ld).map((obj) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.dataset.seo = "page";
      s.textContent = JSON.stringify(obj);
      document.head.appendChild(s);
      return s;
    });
    return () => scripts.forEach((s) => s.remove());
  }, [title, description, path, noindex, ld]);
}
