import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "Saved $1,200 vs the van line quote. The AI scanner was incredibly accurate!",
    name: "Jennifer M.",
    location: "Boca Raton, FL",
    initials: "JM",
  },
  {
    quote: "Video consult made it so easy. No surprises on move day.",
    name: "David K.",
    location: "Miami, FL",
    initials: "DK",
  },
  {
    quote: "Finally, a moving company that uses real technology to help.",
    name: "Sarah T.",
    location: "Fort Lauderdale, FL",
    initials: "ST",
  },
];

export default function CompactTestimonials() {
  return (
    <section className="tru-testimonials-compact">
      <div className="tru-testimonials-compact-inner">
        <div className="tru-testimonials-compact-header">
          <h3 className="tru-testimonials-compact-title">What Our Customers Say</h3>
        </div>
        <div className="tru-testimonials-compact-grid">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="tru-testimonial-compact-card">
              <div className="tru-testimonial-compact-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} />
                ))}
              </div>
              <p className="tru-testimonial-compact-quote">"{t.quote}"</p>
              <div className="tru-testimonial-compact-author">
                <div className="tru-testimonial-compact-avatar">{t.initials}</div>
                <div className="tru-testimonial-compact-info">
                  <span className="tru-testimonial-compact-name">{t.name}</span>
                  <span className="tru-testimonial-compact-location">{t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
