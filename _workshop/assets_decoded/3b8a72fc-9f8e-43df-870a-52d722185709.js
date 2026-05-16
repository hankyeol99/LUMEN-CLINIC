/* global React */
const { useState: useState4, useEffect: useEffect4, useRef: useRef4 } = React;
const ArrowIcon = window.ArrowIcon;
const ChevronIcon = window.ChevronIcon;

/* ─────────────── Reusable consult form ─────────────── */
const PROGRAMS = [
  "Skin Balance Care",
  "Tone & Texture Care",
  "Anti-aging Care",
  "Pore & Sebum Care",
  "Sensitive Skin Care",
  "Post-care Program",
  "상담 후 추천",
];

const CONCERNS = [
  "피부 장벽 / 진정",
  "톤과 결",
  "모공과 유분",
  "민감도 / 붉음",
  "탄력 / 결",
  "기타",
];

const EMPTY_FORM = {
  name: "", phone: "", program: "Skin Balance Care",
  concern: "", date: "", message: "", agree: false,
};

function Field({ label, required, error, children }) {
  return (
    <div className={"field" + (error ? " field--err" : "")}>
      <label className="field__label">
        <span>{label}</span>
        {required && <span className="field__req">required</span>}
      </label>
      <div className="field__control">{children}</div>
      {error && <div className="field__err">{error}</div>}
    </div>
  );
}

function ConsultForm({ formTag = "FORM · 01", autoFocusName = false }) {
  const [form, setForm] = useState4(EMPTY_FORM);
  const [errors, setErrors] = useState4({});
  const [submitted, setSubmitted] = useState4(false);
  const nameRef = useRef4(null);

  useEffect4(() => {
    if (autoFocusName && nameRef.current) nameRef.current.focus();
  }, [autoFocusName]);

  const update = (k, v) => setForm({ ...form, [k]: v });
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "이름을 입력해 주세요.";
    if (!form.phone.trim()) e.phone = "연락처를 입력해 주세요.";
    if (!form.agree) e.agree = "개인정보 수집·이용에 동의해 주세요.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };
  const reset = () => { setSubmitted(false); setForm(EMPTY_FORM); setErrors({}); };

  if (submitted) {
    return (
      <div className="consult-form consult-form--done">
        <span className="eyebrow">Reservation Received</span>
        <h2 className="section-title">
          상담 신청이 <em>전달</em>되었습니다.
        </h2>
        <p className="section-lede">
          영업일 기준 1일 이내, 입력해 주신 연락처로 담당 매니저가 안내드립니다.
          감사합니다.
        </p>
        <button type="button" className="btn btn--ghost" onClick={reset}>
          처음으로 <ArrowIcon />
        </button>
      </div>
    );
  }

  return (
    <form className="consult-form" onSubmit={submit} noValidate>
      <div className="contact__form-head">
        <span className="contact__form-tag">{formTag}</span>
        <span className="contact__form-step">필드 6 / 약 1분 소요</span>
      </div>

      <Field label="이름" required error={errors.name}>
        <input ref={nameRef} value={form.name} onChange={e => update("name", e.target.value)} placeholder="홍길동" />
      </Field>

      <Field label="연락처" required error={errors.phone}>
        <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="010-0000-0000" />
      </Field>

      <Field label="관심 프로그램">
        <div className="chips">
          {PROGRAMS.map(p => (
            <button
              type="button"
              key={p}
              className={"chip" + (form.program === p ? " is-on" : "")}
              onClick={() => update("program", p)}
              aria-pressed={form.program === p}
            >{p}</button>
          ))}
        </div>
      </Field>

      <Field label="피부 고민">
        <div className="chips">
          {CONCERNS.map(c => (
            <button
              type="button"
              key={c}
              className={"chip" + (form.concern === c ? " is-on" : "")}
              onClick={() => update("concern", c)}
              aria-pressed={form.concern === c}
            >{c}</button>
          ))}
        </div>
      </Field>

      <Field label="희망 날짜">
        <LumenDatePicker value={form.date} onChange={v => update("date", v)} />
      </Field>

      <Field label="문의 내용">
        <textarea
          rows={4}
          value={form.message}
          onChange={e => update("message", e.target.value)}
          placeholder="상담 시 알아두면 좋은 내용을 자유롭게 적어 주세요."
        />
      </Field>

      <label className={"contact__agree" + (errors.agree ? " has-error" : "")}>
        <input type="checkbox" checked={form.agree} onChange={e => update("agree", e.target.checked)} />
        <span className="contact__agree-box" aria-hidden="true">{form.agree ? "✓" : ""}</span>
        <span>개인정보 수집·이용에 동의합니다. 상담 안내 외 다른 목적으로 사용되지 않습니다.</span>
      </label>
      {errors.agree && <div className="contact__err">{errors.agree}</div>}

      <button className="btn contact__submit" type="submit">
        상담 예약하기 <ArrowIcon />
      </button>
    </form>
  );
}

/* ─────────────── CONTACT section ─────────────── */
function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="wrap-wide">
        <div className="contact__grid">
          <div className="contact__intro">
            <span className="eyebrow">Contact / Reservation</span>
            <h2 className="section-title">
              상담을 <em>예약</em>해 주세요.
            </h2>
            <p className="section-lede">
              담당 매니저가 입력해 주신 연락처로 안내드립니다.
              방문 전 상담 가이드와 준비 사항을 함께 보내드립니다.
            </p>

            <dl className="contact__info">
              <div>
                <dt>Address</dt>
                <dd>서울특별시 강남구 청담동 00-00<br />LUMEN BLD. 3F</dd>
              </div>
              <div>
                <dt>Hours</dt>
                <dd>Tue–Fri 11:00 – 20:00<br />Sat 10:00 – 18:00 / Sun · Mon Closed</dd>
              </div>
              <div>
                <dt>Tel</dt>
                <dd><a href="tel:0200000000">02-000-0000</a></dd>
              </div>
              <div>
                <dt>Mail</dt>
                <dd><a href="mailto:care@lumenclinic.kr">care@lumenclinic.kr</a></dd>
              </div>
            </dl>
          </div>

          <div className="contact__form">
            <ConsultForm formTag="FORM · 01" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── Consult modal ─────────────── */
function ConsultModal() {
  const [open, setOpen] = useState4(false);
  const dialogRef = useRef4(null);
  const lastFocus = useRef4(null);

  useEffect4(() => {
    const onOpen = () => {
      lastFocus.current = document.activeElement;
      setOpen(true);
    };
    window.addEventListener("lumen:open-consult", onOpen);
    return () => window.removeEventListener("lumen:open-consult", onOpen);
  }, []);

  useEffect4(() => {
    if (!open) return;
    document.body.classList.add("modal-open");
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    if (lastFocus.current && lastFocus.current.focus) lastFocus.current.focus();
  };

  if (!open) return null;

  const onBackdrop = (e) => {
    if (e.target === e.currentTarget) close();
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="consult-modal-title" onMouseDown={onBackdrop}>
      <div className="modal__box" ref={dialogRef}>
        <button type="button" className="modal__close" onClick={close} aria-label="Close">
          <span className="modal__close-icon" aria-hidden="true" />
        </button>
        <div className="modal__head">
          <span className="modal__eyebrow">Consult / Reservation</span>
          <h2 id="consult-modal-title" className="modal__title">
            상담을 <em>예약</em>해 주세요.
          </h2>
        </div>
        <ConsultForm formTag="FORM · MODAL" autoFocusName />
      </div>
    </div>
  );
}

/* ─────────────── Trust strip (Hero 직후 클리닉 stats) ─────────────── */
function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Clinic stats">
      <div className="trust-strip__inner wrap-wide">
        <ul className="trust-strip__list">
          <li>
            <span className="trust-strip__num">15</span>
            <span className="trust-strip__label">Years Experience</span>
          </li>
          <li>
            <span className="trust-strip__num">1:1</span>
            <span className="trust-strip__label">Private Care</span>
          </li>
          <li>
            <span className="trust-strip__num">07</span>
            <span className="trust-strip__label">Care Programs</span>
          </li>
        </ul>
        <div className="trust-strip__est">Est. 2018</div>
      </div>
    </section>
  );
}

/* ─────────────── Back to top ─────────────── */
function BackToTop() {
  const [visible, setVisible] = useState4(false);
  useEffect4(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      className={"back-to-top" + (visible ? " is-visible" : "")}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="페이지 맨 위로"
    >
      <ChevronIcon className="back-to-top__icon" />
    </button>
  );
}

/* ─────────────── FOOTER ─────────────── */
function Footer() {
  return (
    <footer className="foot">
      <div className="wrap-wide foot__inner">
        <div className="foot__brand">
          <div className="foot__logo">
            <span className="serif foot__logo-mark">Lumen</span>
            <span className="foot__logo-sub">CLINIC · CHEONGDAM</span>
          </div>
          <p className="foot__tag">
            피부의 균형을 읽고, 필요한 케어만 설계합니다.
          </p>
        </div>

        <div className="foot__cols">
          <nav className="foot__col" aria-label="Site">
            <h3 className="foot__col-h">Site</h3>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#program">Program</a></li>
              <li><a href="#process">Process</a></li>
              <li><a href="#space">Space</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
          <nav className="foot__col" aria-label="Info">
            <h3 className="foot__col-h">Info</h3>
            <ul>
              <li><a href="#contact">예약 안내</a></li>
              <li><a href="#contact">방문 가이드</a></li>
              <li><a href="#contact">FAQ</a></li>
              <li><a href="#contact">개인정보처리방침</a></li>
            </ul>
          </nav>
          <div className="foot__col">
            <h3 className="foot__col-h">Connect</h3>
            <ul>
              <li><a href="https://instagram.com/lumen.clinic" rel="noopener" target="_blank">Instagram · @lumen.clinic</a></li>
              <li><a href="#contact">Naver · LUMEN CLINIC</a></li>
              <li><a href="#contact">Kakao · @lumenclinic</a></li>
            </ul>
          </div>
          <address className="foot__col">
            <h3 className="foot__col-h">Visit</h3>
            <ul>
              <li>서울 강남구 청담동 00-00</li>
              <li>LUMEN BLD. 3F</li>
              <li><a href="tel:0200000000">02-000-0000</a></li>
            </ul>
          </address>
        </div>
      </div>

      <div className="foot__bar wrap-wide">
        <span>© 2026 LUMEN CLINIC. All rights reserved.</span>
        <span>의료법 · 광고 심의 가이드 준수</span>
        <span>Site · v1.0 / 2026</span>
      </div>
    </footer>
  );
}

window.ConsultForm = ConsultForm;
window.ConsultModal = ConsultModal;
window.TrustStrip = TrustStrip;
window.BackToTop = BackToTop;
window.Contact = Contact;
window.Footer = Footer;
