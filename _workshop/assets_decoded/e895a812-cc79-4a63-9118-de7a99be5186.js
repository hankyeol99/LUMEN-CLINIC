/* global React */
const { useState: useDPState, useRef: useDPRef, useEffect: useDPEffect } = React;

/* Shared arrow icon — used everywhere, exposed via window for sibling scripts. */
function ArrowIcon({ className }) {
  return (
    <svg
      className={"icon-arrow" + (className ? " " + className : "")}
      viewBox="0 -960 960 960"
      aria-hidden="true"
    >
      <path d="m553.85-253.85-42.16-43.38L664.46-450H180v-60h484.46L511.69-662.77l42.16-43.38L780-480 553.85-253.85Z" />
    </svg>
  );
}
window.ArrowIcon = ArrowIcon;

/* Chevron — slim list/menu indicator. Program 리스트의 row 화살표용. */
function ChevronIcon({ className }) {
  return (
    <svg
      className={"icon-chevron" + (className ? " " + className : "")}
      viewBox="0 -960 960 960"
      aria-hidden="true"
    >
      <path d="m517.85-480-184-184L376-706.15 602.15-480 376-253.85 333.85-296l184-184Z" />
    </svg>
  );
}
window.ChevronIcon = ChevronIcon;

/* ImageBox — wraps the .img placeholder. If the named image asset exists in
 * window.__lumenImages, an <img> with object-fit:cover is rendered on top of
 * the hatching pattern; otherwise the pattern shows through and the slot is
 * marked with data-image-name so future swaps know where to drop the file. */
function ImageBox({ name, className, modifier, tag, caption, alt }) {
  const meta = (window.__lumenImages || {})[name] || {};
  const hasPhoto = !!meta.uuid;
  const cls = ["img", modifier, className].filter(Boolean).join(" ");
  return (
    <div className={cls} data-image-name={name}>
      {hasPhoto && (
        <img
          className="img__photo"
          src={meta.uuid}
          alt={alt || meta.alt || ""}
          loading="lazy"
        />
      )}
      {tag && <span className="img__tag">{tag}</span>}
      {caption && <span className="img__caption">{caption}</span>}
    </div>
  );
}
window.ImageBox = ImageBox;

function LumenDatePicker({ value, onChange, placeholder = "YYYY · MM · DD" }) {
  const [open, setOpen] = useDPState(false);
  const [view, setView] = useDPState(() => {
    const d = value ? new Date(value) : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const wrapRef = useDPRef(null);

  useDPEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["S", "M", "T", "W", "T", "F", "S"];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = value ? new Date(value) : null;
  if (selected) selected.setHours(0, 0, 0, 0);

  const fmt = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y} · ${m} · ${day}`;
  };
  const fmtIso = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const firstDay = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.year, view.month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const navMonth = (delta) => {
    let m = view.month + delta;
    let y = view.year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setView({ year: y, month: m });
  };

  const pick = (d) => {
    onChange(fmtIso(d));
    setOpen(false);
  };

  return (
    <div className="dp" ref={wrapRef}>
      <button type="button" className={"dp__trigger" + (open ? " is-open" : "")} onClick={() => setOpen(!open)}>
        <span className={selected ? "dp__value" : "dp__placeholder"}>
          {selected ? fmt(selected) : placeholder}
        </span>
        <span className="dp__icon" aria-hidden="true">
          <span /><span /><span /><span />
        </span>
      </button>

      {open && (
        <div className="dp__panel">
          <div className="dp__head">
            <button type="button" className="dp__nav" onClick={() => navMonth(-1)} aria-label="prev"><ArrowIcon className="icon-arrow--prev dp__nav-icon" /></button>
            <div className="dp__head-mid">
              <span className="dp__head-month serif">{monthsEn[view.month]}</span>
              <span className="dp__head-year">{view.year}</span>
            </div>
            <button type="button" className="dp__nav" onClick={() => navMonth(1)} aria-label="next"><ArrowIcon className="dp__nav-icon" /></button>
          </div>

          <div className="dp__days">
            {days.map((d, i) => <div key={i} className="dp__day-h">{d}</div>)}
          </div>

          <div className="dp__grid">
            {cells.map((c, i) => {
              if (!c) return <div key={i} className="dp__cell dp__cell--empty" />;
              const isPast = c < today;
              const isToday = c.getTime() === today.getTime();
              const isSel = selected && c.getTime() === selected.getTime();
              return (
                <button
                  key={i}
                  type="button"
                  className={
                    "dp__cell" +
                    (isPast ? " is-past" : "") +
                    (isToday ? " is-today" : "") +
                    (isSel ? " is-sel" : "")
                  }
                  disabled={isPast}
                  onClick={() => pick(c)}
                >
                  <span>{String(c.getDate()).padStart(2, "0")}</span>
                </button>
              );
            })}
          </div>

          <div className="dp__foot">
            <button type="button" className="dp__foot-btn" onClick={() => { setView({ year: today.getFullYear(), month: today.getMonth() }); }}>
              오늘
            </button>
            <button type="button" className="dp__foot-btn" onClick={() => { onChange(""); setOpen(false); }}>
              지우기
            </button>
            <span className="dp__foot-meta">SCHEDULE · {monthsEn[view.month].slice(0,3).toUpperCase()} {view.year}</span>
          </div>
        </div>
      )}
    </div>
  );
}

window.LumenDatePicker = LumenDatePicker;
