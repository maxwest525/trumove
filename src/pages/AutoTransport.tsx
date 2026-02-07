import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Car, Truck, Shield, Clock, MapPin, CheckCircle2, 
  ChevronRight, ChevronDown, Phone, Calendar,
  Package, Eye, FileText, Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "@/components/layout/Footer";

// Trust items for the hero
const TRUST_ITEMS = [
  { icon: Shield, label: "Fully Insured" },
  { icon: Clock, label: "On-Time Delivery" },
  { icon: CheckCircle2, label: "Door-to-Door" },
];

// How it works steps
const HOW_IT_WORKS = [
  { step: 1, title: "Get a Quote", description: "Enter your vehicle and route details for an instant estimate." },
  { step: 2, title: "Book & Schedule", description: "Choose your pickup date and confirm your transport." },
  { step: 3, title: "Vehicle Pickup", description: "We collect your vehicle with a detailed condition report." },
  { step: 4, title: "Track & Receive", description: "Monitor your shipment and receive your vehicle safely." },
];

// FAQ items
const FAQ_ITEMS = [
  {
    question: "How long does auto transport take?",
    answer: "Transit times vary based on distance. Cross-country shipments typically take 7-10 days, while regional moves are often completed in 3-5 days."
  },
  {
    question: "Is my vehicle insured during transport?",
    answer: "Yes, all vehicles are covered by carrier insurance during transport. We also offer supplemental coverage options for additional peace of mind."
  },
  {
    question: "Can I ship a non-running vehicle?",
    answer: "Absolutely. We transport non-running, inoperable, and project vehicles. Additional equipment fees may apply."
  },
  {
    question: "What's the difference between open and enclosed transport?",
    answer: "Open transport is cost-effective and suitable for most vehicles. Enclosed transport provides weather and debris protection, ideal for luxury, classic, or high-value vehicles."
  },
];

export default function AutoTransport() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="auto-transport-page">
      {/* ═══════════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="at-hero">
        <div className="at-hero-content">
          <h1 className="at-hero-headline">
            Vehicle Transport,<br />
            <span className="at-hero-headline-accent">Simplified.</span>
          </h1>
          <p className="at-hero-subheadline">
            Coast-to-coast auto shipping with real-time tracking, 
            transparent pricing, and white-glove service.
          </p>
          
          <div className="at-hero-ctas">
            <Button className="at-btn-primary" size="lg">
              Get Instant Quote
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="at-btn-secondary" size="lg">
              <Phone className="w-4 h-4" />
              Speak to an Expert
            </Button>
          </div>

          {/* Trust Strip */}
          <div className="at-trust-strip">
            {TRUST_ITEMS.map((item, idx) => (
              <div key={item.label} className="at-trust-item">
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {idx < TRUST_ITEMS.length - 1 && <span className="at-trust-dot">•</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          DEMO QUOTE WIZARD SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="at-section">
        <div className="at-section-header">
          <span className="at-section-label">Instant Pricing</span>
          <h2 className="at-section-title">Get Your Quote</h2>
          <p className="at-section-subtitle">
            Enter your details for a transparent, all-inclusive estimate.
          </p>
        </div>

        <Card className="at-wizard-card">
          <CardContent className="at-wizard-content">
            {/* Step Indicators */}
            <div className="at-wizard-steps">
              {[1, 2, 3].map((step) => (
                <button
                  key={step}
                  className={`at-wizard-step ${activeStep >= step ? 'is-active' : ''} ${activeStep === step ? 'is-current' : ''}`}
                  onClick={() => setActiveStep(step)}
                >
                  <span className="at-wizard-step-num">{step}</span>
                  <span className="at-wizard-step-label">
                    {step === 1 ? 'Route' : step === 2 ? 'Vehicle' : 'Options'}
                  </span>
                </button>
              ))}
            </div>

            {/* Wizard Placeholder */}
            <div className="at-wizard-body">
              <div className="at-wizard-placeholder">
                <Package className="w-8 h-8" />
                <p>Quote wizard form will appear here</p>
                <span className="at-wizard-placeholder-step">Step {activeStep} of 3</span>
              </div>
            </div>

            <div className="at-wizard-footer">
              <Button 
                variant="outline" 
                className="at-btn-secondary"
                disabled={activeStep === 1}
                onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
              >
                Back
              </Button>
              <Button 
                className="at-btn-primary"
                onClick={() => setActiveStep(Math.min(3, activeStep + 1))}
              >
                {activeStep === 3 ? 'Get Quote' : 'Continue'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          VEHICLE VIEWER SECTION (3D Spin Demo)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="at-section at-section-alt">
        <div className="at-section-header">
          <span className="at-section-label">Interactive Preview</span>
          <h2 className="at-section-title">Vehicle Viewer</h2>
          <p className="at-section-subtitle">
            Inspect your vehicle from every angle with our 360° viewer.
          </p>
        </div>

        <Card className="at-viewer-card">
          <CardContent className="at-viewer-content">
            <div className="at-viewer-placeholder">
              <Car className="w-12 h-12" />
              <p>3D Vehicle Spin Demo</p>
              <span>Drag to rotate • Scroll to zoom</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CONDITION REPORT SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="at-section">
        <div className="at-section-header">
          <span className="at-section-label">Documentation</span>
          <h2 className="at-section-title">Condition Report</h2>
          <p className="at-section-subtitle">
            Comprehensive photo documentation before and after transport.
          </p>
        </div>

        <Card className="at-report-card">
          <CardContent className="at-report-content">
            <div className="at-report-grid">
              <div className="at-report-panel">
                <div className="at-report-panel-header">
                  <Eye className="w-5 h-5" />
                  <span>Pickup Inspection</span>
                </div>
                <div className="at-report-placeholder">
                  <FileText className="w-8 h-8" />
                  <p>Pre-transport photos & notes</p>
                </div>
              </div>
              <div className="at-report-panel">
                <div className="at-report-panel-header">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Delivery Inspection</span>
                </div>
                <div className="at-report-placeholder">
                  <FileText className="w-8 h-8" />
                  <p>Post-transport verification</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SHIPMENT TRACKER SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="at-section at-section-alt">
        <div className="at-section-header">
          <span className="at-section-label">Real-Time Updates</span>
          <h2 className="at-section-title">Shipment Tracker</h2>
          <p className="at-section-subtitle">
            Know exactly where your vehicle is at every step of the journey.
          </p>
        </div>

        <Card className="at-tracker-card">
          <CardContent className="at-tracker-content">
            <div className="at-tracker-layout">
              {/* Map Placeholder */}
              <div className="at-tracker-map">
                <div className="at-tracker-map-placeholder">
                  <Navigation className="w-10 h-10" />
                  <p>Live GPS Tracking Map</p>
                </div>
              </div>

              {/* ETA Timeline */}
              <div className="at-tracker-timeline">
                <div className="at-tracker-eta">
                  <span className="at-tracker-eta-label">Estimated Arrival</span>
                  <span className="at-tracker-eta-value">Feb 12, 2026</span>
                </div>
                <div className="at-tracker-steps">
                  {['Pickup Confirmed', 'In Transit', 'Nearing Destination', 'Delivered'].map((step, idx) => (
                    <div key={step} className={`at-tracker-step ${idx === 0 ? 'is-complete' : idx === 1 ? 'is-active' : ''}`}>
                      <div className="at-tracker-step-dot" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          HOW IT WORKS + FAQ SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="at-section">
        <div className="at-dual-layout">
          {/* How It Works */}
          <div className="at-how-it-works">
            <div className="at-section-header at-section-header-left">
              <span className="at-section-label">Process</span>
              <h2 className="at-section-title">How It Works</h2>
            </div>
            <div className="at-steps-list">
              {HOW_IT_WORKS.map((item) => (
                <div key={item.step} className="at-step-item">
                  <div className="at-step-num">{item.step}</div>
                  <div className="at-step-text">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="at-faq">
            <div className="at-section-header at-section-header-left">
              <span className="at-section-label">Questions</span>
              <h2 className="at-section-title">FAQ</h2>
            </div>
            <Accordion type="single" collapsible className="at-faq-list">
              {FAQ_ITEMS.map((item, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="at-faq-item">
                  <AccordionTrigger className="at-faq-trigger">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="at-faq-content">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BOTTOM CTA SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="at-cta-section">
        <div className="at-cta-content">
          <h2 className="at-cta-headline">Ready to Ship Your Vehicle?</h2>
          <p className="at-cta-subheadline">
            Get a free quote in under 60 seconds. No obligation.
          </p>
          <div className="at-cta-buttons">
            <Button className="at-btn-primary" size="lg">
              Get Your Quote
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="at-btn-secondary" size="lg">
              <Calendar className="w-4 h-4" />
              Schedule a Call
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
