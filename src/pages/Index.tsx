import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SiteShell from "@/components/layout/SiteShell";

export default function Index() {
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [formData, setFormData] = useState({
    fromZip: "", toZip: "", size: "", moveDate: "", phone: "", email: ""
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [formError, setFormError] = useState("");

  const zipOk = (z: string) => /^\d{5}$/.test(z.trim());
  const phoneOk = (p: string) => (p.replace(/\D/g, "")).length >= 10;
  const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  const handleSubmit = () => {
    const newErrors: Record<string, boolean> = {};
    if (!zipOk(formData.fromZip)) newErrors.fromZip = true;
    if (!zipOk(formData.toZip)) newErrors.toZip = true;
    if (!formData.size) newErrors.size = true;
    if (!formData.moveDate) newErrors.moveDate = true;
    if (!phoneOk(formData.phone)) newErrors.phone = true;
    if (!emailOk(formData.email)) newErrors.email = true;

    setErrors(newErrors);

    if (!selectedPath) {
      setFormError("Select Talk to a Specialist or Book a Virtual Meet to continue.");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setFormError("Please complete all fields. ZIP codes must be 5 digits.");
      return;
    }

    localStorage.setItem("tm_lead", JSON.stringify({ intent: selectedPath, ...formData, ts: Date.now() }));
    setFormError("");
  };

  return (
    <SiteShell>
      <div className="tru-page-frame">
        <div className="tru-page-inner">
          {/* HERO */}
          <section className="tru-hero">
            <div className="tru-hero-grid">
              <div>
                <div className="tru-hero-pill">
                  <span className="tru-hero-pill-dot"></span>
                  <span>Smarter moving, powered by TruMove</span>
                </div>
                <h1 className="tru-hero-title">Move day control, without the stress.</h1>
                <p className="tru-hero-sub">TruMove turns a few simple questions into instant pricing, vetted movers, and live support. No spam calls, no surprise add ons, no getting bounced around.</p>
                <div className="tru-hero-bullets">
                  <div className="tru-hero-badge"><span className="tru-hero-badge-dot"></span><span>Instant AI quotes</span></div>
                  <div className="tru-hero-badge"><span className="tru-hero-badge-dot"></span><span>Vetted mover network</span></div>
                  <div className="tru-hero-badge"><span className="tru-hero-badge-dot"></span><span>Real-time updates</span></div>
                </div>
                <div className="tru-hero-actions">
                  <button className="tru-hero-btn-secondary" type="button" onClick={() => navigate("/about")}>
                    <span>See how TruMove works</span><span className="chevron">→</span>
                  </button>
                </div>
                <div className="tru-hero-trustbar">
                  {[{code:"USDOT",label:"USDOT Compliant"},{code:"BOND",label:"Bonded and Insured"},{code:"FMCSA",label:"FMCSA Authorized Carriers"},{code:"BRKR",label:"Licensed Interstate Broker"}].map(t => (
                    <div key={t.code} className="tru-hero-trustitem">
                      <span className="tru-hero-trustseal" data-code={t.code}></span>
                      <span className="tru-hero-trustlabel">{t.label}</span>
                    </div>
                  ))}
                </div>
                <div className="tru-hero-note">No hidden fees, no endless phone calls, just one clean dashboard for your whole move.</div>
              </div>

              {/* HERO FORM */}
              <div className="tru-hero-visual">
                <div id="truHeroQuoteCard">
                  <div className="tru-form-micro">Secure Intake Console</div>
                  <div className="tru-hero-form-title">Start your move</div>
                  <div className="tru-hero-form-sub">Enter your move details, then choose how you want to proceed.</div>
                  <form className="tru-hero-form" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                    <div className="tru-hero-form-row two">
                      <input type="text" className={`tru-hero-input ${errors.fromZip ? "is-error" : ""}`} placeholder="Moving from (ZIP)" value={formData.fromZip} onChange={e => setFormData(p => ({ ...p, fromZip: e.target.value }))} />
                      <input type="text" className={`tru-hero-input ${errors.toZip ? "is-error" : ""}`} placeholder="Moving to (ZIP)" value={formData.toZip} onChange={e => setFormData(p => ({ ...p, toZip: e.target.value }))} />
                    </div>
                    <div className="tru-hero-form-row two">
                      <select className={`tru-hero-select ${errors.size ? "is-error" : ""}`} value={formData.size} onChange={e => setFormData(p => ({ ...p, size: e.target.value }))}>
                        <option value="" disabled>Move size</option>
                        <option value="Studio">Studio</option>
                        <option value="1 Bedroom">1 Bedroom</option>
                        <option value="2 Bedroom">2 Bedroom</option>
                        <option value="3 Bedroom">3 Bedroom</option>
                        <option value="4+ Bedroom">4+ Bedroom</option>
                      </select>
                      <input type="date" className={`tru-hero-input ${errors.moveDate ? "is-error" : ""}`} value={formData.moveDate} onChange={e => setFormData(p => ({ ...p, moveDate: e.target.value }))} />
                    </div>
                    <div className="tru-hero-form-row two">
                      <input type="tel" className={`tru-hero-input ${errors.phone ? "is-error" : ""}`} placeholder="Mobile number" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} />
                      <input type="email" className={`tru-hero-input ${errors.email ? "is-error" : ""}`} placeholder="Email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
                    </div>
                    <div className="tru-choice-wrap">
                      <button type="button" className={`tru-choice-btn ${selectedPath === "specialist" ? "is-selected" : ""}`} onClick={() => setSelectedPath("specialist")}>Talk to a Specialist</button>
                      <button type="button" className={`tru-choice-btn ${selectedPath === "virtual" ? "is-selected" : ""}`} onClick={() => setSelectedPath("virtual")}>Book a Virtual Meet</button>
                    </div>
                    <button className="tru-primary-cta" type="submit">Start building your move →</button>
                    {formError && <div className="tru-hero-form-err">{formError}</div>}
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* FEATURES */}
          <section className="tru-simple-wrap">
            <div className="tru-simple-inner">
              <div className="tru-simple-kicker">All in one platform</div>
              <h2 className="tru-simple-title">The essentials, done right.</h2>
              <p className="tru-simple-sub">From instant quotes to live support, TruMove keeps every part of your move in one place.</p>
              <div className="tru-simple-grid">
                {[{title:"Instant Pricing",text:"Turn a few details into AI powered quotes in seconds."},{title:"Inventory Made Easy",text:"Tap through rooms, add items, and watch your move build itself."},{title:"Live Video Help",text:"Walk your home with a TruMove specialist over secure video."},{title:"Smart Matching",text:"We rank movers on real performance, not paid placement."},{title:"Real Time Updates",text:"Track confirmations, crews, and timing from one live timeline."},{title:"Built In Protection",text:"We screen carriers and flag red flag reviews before you book."}].map(f => (
                  <article key={f.title} className="tru-simple-card">
                    <div className="tru-simple-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M13 2L5 14H11L11 22L19 10H13L13 2Z" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" /></svg></div>
                    <div className="tru-simple-card-title">{f.title}</div>
                    <div className="tru-simple-card-text">{f.text}</div>
                  </article>
                ))}
              </div>
              <div className="tru-simple-cta">
                <div className="tru-simple-cta-text"><span className="tru-simple-cta-strong">Want the full breakdown.</span> Compare TruMove to a traditional moving broker.</div>
                <button className="tru-simple-cta-btn" onClick={() => navigate("/vetting")}><span>See all features</span><span className="chevron">→</span></button>
              </div>
            </div>
          </section>

          {/* MISSION */}
          <section className="tru-mission-wrap">
            <div className="tru-mission-inner">
              <div className="tru-mission-kicker">OUR MISSION</div>
              <h2 className="tru-mission-title">Making moving <span>honest</span>, <span>clear</span>, and <span>predictable</span>.</h2>
              <p className="tru-mission-text">Our mission is to make moving honest, clear, and predictable, using AI and real carrier data.</p>
              <div className="tru-mission-stats-shell">
                <div className="tru-mission-stats-bar">
                  {[{num:"4.9★",label:"Average Rating"},{num:"10,000+",label:"Moves Assisted"},{num:"0",label:"Spam Calls, Ever"}].map(s => (
                    <div key={s.label} className="tru-mission-stat">
                      <div className="tru-mission-stat-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M12 4L13.9 8.24L18.5 8.74L15 11.79L15.9 16.3L12 14.1L8.1 16.3L9 11.79L5.5 8.74L10.1 8.24L12 4Z" strokeWidth="1.5" strokeLinejoin="round" /></svg></div>
                      <div className="tru-mission-stat-copy"><div className="tru-mission-stat-number">{s.num}</div><div className="tru-mission-stat-label">{s.label}</div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="tru-guarantee-wrap">
                <div className="tru-guarantee-card">
                  <div>
                    <div className="tru-guarantee-tag"><span className="tru-guarantee-tag-dot"></span><span>TruMove Guarantee</span></div>
                    <div className="tru-guarantee-title">If it feels off, we flag it before you ever sign.</div>
                    <div className="tru-guarantee-text">Every quote passes through our checks so you don't waste time on carriers that play games.</div>
                    <ul className="tru-guarantee-list"><li>No spam calls sold to other brokers.</li><li>No last minute surprise add ons.</li><li>Help from a real human if anything feels wrong.</li></ul>
                  </div>
                  <div className="tru-guarantee-side"><span className="tru-guarantee-highlight">We built TruMove from bad experiences.</span><br />If we wouldn't book a mover for our own families, they don't show up in your options.</div>
                </div>
              </div>
              <div className="tru-trust-wrap">
                <div className="tru-trust-row">
                  <span className="tru-trust-label">Trusted across thousands of moves.</span>
                  {["Google Reviews","Yelp Movers","Better Business Bureau"].map(b => (<span key={b} className="tru-trust-badge"><span className="tru-trust-dot"></span><span>{b}</span></span>))}
                </div>
              </div>
            </div>
          </section>

          {/* CONTACT */}
          <section className="tru-contact-wrap">
            <div className="tru-contact-inner">
              <h2 className="tru-contact-title">Contact Us</h2>
              <p className="tru-contact-sub">Have a question? Send us a message and a TruMove specialist will respond shortly.</p>
              <div className="tru-contact-card">
                <form className="tru-contact-form" onSubmit={e => { e.preventDefault(); window.location.href = "mailto:info@trumoveinc.com?subject=TruMove Contact"; }}>
                  <div className="tru-field"><div className="tru-field-inner"><span className="tru-field-icon"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="3.2" strokeWidth="1.6" /><path d="M6.5 18.4C7.6 16.5 9.7 15.3 12 15.3C14.3 15.3 16.4 16.5 17.5 18.4" strokeWidth="1.6" strokeLinecap="round" /></svg></span><input type="text" className="tru-contact-input" placeholder=" " required /><label className="tru-field-label">Your name</label></div></div>
                  <div className="tru-field"><div className="tru-field-inner"><span className="tru-field-icon"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="1.6" /><path d="M4 7L12 12.5L20 7" strokeWidth="1.6" strokeLinecap="round" /></svg></span><input type="email" className="tru-contact-input" placeholder=" " required /><label className="tru-field-label">Your email</label></div></div>
                  <div className="tru-field textarea-field"><div className="tru-field-inner"><span className="tru-field-icon"><svg viewBox="0 0 24 24" fill="none"><path d="M5 5H19V14H9L5 18V5Z" strokeWidth="1.6" strokeLinejoin="round" /></svg></span><textarea className="tru-contact-textarea" placeholder=" " required></textarea><label className="tru-field-label">Your message</label></div></div>
                  <div className="tru-contact-btn-row"><button type="submit" className="tru-contact-btn">Send Message</button><span className="tru-contact-hint">Average reply time under one business day.</span></div>
                </form>
              </div>
              <div className="tru-contact-secondary"><span>Prefer to talk to a real person.</span><button className="tru-contact-secondary-btn" onClick={() => navigate("/book")}><svg viewBox="0 0 24 24" fill="none"><path d="M6.5 4.5L9.5 4L11 7.5L9.3 8.7C9.9 9.9 10.8 10.9 12 11.7L13.9 10.4L17 12L16.3 15.3C16.2 15.8 15.8 16.1 15.3 16.2C14.1 16.5 12.3 16.1 10.3 14.8C8.3 13.4 6.9 11.7 6.1 10.1C5.5 8.9 5.3 7.8 5.5 6.9C5.6 6.4 5.9 5.9 6.5 4.5Z" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg><span>Talk to a TruMove specialist</span><span className="chevron">→</span></button></div>
            </div>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
