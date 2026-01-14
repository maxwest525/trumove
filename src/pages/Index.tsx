import { useNavigate } from "react-router-dom";
import SiteShell from "@/components/layout/SiteShell";
import ChatContainer from "@/components/chat/ChatContainer";
import MoveMap from "@/components/MoveMap";
import { Shield, Cpu, Video, Boxes, Calculator, Search, CheckCircle, MapPin, Route, Clock, DollarSign, Headphones, Phone, ArrowRight } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

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
                  <span>Long-Distance Moving Specialists</span>
                </div>
                <h1 className="tru-hero-title">Long-Distance Moves. Done Differently.</h1>
                <p className="tru-hero-sub">
                  TruMove is the only platform where you build your own inventory, get instant AI pricing, 
                  and vet movers using real federal data — all before you talk to anyone.
                </p>
                <div className="tru-hero-bullets">
                  <div className="tru-hero-badge"><Cpu className="w-3.5 h-3.5 text-primary" /><span>AI-Powered Quotes</span></div>
                  <div className="tru-hero-badge"><Shield className="w-3.5 h-3.5 text-primary" /><span>FMCSA-Verified Carriers</span></div>
                  <div className="tru-hero-badge"><Video className="w-3.5 h-3.5 text-primary" /><span>Video Consultations</span></div>
                </div>
                <div className="tru-hero-actions">
                  <button className="tru-btn-primary-lg" type="button" onClick={() => navigate("/estimate")}>
                    <span>Get Your Quote</span><ArrowRight className="w-4 h-4" />
                  </button>
                  <button className="tru-hero-btn-secondary" type="button" onClick={() => navigate("/vetting")}>
                    <span>How We Vet Carriers</span>
                  </button>
                </div>
              </div>

              {/* CONCIERGE CHAT */}
              <div className="tru-hero-visual">
                <ChatContainer />
              </div>
            </div>
          </section>

          {/* WHAT MAKES TRUMOVE DIFFERENT */}
          <section className="tru-diff-wrap">
            <div className="tru-diff-inner">
              <div className="tru-diff-kicker">WHY TRUMOVE</div>
              <h2 className="tru-diff-title">The only moving platform where you're in control.</h2>
              <p className="tru-diff-sub">Most moving sites collect your info and sell it to brokers. We built something different.</p>
              
              <div className="tru-diff-grid">
                <article className="tru-diff-card" onClick={() => navigate("/estimate")}>
                  <div className="tru-diff-icon"><Boxes className="w-6 h-6" /></div>
                  <h3 className="tru-diff-card-title">Build Your Own Inventory</h3>
                  <p className="tru-diff-card-text">Pick rooms, add items, watch your move build itself. Our AI estimates weight and size so you know exactly what you're shipping.</p>
                  <span className="tru-diff-cta">Try the Inventory Builder <ArrowRight className="w-3.5 h-3.5" /></span>
                </article>

                <article className="tru-diff-card" onClick={() => navigate("/estimate")}>
                  <div className="tru-diff-icon"><Calculator className="w-6 h-6" /></div>
                  <h3 className="tru-diff-card-title">Instant AI Pricing</h3>
                  <p className="tru-diff-card-text">No waiting for callbacks. Enter your route and see a live price range in seconds — not a bait-and-switch lowball.</p>
                  <span className="tru-diff-cta">Get Your Quote <ArrowRight className="w-3.5 h-3.5" /></span>
                </article>

                <article className="tru-diff-card" onClick={() => navigate("/lookup")}>
                  <div className="tru-diff-icon"><Search className="w-6 h-6" /></div>
                  <h3 className="tru-diff-card-title">Vet Any Mover with FMCSA Data</h3>
                  <p className="tru-diff-card-text">We integrated the federal Company Snapshot database. Look up any mover's USDOT, safety record, and insurance — free.</p>
                  <span className="tru-diff-cta">Look Up a Carrier <ArrowRight className="w-3.5 h-3.5" /></span>
                </article>
              </div>
            </div>
          </section>

          {/* LONG DISTANCE EXPERTISE */}
          <section className="tru-expertise-wrap">
            <div className="tru-expertise-inner">
              <div className="tru-expertise-content">
                <div className="tru-expertise-kicker">LONG-DISTANCE EXPERTS</div>
                <h2 className="tru-expertise-title">Built for moves over 150 miles.</h2>
                <p className="tru-expertise-text">
                  Cross-country moves require interstate compliance, route optimization, and precise timing. 
                  We specialize in long-haul relocations — and our AI is trained on thousands of routes.
                </p>
                <div className="tru-expertise-stats">
                  <div className="tru-expertise-stat">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <div className="tru-expertise-stat-num">50</div>
                      <div className="tru-expertise-stat-label">States Covered</div>
                    </div>
                  </div>
                  <div className="tru-expertise-stat">
                    <Route className="w-5 h-5 text-primary" />
                    <div>
                      <div className="tru-expertise-stat-num">1,200+</div>
                      <div className="tru-expertise-stat-label">Avg. Miles per Move</div>
                    </div>
                  </div>
                  <div className="tru-expertise-stat">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <div className="tru-expertise-stat-num">0</div>
                      <div className="tru-expertise-stat-label">Spam Calls, Ever</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tru-expertise-map">
                <MoveMap fromZip="90210" toZip="10001" />
              </div>
            </div>
          </section>

          {/* HOW WE VET CARRIERS */}
          <section className="tru-vetting-wrap">
            <div className="tru-vetting-inner">
              <div className="tru-vetting-kicker">CARRIER VETTING</div>
              <h2 className="tru-vetting-title">Every mover goes through 4 stages before you see them.</h2>
              <p className="tru-vetting-sub">If their performance drops, they're automatically removed.</p>
              
              <div className="tru-vetting-steps">
                <div className="tru-vetting-step">
                  <div className="tru-vetting-step-num">1</div>
                  <div className="tru-vetting-step-title">Pre-Screen</div>
                  <div className="tru-vetting-step-text">USDOT & MC verification, active authority check</div>
                </div>
                <div className="tru-vetting-connector"></div>
                <div className="tru-vetting-step">
                  <div className="tru-vetting-step-num">2</div>
                  <div className="tru-vetting-step-title">Compliance</div>
                  <div className="tru-vetting-step-text">Insurance minimums, safety ratings, fleet inspection</div>
                </div>
                <div className="tru-vetting-connector"></div>
                <div className="tru-vetting-step">
                  <div className="tru-vetting-step-num">3</div>
                  <div className="tru-vetting-step-title">Reputation</div>
                  <div className="tru-vetting-step-text">Review analysis, complaint history, claim resolution</div>
                </div>
                <div className="tru-vetting-connector"></div>
                <div className="tru-vetting-step">
                  <div className="tru-vetting-step-num">4</div>
                  <div className="tru-vetting-step-title">Live Scoring</div>
                  <div className="tru-vetting-step-text">Ongoing performance monitoring, customer feedback loops</div>
                </div>
              </div>

              <div className="tru-vetting-cta">
                <button className="tru-btn-secondary-lg" onClick={() => navigate("/vetting")}>
                  <span>Learn More About Our Vetting</span><ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* VIDEO CONSULTS */}
          <section className="tru-video-wrap">
            <div className="tru-video-inner">
              <div className="tru-video-content">
                <div className="tru-video-icon-wrap">
                  <Video className="w-8 h-8" />
                </div>
                <h2 className="tru-video-title">Need a real conversation?</h2>
                <p className="tru-video-text">
                  Book a video call with a TruMove specialist. We'll review your quote line-by-line, 
                  vet your movers together, and answer every question — no pressure, no upsells.
                </p>
                <button className="tru-btn-primary-lg" onClick={() => navigate("/book")}>
                  <span>Book a Video Consult</span><Video className="w-4 h-4" />
                </button>
              </div>
              <div className="tru-video-features">
                <div className="tru-video-feature">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Walk through your home virtually</span>
                </div>
                <div className="tru-video-feature">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Get accurate quotes based on real items</span>
                </div>
                <div className="tru-video-feature">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Ask questions about carriers and routes</span>
                </div>
                <div className="tru-video-feature">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>No obligation — just honest answers</span>
                </div>
              </div>
            </div>
          </section>

          {/* GUARANTEE */}
          <section className="tru-mission-wrap">
            <div className="tru-mission-inner">
              <div className="tru-guarantee-wrap">
                <div className="tru-guarantee-card">
                  <div>
                    <div className="tru-guarantee-tag"><span className="tru-guarantee-tag-dot"></span><span>TruMove Guarantee</span></div>
                    <div className="tru-guarantee-title">We built TruMove from bad experiences.</div>
                    <div className="tru-guarantee-text">If we wouldn't book a mover for our own families, they don't show up in your options.</div>
                    <ul className="tru-guarantee-list">
                      <li>No spam calls sold to other brokers.</li>
                      <li>No bait-and-switch pricing.</li>
                      <li>Binding quotes — the price we give is the price you pay.</li>
                      <li>24/7 tracking from pickup to delivery.</li>
                      <li>Dedicated specialist for your entire move.</li>
                    </ul>
                  </div>
                  <div className="tru-guarantee-side">
                    <div className="tru-guarantee-side-stats">
                      <div className="tru-guarantee-side-stat">
                        <DollarSign className="w-5 h-5 text-primary" />
                        <div>
                          <span className="tru-guarantee-side-num">$0</span>
                          <span className="tru-guarantee-side-label">Hidden Fees</span>
                        </div>
                      </div>
                      <div className="tru-guarantee-side-stat">
                        <Clock className="w-5 h-5 text-primary" />
                        <div>
                          <span className="tru-guarantee-side-num">24/7</span>
                          <span className="tru-guarantee-side-label">Tracking</span>
                        </div>
                      </div>
                      <div className="tru-guarantee-side-stat">
                        <Headphones className="w-5 h-5 text-primary" />
                        <div>
                          <span className="tru-guarantee-side-num">1:1</span>
                          <span className="tru-guarantee-side-label">Dedicated Support</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tru-trust-wrap">
                <div className="tru-trust-row">
                  <span className="tru-trust-label">Trusted across thousands of moves.</span>
                  {["FMCSA Authorized", "USDOT Compliant", "BBB Accredited"].map(b => (
                    <span key={b} className="tru-trust-badge"><span className="tru-trust-dot"></span><span>{b}</span></span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="tru-final-cta-wrap">
            <div className="tru-final-cta-inner">
              <h2 className="tru-final-cta-title">Ready to move?</h2>
              <p className="tru-final-cta-sub">Get your free quote in 60 seconds. No spam, no callbacks you didn't ask for.</p>
              <div className="tru-final-cta-actions">
                <button className="tru-btn-primary-xl" onClick={() => navigate("/estimate")}>
                  <span>Get Your Free Quote</span><ArrowRight className="w-5 h-5" />
                </button>
                <div className="tru-final-cta-or">or</div>
                <a href="tel:+18005551234" className="tru-final-cta-phone">
                  <Phone className="w-4 h-4" />
                  <span>Call (800) 555-1234</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
