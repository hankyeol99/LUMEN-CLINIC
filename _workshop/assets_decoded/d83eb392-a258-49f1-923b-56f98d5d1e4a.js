/* global React */
const { useState: useState3, useEffect: useEffect3, useRef: useRef3 } = React;
const ImageBox = window.ImageBox;
const ArrowIcon = window.ArrowIcon;

/* ─────────────── PROCESS ─────────────── */
function Process() {
  const steps = [
    { n: "01", t: "Reservation", kr: "예약", d: "온라인 또는 전화로 첫 방문을 예약합니다. 원하는 시간대와 관심 프로그램을 선택해 주세요." },
    { n: "02", t: "Skin Consultation", kr: "피부 상담", d: "피부 상태와 일상 루틴을 함께 살펴보는 1:1 상담. 충분한 시간을 두고 진행합니다." },
    { n: "03", t: "Condition Check", kr: "컨디션 체크", d: "결, 톤, 장벽, 유분 흐름 등 표면 상태를 정밀하게 확인합니다." },
    { n: "04", t: "Care Plan", kr: "케어 플랜", d: "확인한 컨디션을 바탕으로 단계별 케어 플랜과 주기를 함께 설계합니다." },
    { n: "05", t: "Treatment & Aftercare", kr: "케어 & 애프터", d: "정제된 흐름으로 케어를 진행하고, 마무리 후 일상 관리 가이드를 함께 전달합니다." },
  ];

  return (
    <section className="section process" id="process">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Process / 05 Steps</span>
            <h2 className="section-title">
              상담에서 케어까지,<br />
              <em>정돈된</em> 다섯 단계.
            </h2>
          </div>
          <p className="section-lede">
            모든 단계는 충분한 시간을 두고 진행됩니다.
            피부 상태에 따라 단계의 강도와 주기는 함께 조율할 수 있습니다.
          </p>
        </div>

        <ol className="process__rows">
          {steps.map((s, i) => (
            <li className="process__row" key={s.n}>
              <div className="process__num" aria-hidden="true">{s.n}</div>
              <div className="process__title">
                <h3 className="process__title-en">{s.t}</h3>
                <div className="process__title-kr">{s.kr}</div>
              </div>
              <p className="process__desc">{s.d}</p>
              <div className="process__time">
                {i === 0 ? "10 min" : i === 1 ? "30–40 min" : i === 2 ? "15 min" : i === 3 ? "20 min" : "60–90 min"}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─────────────── SPACE ─────────────── */
function Space() {
  const tiles = [
    { id: "s1", t: "Reception",        kr: "리셉션",   note: "Stone & linen, ambient light", img: "space-reception"    },
    { id: "s2", t: "Consultation Room", kr: "상담실",   note: "Private 1:1 setting",          img: "space-consultation" },
    { id: "s3", t: "Care Room A",      kr: "케어룸 A",  note: "Soft beige interior",          img: "space-care-room-a"  },
    { id: "s4", t: "Care Room B",      kr: "케어룸 B",  note: "Warm neutral palette",         img: "space-care-room-b"  },
    { id: "s5", t: "Powder Room",      kr: "파우더룸", note: "Quiet retreat space",          img: "space-powder-room"  },
    { id: "s6", t: "Lounge",           kr: "라운지",   note: "Tea & resting area",           img: "space-lounge"       },
  ];

  return (
    <section className="section space" id="space">
      <div className="wrap-wide">
        <div className="section-head section-head--flush wrap">
          <div>
            <span className="eyebrow">Space / Cheongdam</span>
            <h2 className="section-title">
              차분한 톤의<br />
              <em>프라이빗</em> 공간.
            </h2>
          </div>
          <p className="section-lede">
            스톤, 리넨, 우드 등 정제된 소재로 구성한 공간.
            상담실과 케어룸은 모두 독립적으로 분리되어 있습니다.
          </p>
        </div>

        <div className="space__grid">
          {tiles.map((t, i) => (
            <figure className={"space__tile space__tile--" + (i + 1)} key={t.id}>
              <ImageBox
                name={t.img}
                className="space__img"
                caption={t.note}
                alt={t.kr}
              />
              <figcaption className="space__cap">
                <span className="space__cap-en">{t.t}</span>
                <span className="space__cap-kr">{t.kr}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── SKIN CONCERNS (CareFocus rebuild) ─────────────── */
function CareFocus() {
  const concerns = [
    {
      id: "pigmentation",
      en: "Pigmentation.",
      kr: "색소 침착",
      symptom: "기미 · 잡티 · 흉터 자국",
      programs: 3,
      duration: "8–12주",
      image: "concerns-pigmentation",
    },
    {
      id: "acne",
      en: "Acne & Scars.",
      kr: "여드름 · 흉터",
      symptom: "활동성 여드름 · 함몰 흉터 · 자국",
      programs: 4,
      duration: "6–16주",
      image: "concerns-acne",
    },
    {
      id: "aging",
      en: "Aging.",
      kr: "노화 · 탄력 저하",
      symptom: "잔주름 · 처짐 · 볼륨 감소",
      programs: 5,
      duration: "12–24주",
      image: "concerns-aging",
    },
    {
      id: "pores",
      en: "Pores & Sebum.",
      kr: "모공 · 유분",
      symptom: "확장 모공 · 블랙헤드 · 과한 유분",
      programs: 3,
      duration: "4–8주",
      image: "concerns-pores",
    },
    {
      id: "sensitivity",
      en: "Sensitivity.",
      kr: "민감 · 홍조",
      symptom: "붉어짐 · 자극 반응 · 장벽 약화",
      programs: 2,
      duration: "6–10주",
      image: "concerns-sensitivity",
    },
    {
      id: "lifting",
      en: "Lifting & Contour.",
      kr: "리프팅 · 윤곽",
      symptom: "처진 윤곽 · 늘어진 피부",
      programs: 4,
      duration: "8–20주",
      image: "concerns-lifting",
    },
  ];

  const goProgram = () => {
    const el = document.getElementById("program");
    if (el) window.scrollTo({ top: el.offsetTop - 1, behavior: "smooth" });
  };

  return (
    <section className="concerns" id="concerns" aria-labelledby="concerns-title">
      <div className="concerns__inner wrap-wide">
        <div className="concerns__head">
          <div className="concerns__head-left">
            <span className="concerns__eyebrow">06 — Skin Concerns</span>
            <h2 id="concerns-title" className="concerns__title">
              고민에서 <em>시작하는</em> 케어.
            </h2>
          </div>
          <p className="concerns__lede">
            어떤 시술을 받을지보다 어떤 상태인지가 먼저입니다.
          </p>
        </div>

        <ul className="concerns__grid">
          {concerns.map((c) => (
            <li key={c.id} className="concerns__card">
              <div className="concerns__card-media">
                <ImageBox name={c.image} className="concerns__card-img" />
              </div>
              <div className="concerns__card-body">
                <div className="concerns__card-en">{c.en}</div>
                <div className="concerns__card-kr">{c.kr}</div>
                <div className="concerns__card-symptom">{c.symptom}</div>
              </div>
              <div className="concerns__card-meta">
                <span>{c.programs} Programs</span>
                <span>{c.duration}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="concerns__foot">
          <button type="button" className="btn-link" onClick={goProgram}>
            전체 케어 프로그램 보기 <ArrowIcon />
          </button>
        </div>
      </div>
    </section>
  );
}

window.Process = Process;
window.Space = Space;
window.CareFocus = CareFocus;
