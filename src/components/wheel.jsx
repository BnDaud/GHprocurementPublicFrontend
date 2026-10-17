import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

const mod = (i, n) => ((i % n) + n) % n;

// A looping wheel, like setting the hours on a clock: spin it with the mouse wheel, a drag, the arrow buttons or the
// arrow keys. Past the last item it starts again at the first. The item in the middle is the one you open.
// items: the list. height: pixels per row. render(item): the card's inside. hrefFor(item): where the middle card goes.
export default function Wheel({ items, height = 136, render, hrefFor, onSettle, label = "Items", noun = "item" }) {
  const n = items.length;
  const box = useRef(null);
  const [pos, setPos] = useState(0); // which item is in the middle (a fraction while it is moving)
  const state = useRef({ pos: 0, target: 0, raf: 0, kick: null, drag: null, moved: false, idle: 0 });
  const settle = useRef(onSettle);
  useEffect(() => {
    settle.current = onSettle;
  }, [onSettle]);

  // the motion: ease towards the target, and say which item is in the middle once it stops
  useEffect(() => {
    const s = state.current;
    function tick() {
      s.pos += (s.target - s.pos) * 0.22;
      if (Math.abs(s.target - s.pos) < 0.002) s.pos = s.target;
      setPos(s.pos);
      if (s.pos === s.target) {
        s.raf = 0;
        settle.current?.(mod(Math.round(s.pos), n));
      } else s.raf = requestAnimationFrame(tick);
    }
    s.kick = () => {
      if (!s.raf) s.raf = requestAnimationFrame(tick);
    };
    return () => cancelAnimationFrame(s.raf);
  }, [n]);
  const go = useCallback((target) => {
    const s = state.current;
    s.target = target;
    s.kick?.();
  }, []);
  const step = (by) => go(Math.round(state.current.target) + by);

  // the mouse wheel spins it while the pointer is over it (it must not also scroll the page)
  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    const onWheel = (e) => {
      e.preventDefault();
      const s = state.current;
      s.target += (e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY) / (height * 1.4);
      clearTimeout(s.idle);
      s.idle = setTimeout(() => go(Math.round(s.target)), 110); // settle on the nearest one
      s.kick?.();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [go, height]);

  const down = (e) => {
    e.preventDefault(); // no text selection, and the click must not make the page jump
    box.current?.focus({ preventScroll: true });
    if (e.target.closest("a")) state.current.drag = { y: e.clientY, start: state.current.target, id: e.pointerId, last: e.clientY, t: e.timeStamp, v: 0, link: true };
    else state.current.drag = { y: e.clientY, start: state.current.target, id: e.pointerId, last: e.clientY, t: e.timeStamp, v: 0 };
    state.current.moved = false;
  };
  const move = (e) => {
    const s = state.current;
    const d = s.drag;
    if (!d) return;
    const dy = e.clientY - d.y;
    if (Math.abs(dy) > 6 && !s.moved) {
      s.moved = true;
      box.current?.setPointerCapture?.(d.id);
    }
    if (!s.moved) return;
    d.v = (e.clientY - d.last) / Math.max(1, e.timeStamp - d.t);
    d.last = e.clientY;
    d.t = e.timeStamp;
    s.pos = s.target = d.start - dy / height;
    setPos(s.pos);
  };
  const up = (e) => {
    const s = state.current;
    const d = s.drag;
    s.drag = null;
    const v = d && e.timeStamp - d.t < 90 ? d.v : 0; // holding still before letting go means no flick
    if (d && s.moved) go(Math.round(s.target - Math.max(-2, Math.min(2, (v * 120) / height)))); // a flick carries on a little (at most 2 rows)
  };
  // a drag must not count as a click on a link
  const stopClick = (e) => {
    if (state.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      state.current.moved = false;
    }
  };

  const onKey = (e) => {
    if (e.key === "ArrowDown") (e.preventDefault(), step(1));
    else if (e.key === "ArrowUp") (e.preventDefault(), step(-1));
  };

  const base = Math.round(pos);
  const centre = mod(base, n);
  const H = height * 3;
  const rows = [-2, -1, 0, 1, 2].map((k) => {
    const d = base + k - pos; // how far this row is from the middle, in rows
    return { k, d, item: items[mod(base + k, n)], index: mod(base + k, n) };
  });

  return (
    <div className="mx-auto w-full max-w-[760px]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[14px] font-bold text-muted" aria-live="polite">
          {noun[0].toUpperCase() + noun.slice(1)} {centre + 1} of {n} <span className="font-medium">· scroll or drag to spin</span>
        </p>
        <div className="flex gap-2">
          <button type="button" aria-label={`Previous ${noun}`} onClick={() => step(-1)} className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-[#d8c7df] bg-white text-xl text-purple hover:bg-lilac"><LuChevronUp /></button>
          <button type="button" aria-label={`Next ${noun}`} onClick={() => step(1)} className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-[#d8c7df] bg-white text-xl text-purple hover:bg-lilac"><LuChevronDown /></button>
        </div>
      </div>
      <div
        ref={box}
        role="group"
        aria-label={`${label}. Use the up and down arrow keys to spin.`}
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onClickCapture={stopClick}
        className="relative select-none overflow-hidden rounded-[28px] bg-[#f3e8f6] outline-none focus-visible:ring-4 focus-visible:ring-purple/30"
        style={{ height: H, touchAction: "none", perspective: 900, cursor: "grab" }}
      >
        {/* the highlight band that marks the middle row */}
        <div className="pointer-events-none absolute inset-x-3 rounded-[24px] border-2 border-purple/25 bg-white/40" style={{ top: height, height }} aria-hidden="true" />
        {rows.map(({ k, d, item, index }) => {
          const a = Math.abs(d);
          const middle = a < 0.5;
          return (
            <div
              key={`${k}`}
              className="absolute inset-x-3"
              aria-hidden={!middle}
              style={{
                top: height + d * height,
                height,
                opacity: Math.max(0, 1 - a * 0.38),
                transform: `scale(${1 - Math.min(a, 2) * 0.07}) rotateX(${-d * 14}deg)`,
                zIndex: 10 - Math.round(a * 2),
                pointerEvents: a > 1.6 ? "none" : "auto",
              }}
            >
              {middle && !hrefFor ? (
                <div className="block h-full rounded-[24px] bg-white shadow-[0_14px_34px_rgba(46,10,58,.18)]">{render(item, true)}</div>
              ) : middle ? (
                <Link to={hrefFor(item)} className="block h-full rounded-[24px] bg-white shadow-[0_14px_34px_rgba(46,10,58,.18)] transition hover:shadow-[0_18px_40px_rgba(46,10,58,.26)]" tabIndex={0}>
                  {render(item, middle)}
                </Link>
              ) : (
                <div role="button" tabIndex={-1} onClick={() => go(Math.round(pos) + k)} className="block h-full cursor-pointer rounded-[24px] bg-white shadow-[0_8px_22px_rgba(46,10,58,.10)]" aria-label={`Show ${noun} ${index + 1}`}>
                  {render(item, middle)}
                </div>
              )}
            </div>
          );
        })}
        {/* the top and bottom fade, like a drum */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#f3e8f6] to-transparent" style={{ zIndex: 20 }} aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f3e8f6] to-transparent" style={{ zIndex: 20 }} aria-hidden="true" />
      </div>
    </div>
  );
}
