import { useEffect } from "react";
import { createPortal } from "react-dom";
import { LuX } from "react-icons/lu";

// A YouTube link (watch, share, shorts or embed) as an embeddable address; "" if it is not one.
export function youtubeEmbed(url) {
  try {
    const u = new URL(String(url || "").trim());
    const host = u.hostname.replace(/^www\.|^m\./, "");
    let id = "";
    if (host === "youtu.be") id = u.pathname.slice(1).split("/")[0];
    else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const parts = u.pathname.split("/").filter(Boolean);
      id = u.searchParams.get("v") || (["embed", "shorts", "live"].includes(parts[0]) ? parts[1] : "");
    }
    return /^[\w-]{6,20}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1` : "";
  } catch {
    return "";
  }
}

// The "how to use this site" video, in a pop-up.
export default function HowToVideo({ src, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="How to use this site" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="w-full max-w-4xl rounded-2xl bg-white p-4 text-ink shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-extrabold">How to use this site</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="flex size-10 items-center justify-center rounded-lg hover:bg-black/5">
            <LuX className="text-xl" />
          </button>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
          <iframe src={src} title="How to use this site" className="size-full" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
        </div>
      </div>
    </div>,
    document.body
  );
}
