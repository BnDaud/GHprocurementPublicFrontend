import { useContext } from "react";
import { LuQuote } from "react-icons/lu";
import { globalContext } from "../App";
import { eyebrow, secure } from "../lib/ui";

const who = (e) => [e.person, e.company].filter(Boolean).join(", ");

// Photos of delivered orders and what customers said, added by the team in the CMS.
// With nothing published the section does not show at all.
export default function Showcase() {
  const { showcase } = useContext(globalContext);
  if (!showcase?.length) return null;
  return (
    <section id="delivered" className="scroll-mt-4 pb-24">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-10">
        <p className={`${eyebrow} mb-2.5`}>Delivered</p>
        <h2 className="mb-8 text-[36px] font-extrabold leading-[1.08] tracking-[-.025em] text-purple sm:text-5xl">Real orders. Real customers.</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {showcase.map((e) =>
            e.kind === "testimonial" ? (
              <figure key={e.id} className="flex flex-col gap-4 rounded-[22px] bg-purple p-7 text-white transition-[translate,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(66,14,81,.25)] motion-reduce:transition-none">
                <LuQuote className="text-3xl text-peach" aria-hidden="true" />
                {e.title && <p className="text-[13px] font-extrabold uppercase tracking-[.08em] text-peach">{e.title}</p>}
                <blockquote className="flex-1 whitespace-pre-line text-[18px] font-bold leading-snug">{e.quote}</blockquote>
                {(who(e) || e.image_url) && (
                  <figcaption className="flex items-center gap-3 border-t border-white/20 pt-4">
                    {e.image_url && <img src={secure(e.image_url)} alt="" loading="lazy" className="size-12 flex-none rounded-full object-cover" />}
                    <span className="text-[14.5px] font-bold text-[#f1e3f5]">{who(e)}</span>
                  </figcaption>
                )}
              </figure>
            ) : (
              <figure key={e.id} className="group relative min-h-[300px] overflow-hidden rounded-[22px] bg-lilac text-white transition-[translate,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(66,14,81,.25)] motion-reduce:transition-none">
                {e.image_url && <img src={secure(e.image_url)} alt={e.title || "A delivered order"} loading="lazy" className="absolute inset-0 size-full object-cover" />}
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(28,6,36,.82)_0%,rgba(28,6,36,0)_60%)]" aria-hidden="true" />
                <figcaption className="absolute inset-x-6 bottom-5">
                  {e.title && <p className="text-[19px] font-extrabold leading-snug">{e.title}</p>}
                  {e.quote && <p className="mt-1 line-clamp-2 text-[14px] text-[#f1e3f5]">{e.quote}</p>}
                  {who(e) && <p className="mt-1.5 text-[12.5px] font-extrabold uppercase tracking-[.06em] text-peach">{who(e)}</p>}
                </figcaption>
              </figure>
            )
          )}
        </div>
      </div>
    </section>
  );
}
