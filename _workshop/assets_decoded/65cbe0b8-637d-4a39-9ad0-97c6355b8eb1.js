/* global React */
const { useState, useEffect, useRef } = React;
const ArrowIcon = window.ArrowIcon;
const ChevronIcon = window.ChevronIcon;
const ImageBox = window.ImageBox;
const openConsult = () => window.dispatchEvent(new CustomEvent("lumen:open-consult"));

/* ─────────────── GNB ─────────────── */
function GNB() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("about");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { id: "about", label: "About" },
    { id: "program", label: "Program" },
    { id: "process", label: "Process" },
    { id: "space", label: "Space" },
    { id: "contact", label: "Contact" },
  ];

  const go = (id) => {
    setActive(id);
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 1, behavior: "smooth" });
  };

  return (
    <header className={"gnb" + (scrolled ? " gnb--scrolled" : "") + (mobileOpen ? " gnb--menu-open" : "")}>
      <div className="gnb__inner wrap-wide">
        <a className="gnb__logo" href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <span className="serif gnb__logo-serif">Lumen</span>
          <span className="gnb__logo-sub">CLINIC</span>
        </a>
        <nav className="gnb__nav" aria-label="Primary">
          {items.map(it => (
            <button
              type="button"
              key={it.id}
              className={"gnb__link" + (active === it.id ? " is-active" : "")}
              aria-current={active === it.id ? "page" : undefined}
              onClick={() => go(it.id)}
            >
              {it.label}
            </button>
          ))}
        </nav>
        <div className="gnb__right">
          <button type="button" className="btn btn--small" onClick={openConsult}>
            상담 예약 <ArrowIcon />
          </button>
        </div>
        <button
          type="button"
          className="gnb__burger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="gnb-mobile-menu"
        >
          <span /><span />
        </button>
      </div>
      {mobileOpen && (
        <nav id="gnb-mobile-menu" className="gnb__mobile" aria-label="Primary mobile">
          {items.map(it => (
            <button type="button" key={it.id} className="gnb__mobile-link" onClick={() => go(it.id)}>{it.label}</button>
          ))}
          <button type="button" className="btn" onClick={openConsult}>상담 예약하기 <ArrowIcon /></button>
        </nav>
      )}
    </header>
  );
}

/* ─────────────── HERO ─────────────── */
const HERO_SLIDES = [
  { img: "hero-treatment-room",  label: "Treatment Room" },
  { img: "hero-treatment-suite", label: "Treatment Suite" },
  { img: "hero-counter",         label: "Product Counter" },
  { img: "hero-lounge",          label: "Lounge" },
];

function Hero() {
  const [idx, setIdx] = useState(0);
  const current = HERO_SLIDES[idx];
  const total = HERO_SLIDES.length;
  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  return (
    <section className="hero" id="top">
      <div className="hero__bg">
        <ImageBox key={current.img} name={current.img} className="hero__bg-img" />
      </div>

      <div className="hero__overlay">
        <div className="hero__copy">
          <span className="hero__eyebrow">청담 · Premium Skin Clinic</span>
          <h1 className="hero__title">
            Balance,<br />
            quietly restored.
          </h1>
          <p className="hero__sub">
            {/* TODO: 실제 운영 정보로 교체. 아래는 placeholder. */}
            15년차 피부과 전문의가 직접 진단하고, 평균 42분의 1:1 상담을 거쳐 케어 플랜을 설계합니다.
          </p>
          <div className="hero__cta">
            <button type="button" className="btn btn--outline-light" onClick={openConsult}>
              상담 예약하기 <ArrowIcon />
            </button>
            <button
              type="button"
              className="btn-link btn-link--light"
              onClick={() => document.getElementById("program").scrollIntoView({ behavior: "smooth" })}
            >
              프로그램 보기 <ArrowIcon />
            </button>
          </div>
        </div>

        <div className="hero__meta">
          <div className="hero__meta-nav" role="group" aria-label="Hero slides">
            <button
              type="button"
              className="hero__nav-btn"
              onClick={prev}
              aria-label="Previous slide"
            >
              <ChevronIcon className="icon-chevron--prev hero__nav-icon" />
            </button>
            <button
              type="button"
              className="hero__nav-btn"
              onClick={next}
              aria-label="Next slide"
            >
              <ChevronIcon className="hero__nav-icon" />
            </button>
          </div>
          <div className="hero__meta-num">
            {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
          <div className="hero__meta-label">{current.label}</div>
        </div>
      </div>

      <div className="hero__scroll-cue">SCROLL ↓</div>
    </section>
  );
}

window.GNB = GNB;
window.Hero = Hero;
