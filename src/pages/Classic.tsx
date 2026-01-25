import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Shield, Truck, Users, Star, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

const Classic = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    moveSize: '',
    moveDate: '',
    movingFrom: '',
    movingTo: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission with variant field
    const submissionData = {
      ...formData,
      variant: 'classic',
      timestamp: new Date().toISOString(),
    };

    console.log('Classic form submission:', submissionData);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Thank you! We will contact you shortly.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      moveSize: '',
      moveDate: '',
      movingFrom: '',
      movingTo: '',
      message: '',
    });
    setIsSubmitting(false);
  };

  const services = [
    {
      title: 'Local Moving',
      description: 'Quick, efficient moves across town. Our experienced team knows every neighborhood.',
      icon: Truck,
    },
    {
      title: 'Long Distance',
      description: 'Coast-to-coast relocations handled with precision, safety, and reliable timing.',
      icon: MapPin,
    },
    {
      title: 'Senior Moving',
      description: 'Gentle, compassionate services designed specifically for seniors and their families.',
      icon: Users,
    },
    {
      title: 'Packing Services',
      description: 'Professional packing with quality materials to protect your valuables.',
      icon: Shield,
    },
  ];

  const whyChooseUs = [
    {
      title: 'Fully Licensed & Insured',
      description: 'Your belongings are protected from start to finish with comprehensive coverage.',
    },
    {
      title: 'Nationwide Coverage',
      description: 'Whether moving across town or across the country, we have you covered.',
    },
    {
      title: 'Friendly, Professional Team',
      description: 'Our movers are trained, respectful, and dedicated to making your move easy.',
    },
    {
      title: 'No Hidden Fees',
      description: 'Transparent pricing with no surprises. You always know what you\'re paying for.',
    },
  ];

  const testimonials = [
    {
      name: 'Margaret S.',
      text: 'The crew was wonderful - so patient and careful with my antiques. I couldn\'t have asked for better service.',
    },
    {
      name: 'Robert & Linda M.',
      text: 'After 40 years in our home, we were dreading the move. TruMove made it completely stress-free.',
    },
    {
      name: 'James T.',
      text: 'Professional, punctual, and reasonably priced. They treated our furniture like it was their own.',
    },
  ];

  const faqs = [
    {
      question: 'How far in advance should I book my move?',
      answer: 'We recommend booking at least 2-4 weeks in advance, especially during peak moving seasons (May through September). This ensures we can accommodate your preferred dates.',
    },
    {
      question: 'Do you provide packing materials and services?',
      answer: 'Yes! We offer complete packing services including all materials - boxes, tape, bubble wrap, and specialty containers for fragile items. You can choose full-service packing or just the materials.',
    },
    {
      question: 'What items can\'t you move?',
      answer: 'For safety reasons, we cannot transport hazardous materials, perishables, plants, or items of extraordinary value like cash or important documents. We\'re happy to provide a complete list.',
    },
    {
      question: 'How do you calculate the cost of a move?',
      answer: 'Moving costs depend on distance, volume of belongings, and services needed. We provide free, no-obligation estimates after understanding your specific needs.',
    },
    {
      question: 'What if something gets damaged during the move?',
      answer: 'All moves include basic liability coverage. We also offer additional protection options. Our team takes every precaution, and in the rare event of damage, we have a straightforward claims process.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar - Phone CTA */}
      <div className="bg-primary text-primary-foreground py-3">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
          <span className="text-base font-semibold">Get Your Free Quote Today</span>
          <a 
            href="tel:1-800-555-MOVE" 
            className="flex items-center gap-2 text-lg font-bold hover:underline"
          >
            <Phone className="w-5 h-5" />
            Call Us: 1-800-555-MOVE
          </a>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-border py-4 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="TruMove" className="h-10" />
            <span className="text-2xl font-bold text-foreground">TruMove</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-base text-foreground hover:text-primary transition-colors">Services</a>
            <a href="#quote" className="text-base text-foreground hover:text-primary transition-colors">Get Quote</a>
            <a href="#about" className="text-base text-foreground hover:text-primary transition-colors">About Us</a>
            <a href="#faq" className="text-base text-foreground hover:text-primary transition-colors">FAQ</a>
          </nav>
          <a 
            href="tel:1-800-555-MOVE" 
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">1-800-555-MOVE</span>
            <span className="sm:hidden">Call Now</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-muted/50 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Trusted Movers Who Treat You Like Family
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Moving can be stressful. We're here to make it simple, safe, and worry-free. 
              With decades of experience, we handle your belongings with the care they deserve.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="#quote" 
                className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors text-center"
              >
                Get Your Free Quote
              </a>
              <a 
                href="tel:1-800-555-MOVE" 
                className="w-full sm:w-auto border-2 border-primary text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/5 transition-colors text-center"
              >
                Call 1-800-555-MOVE
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Moving Services For Every Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We cover every detail so you don't have to. From packing to unpacking, local moves to cross-country relocations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="bg-muted/30 border border-border rounded-xl p-6 text-center hover:shadow-lg hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                <p className="text-base text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section id="quote" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Get Your Free Quote
              </h2>
              <p className="text-lg text-muted-foreground">
                Tell us about your move and we'll provide a no-obligation estimate. We pride ourselves on fair, transparent pricing.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-foreground mb-2">
                    Your Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name"
                    required
                    className="h-12 text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    required
                    className="h-12 text-base"
                  />
                </div>
              </div>
              <div>
                <label className="block text-base font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  className="h-12 text-base"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-foreground mb-2">
                    Move Size
                  </label>
                  <Select
                    value={formData.moveSize}
                    onValueChange={(value) => setFormData({ ...formData, moveSize: value })}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select size..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="studio">Studio / Small Apartment</SelectItem>
                      <SelectItem value="1bed">1 Bedroom</SelectItem>
                      <SelectItem value="2bed">2 Bedrooms</SelectItem>
                      <SelectItem value="3bed">3 Bedrooms</SelectItem>
                      <SelectItem value="4bed">4+ Bedrooms</SelectItem>
                      <SelectItem value="office">Office / Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-base font-medium text-foreground mb-2">
                    Preferred Move Date
                  </label>
                  <Input
                    type="date"
                    value={formData.moveDate}
                    onChange={(e) => setFormData({ ...formData, moveDate: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-medium text-foreground mb-2">
                    Moving From
                  </label>
                  <Input
                    type="text"
                    value={formData.movingFrom}
                    onChange={(e) => setFormData({ ...formData, movingFrom: e.target.value })}
                    placeholder="City, State or ZIP"
                    className="h-12 text-base"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-foreground mb-2">
                    Moving To
                  </label>
                  <Input
                    type="text"
                    value={formData.movingTo}
                    onChange={(e) => setFormData({ ...formData, movingTo: e.target.value })}
                    placeholder="City, State or ZIP"
                    className="h-12 text-base"
                  />
                </div>
              </div>
              <div>
                <label className="block text-base font-medium text-foreground mb-2">
                  Additional Details (Optional)
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about any special requirements, large items, or questions..."
                  rows={4}
                  className="text-base"
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-semibold"
              >
                {isSubmitting ? 'Sending...' : 'Request My Free Quote'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                No obligation • Quick response • Transparent pricing
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose TruMove?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              When you choose us, you choose peace of mind. Here's what to expect.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-6 bg-muted/30 rounded-xl">
                <CheckCircle2 className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-base text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Customers Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-border">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-base text-muted-foreground mb-4 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <p className="text-base font-semibold text-foreground">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions? We have answers. If you don't see your question here, give us a call.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-border rounded-xl overflow-hidden bg-white"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                >
                  <span className="text-lg font-medium text-foreground pr-4">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-5 pb-5">
                    <p className="text-base text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Contact us today for a free, no-obligation quote. We're here to make your move as smooth as possible.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#quote" 
              className="w-full sm:w-auto bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/90 transition-colors text-center"
            >
              Get Free Quote
            </a>
            <a 
              href="tel:1-800-555-MOVE" 
              className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              1-800-555-MOVE
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={logo} alt="TruMove" className="h-8 brightness-0 invert" />
                <span className="text-xl font-bold">TruMove</span>
              </div>
              <p className="text-sm opacity-80 leading-relaxed">
                Professional moving services with care and integrity. Licensed, insured, and trusted by families nationwide.
              </p>
            </div>
            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-3 text-sm opacity-80">
                <a href="tel:1-800-555-MOVE" className="flex items-center gap-2 hover:opacity-100">
                  <Phone className="w-4 h-4" />
                  1-800-555-MOVE
                </a>
                <a href="mailto:info@trumove.com" className="flex items-center gap-2 hover:opacity-100">
                  <Mail className="w-4 h-4" />
                  info@trumove.com
                </a>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Mon-Sat: 8am - 6pm
                </div>
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm opacity-80">
                <a href="#services" className="block hover:opacity-100">Our Services</a>
                <a href="#quote" className="block hover:opacity-100">Get a Quote</a>
                <a href="#faq" className="block hover:opacity-100">FAQ</a>
              </div>
            </div>
          </div>
          <Separator className="bg-background/20 mb-8" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-70">
            <p>© {new Date().getFullYear()} TruMove. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="hover:opacity-100">Privacy Policy</a>
              <a href="/terms" className="hover:opacity-100">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Classic;
