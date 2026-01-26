import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "Saved $1,200 vs the van line quote and the crew was amazing. TruMove's video consult made planning so easy — they walked through my entire house with me!",
    name: "Sarah M.",
    location: "Boca Raton, FL",
    rating: 5,
    moveType: "3 Bed → Miami"
  },
  {
    quote: "After being ghosted by two 'big name' movers, TruMove matched us with a fantastic local team. They showed up early, handled our antiques with care, and stayed until the job was done right.",
    name: "James & Linda K.",
    location: "Denver, CO",
    rating: 5,
    moveType: "Long Distance"
  },
  {
    quote: "The AI inventory scanner actually works! I just pointed my phone around each room and it built my whole list. The quote was accurate to within $50 of the final bill.",
    name: "Michael T.",
    location: "Austin, TX",
    rating: 5,
    moveType: "2 Bed Apartment"
  },
  {
    quote: "As a senior moving after 40 years in my home, I was overwhelmed. TruMove connected me with patient movers who treated my memories with respect. Worth every penny.",
    name: "Dorothy P.",
    location: "Scottsdale, AZ",
    rating: 5,
    moveType: "Senior Move"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="tru-testimonials-section">
      <div className="tru-testimonials-inner">
        <div className="tru-testimonials-header">
          <span className="tru-testimonials-kicker">Real Stories</span>
          <h2 className="tru-testimonials-title">Families trust TruMove for stress-free moves</h2>
        </div>
        
        <div className="tru-testimonials-grid">
          {TESTIMONIALS.map((testimonial, idx) => (
            <div key={idx} className="tru-testimonial-card">
              <div className="tru-testimonial-quote-icon">
                <Quote className="w-5 h-5" />
              </div>
              
              <div className="tru-testimonial-stars">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              
              <blockquote className="tru-testimonial-quote">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="tru-testimonial-author">
                <div className="tru-testimonial-avatar">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="tru-testimonial-info">
                  <span className="tru-testimonial-name">{testimonial.name}</span>
                  <span className="tru-testimonial-location">{testimonial.location}</span>
                </div>
                <span className="tru-testimonial-move-type">{testimonial.moveType}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
