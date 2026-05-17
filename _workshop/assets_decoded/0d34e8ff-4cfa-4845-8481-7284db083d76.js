/* global React */
const { useState: useState2, useEffect: useEffect2 } = React;
const ArrowIcon = window.ArrowIcon;
const ChevronIcon = window.ChevronIcon;
const ImageBox = window.ImageBox;
const openConsult = () => window.dispatchEvent(new CustomEvent("lumen:open-consult"));

/* ─────────────── PHILOSOPHY ─────────────── */
function Philosophy() {
  const points = [
    {
      n: "01",
      t: "균형의 회복",
      en: "Balance",
      d: "과한 변화보다 피부 본연의 균형을 회복하는 흐름. 외부 자극을 줄이고 피부가 스스로 정돈될 수 있는 조건을 만듭니다.",
      img: "philosophy-balance",
    },
    {
      n: "02",
      t: "상태 우선의 상담",
      en: "Consultation first",
      d: "시술이 아닌 상태 점검에서 시작합니다. 결, 톤, 장벽, 수분, 유분의 균형을 먼저 읽고 케어 방향을 함께 정합니다.",
      img: "philosophy-consultation",
    },
    {
      n: "03",
      t: "개인 맞춤 플랜",
      en: "Personal plan",
      d: "한 가지 정답이 아닌 개인 컨디션에 맞춘 단계별 플랜. 무리 없는 주기와 강도를 함께 설계합니다.",
      img: "philosophy-personal-plan",
    },
    {
      n: "04",
      t: "프라이빗한 공간",
      en: "Private space",
      d: "차분한 톤의 독립된 케어룸. 상담부터 마무리까지 동선을 분리해 편안한 케어 시간을 제공합니다.",
      img: "philosophy-private-space",
    },
  ];

  const [activeIdx, setActiveIdx] = useState2(0);
  const current = points[activeIdx];

  return (
    <section className="section philosophy" id="about">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">About / Philosophy</span>
            <h2 className="section-title">
              Balanced <em>care,</em><br />
              refined <em>experience.</em>
            </h2>
          </div>
          <p className="section-lede">
            LUMEN CLINIC은 즉각적인 변화를 약속하기보다, 피부가 스스로 균형을 찾아가는 과정을 함께합니다.
            상담에서 케어, 마무리까지 하나의 경험으로 다듬었습니다.
          </p>
        </div>

        <div className="philosophy__visual" aria-live="polite">
          <ImageBox
            key={current.n}
            name={current.img}
            className="philosophy__visual-img"
            alt={current.t}
          />
        </div>

        <div className="philosophy__grid">
          {points.map((p, i) => (
            <article
              className={"philosophy__card" + (i === activeIdx ? " is-active" : "")}
              key={p.n}
              onMouseEnter={() => setActiveIdx(i)}
              onFocus={() => setActiveIdx(i)}
              tabIndex={0}
            >
              <div className="philosophy__num">{p.n}</div>
              <div className="philosophy__en">{p.en}</div>
              <h3 className="philosophy__title">{p.t}</h3>
              <p className="philosophy__desc">{p.d}</p>
            </article>
          ))}
        </div>

        <blockquote className="philosophy__quote">
          <span className="philosophy__quote-mark" aria-hidden="true">“</span>
          <p>
            <span className="serif">Skin is a record of time.</span><br />
            우리는 그 기록을 지우려 하지 않습니다.<br />
            오늘의 피부가 더 편안할 수 있도록, 균형을 다듬을 뿐입니다.
          </p>
        </blockquote>
      </div>
    </section>
  );
}

/* ─────────────── PROGRAM ─────────────── */
function Program() {
  const programs = [
    {
      id: "p1",
      code: "P · 01",
      en: "Skin Balance Care",
      kr: "무너진 장벽과 수분 균형을 정돈하는 기본 케어",
      tag: "BARRIER",
      desc: "수분과 유분의 균형, 피부 장벽 회복에 집중하는 베이스 케어. 자극을 줄이고 피부 톤을 정돈합니다.",
      meta: "60–80 min · 단계별 플랜",
      img: "program-skin-balance",
    },
    {
      id: "p2",
      code: "P · 02",
      en: "Tone & Texture Care",
      kr: "칙칙한 톤과 거친 결을 함께 정리하는 케어",
      tag: "TONE",
      desc: "결과 톤을 다듬는 편집형 케어. 컨디션에 따라 표면 정리와 보습 단계를 조율합니다.",
      meta: "70–90 min · 컨디션 기반",
      img: "program-tone-texture",
    },
    {
      id: "p3",
      code: "P · 03",
      en: "Anti-aging Care",
      kr: "탄력 저하와 잔주름을 고려한 집중 케어",
      tag: "FIRMNESS",
      desc: "탄력감과 결을 함께 살피는 단계적 접근. 무리한 변화 대신 정돈된 흐름으로 설계합니다.",
      meta: "80–100 min · 정기 케어",
      img: "program-anti-aging",
    },
    {
      id: "p4",
      code: "P · 04",
      en: "Pore & Sebum Care",
      kr: "모공, 피지, 번들거림을 정돈하는 밸런싱 케어",
      tag: "CLARITY",
      desc: "유분 흐름과 모공 컨디션을 정리하는 케어. 자극을 줄이며 표면 흐름을 다듬습니다.",
      meta: "60–80 min · 주기 조율",
      img: "program-pore-sebum",
    },
    {
      id: "p5",
      code: "P · 05",
      en: "Hydration Care",
      kr: "건조함과 속당김을 완화하는 수분 케어",
      tag: "MOISTURE",
      desc: "속당김과 건조감을 다스리는 깊은 수분 케어. 장벽을 진정시키며 피부 결을 매끄럽게 정돈합니다.",
      meta: "50–70 min · 수분 집중",
      img: "program-sensitive",
    },
    {
      id: "p6",
      code: "P · 06",
      en: "Recovery Care",
      kr: "민감해진 피부를 진정시키는 회복 케어",
      tag: "CALM",
      desc: "예민해진 피부의 진정과 회복에 집중하는 흐름. 외부 자극을 줄이고 본래 컨디션으로 돌아오도록 돕습니다.",
      meta: "40–60 min · 회복 단계",
      img: "program-post-care",
    },
  ];

  const [active, setActive] = useState2("p1");
  const current = programs.find(p => p.id === active);

  // Mobile carousel active-dot tracking. IntersectionObserver with the track
  // as root didn't fire reliably in this snap container, so we read scrollLeft
  // and round to the nearest slide index instead.
  const carouselRef = React.useRef(null);
  const [carouselIdx, setCarouselIdx] = useState2(0);
  useEffect2(() => {
    const track = carouselRef.current;
    if (!track) return;
    const update = () => {
      const slides = track.querySelectorAll(".program__carousel-slide");
      if (!slides.length) return;
      const first = slides[0];
      const second = slides[1];
      // Step = slide width + gap. Fall back to slide width if only one slide.
      const step = second
        ? second.getBoundingClientRect().left - first.getBoundingClientRect().left
        : first.getBoundingClientRect().width;
      if (step <= 0) return;
      const idx = Math.round(track.scrollLeft / step);
      const clamped = Math.max(0, Math.min(slides.length - 1, idx));
      setCarouselIdx(clamped);
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section className="section program section--soft" id="program">
      <div className="wrap">
        <div className="section-head program__head">
          <div>
            <span className="eyebrow">Program / 06</span>
            <h2 className="section-title">
              컨디션에 맞춘<br />
              여섯 가지 케어 플랜
            </h2>
            <p className="section-lede">
              모든 프로그램은 상담 후 컨디션에 따라 단계와 강도를 조율합니다.
              번호와 코드는 케어의 흐름을 정리하기 위한 표기입니다.
            </p>
          </div>
        </div>

        <div className="program__layout">
          <div className="program__list" role="tablist" aria-label="Care programs">
            {programs.map((p) => (
              <button
                type="button"
                role="tab"
                aria-selected={active === p.id}
                key={p.id}
                className={"program__row" + (active === p.id ? " is-active" : "")}
                onMouseEnter={() => setActive(p.id)}
                onFocus={() => setActive(p.id)}
                onClick={() => setActive(p.id)}
              >
                <span className="program__row-code">{p.code}</span>
                <span className="program__row-en">{p.en}</span>
                <span className="program__row-kr">{p.kr}</span>
                <span className="program__row-tag">{p.tag}</span>
                <ChevronIcon className="program__row-arrow" />
              </button>
            ))}
          </div>

          <aside className="program__detail">
            <ImageBox
              key={current.id}
              name={current.img}
              className="program__img"
              alt={current.kr}
            />
            <div className="program__detail-body">
              <div className="program__detail-tag">{current.tag}</div>
              <h3 className="program__detail-title">
                <span className="serif">{current.en}</span>
              </h3>
              <div className="program__detail-kr">{current.kr}</div>
              <p className="program__detail-desc">{current.desc}</p>
              <div className="program__detail-meta">{current.meta}</div>
              <button type="button" className="btn btn--ghost program__detail-cta" onClick={openConsult}>
                상담 문의 <ArrowIcon />
              </button>
            </div>
          </aside>
        </div>

        <div className="program__carousel" role="region" aria-label="프로그램 캐러셀">
          <ul className="program__carousel-track" ref={carouselRef}>
            {programs.map((p) => (
              <li className="program__carousel-slide" key={p.id}>
                <ImageBox
                  name={p.img}
                  className="program__carousel-img"
                  alt={p.kr}
                />
                <div className="program__carousel-body">
                  <div className="program__carousel-tag">{p.tag}</div>
                  <h3 className="program__carousel-title">
                    <span className="serif">{p.en}</span>
                  </h3>
                  <div className="program__carousel-kr">{p.kr}</div>
                  <p className="program__carousel-desc">{p.desc}</p>
                  <div className="program__carousel-meta">{p.meta}</div>
                  <button
                    type="button"
                    className="btn btn--ghost program__carousel-cta"
                    onClick={openConsult}
                  >
                    상담 문의 <ArrowIcon />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="program__carousel-pagination" aria-hidden="true">
            {programs.map((_, i) => (
              <span
                className={
                  "program__carousel-dot" + (i === carouselIdx ? " is-active" : "")
                }
                key={i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

window.Philosophy = Philosophy;
window.Program = Program;
